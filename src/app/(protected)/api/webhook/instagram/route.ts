import { createChatHistory, getChatHistory, getKeywordAutomation, getKeywordPost, matchKeyword, trackResponses } from "@/actions/webhook/queries";
import { sendDM, sendPrivateMessage } from "@/lib/fetch";
import { NextRequest, NextResponse } from "next/server";
import { openai } from '@/lib/openai'
import { client } from "@/lib/prisma";
import { findAutomation } from "@/actions/automations/queries";
import { id } from "date-fns/locale";

export async function GET(req: NextRequest) {
    const hub = req.nextUrl.searchParams.get("hub.challenge")
    return new NextResponse(hub)
}

export async function POST(req: NextRequest) {
    const webhook_payload = await req.json()
    let matcher

    console.log("WEBHOOK RECEIVED", JSON.stringify(webhook_payload, null, 2))

    try {
        if (webhook_payload.entry[0].messaging) {
            matcher = await matchKeyword(
                webhook_payload.entry[0].messaging[0].message.text
            )
        }

        if (webhook_payload.entry[0].changes) {
            matcher = await matchKeyword(
                webhook_payload.entry[0].changes[0].value.text
            )
        }

        if (matcher && matcher.automationId) {

            console.log("AUTOMATION MATCHED", {
                automationId: matcher.automationId,
                payload: webhook_payload.entry[0]
            })

            if (webhook_payload.entry[0].messaging) {

                const automation = await getKeywordAutomation(
                    matcher.automationId,
                    true
                )

                const listener = automation?.Listener

                if (automation && automation.Trigger?.length) {

                    if (listener && listener.listener === 'MESSAGE') {

                        console.log("SENDING DM", {
                            type: "DM",
                            recipient: webhook_payload.entry[0].messaging[0].sender.id,
                            prompt: listener?.prompt,
                            token: automation.User?.Integrations[0].token?.slice(0, 10)
                        })

                        const direct_message = await sendDM(
                            automation.User?.Integrations[0].instagramId!,
                            webhook_payload.entry[0].messaging[0].sender.id,
                            listener?.prompt,
                            automation.User?.Integrations[0].token!,
                        )

                        if (direct_message.status === 200) {
                            const tracked = await trackResponses(automation.id, 'DM')

                            if (tracked) {
                                return NextResponse.json(
                                    { message: 'Message sent' },
                                    { status: 200 }
                                )
                            }
                        }
                    }
                }
            }

          if (
    webhook_payload.entry[0].changes &&
    webhook_payload.entry[0].changes[0].field === "comments"
) {
    const automation = await getKeywordAutomation(
        matcher.automationId,
        false
    )

    const listener = automation?.Listener

    const automations_post = await getKeywordPost(
        webhook_payload.entry[0].changes[0].value.media.id,
        automation?.id!
    )

    console.log("POST MATCH CHECK", {
        mediaId: webhook_payload.entry[0].changes[0].value.media.id,
        automations_post
    })

    if (automation && automation.Trigger?.length) {
        if (listener && listener.listener === 'MESSAGE') {

            console.log("SENDING DM", {
                type: "COMMENT",
                commentId: webhook_payload.entry[0].changes[0].value.id,
                prompt: listener?.prompt,
                token: automation.User?.Integrations[0].token?.slice(0, 10)
            })

            const direct_message = await sendDM(
                automation.User?.Integrations[0].instagramId!,
                webhook_payload.entry[0].changes[0].value.from.id,
                listener?.prompt,
                automation.User?.Integrations[0].token!
            )

            if (direct_message.status === 200) {
                const tracked = await trackResponses(automation.id, 'COMMENT')

                if (tracked) {
                    return NextResponse.json(
                        { message: 'Message sent' },
                        { status: 200 }
                    )
                }
            }
        }
    }
}
        }

        return NextResponse.json(
            { message: 'No automation set' },
            { status: 200 }
        )

    } catch (error: any) {
        console.error("Webhook processing error:", error.response?.data || error.message || error)

        return NextResponse.json(
            { message: 'No automation set' },
            { status: 200 }
        )
    }
}