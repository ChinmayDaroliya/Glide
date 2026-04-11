"use server"

import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { onCurrentUser } from "../user"
import { createIntegration, getIntegration, updateIntegrations } from "./query"
import { generateTokens } from "@/lib/fetch"
import { signInstagramOAuthState } from "@/lib/oauth-state"
import axios from "axios"

const getInstagramRedirectUri = () => {
    if (process.env.INSTAGRAM_REDIRECT_URI) {
        return process.env.INSTAGRAM_REDIRECT_URI
    }
    return `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`
}

export const onOAuthInstagram = async (strategy: 'INSTAGRAM' | 'CRM') => {
    if (strategy === 'INSTAGRAM') {
        const sessionUser = await currentUser()
        if (!sessionUser) {
            return redirect('/sign-in')
        }

        const clientId = process.env.INSTAGRAM_CLIENT_ID
        const redirectUri = getInstagramRedirectUri()

        console.log('\n' + '='.repeat(50))
        console.log('=== INSTAGRAM OAUTH INITIATION ===')
        console.log('='.repeat(50))
        console.log('OAuth Init: Client ID:', clientId ? 'SET' : 'MISSING')
        console.log('OAuth Init: Redirect URI:', redirectUri)
        console.log('OAuth Init: Scope:', process.env.INSTAGRAM_OAUTH_SCOPE || 'DEFAULT_SCOPE')
        console.log('='.repeat(50) + '\n')

        // Use Facebook Login permission names (not instagram_business_*), which are for Business Login for Instagram.
        // See: https://developers.facebook.com/docs/facebook-login/permissions
        const scope = process.env.INSTAGRAM_OAUTH_SCOPE ??
            'instagram_basic,instagram_manage_messages,instagram_manage_comments,pages_show_list,pages_read_engagement'

        if (!clientId || !redirectUri) {
            throw new Error("Missing Instagram OAuth environment variables")
        }

        const oauthUrl = new URL('https://www.facebook.com/v21.0/dialog/oauth')
        oauthUrl.searchParams.set('client_id', clientId)
        oauthUrl.searchParams.set('redirect_uri', redirectUri)
        oauthUrl.searchParams.set('scope', scope)
        oauthUrl.searchParams.set('response_type', 'code')
        oauthUrl.searchParams.set('state', signInstagramOAuthState(sessionUser.id))

        return redirect(oauthUrl.toString())
    }
}

export const onIntegrate = async (code: string, userId?: string) => {
    console.log('\n' + '='.repeat(50))
    console.log('=== INSTAGRAM INTEGRATION PROCESS STARTED ===')
    console.log('='.repeat(50))

    const user = userId ? { id: userId } : await onCurrentUser()

    try {
        const integration = await getIntegration(user.id)

        if (integration && integration.Integrations.length === 0) {

            const token = await generateTokens(code)

            if (token) {

                // STEP 1 — get pages
                const pages = await axios.get(
                    `https://graph.facebook.com/v21.0/me/accounts?access_token=${token.access_token}`
                )

                if (!pages.data.data.length) {
                    console.log("No pages found")
                    return { status: 404 }
                }

                const pageId = pages.data.data[0].id

                // STEP 2 — get instagram business account
                const insta = await axios.get(
                    `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account`
                )

                const igId = insta.data.instagram_business_account?.id

                if (!igId) {
                    console.log("No instagram business account connected")
                    return { status: 404 }
                }

                const today = new Date()
                const expire_date = today.setDate(today.getDate() + 60)

                const create = await createIntegration(
                    user.id,
                    token.access_token,
                    new Date(expire_date),
                    igId
                )

                return { status: 200, data: create }
            }

            return { status: 401 }
        }

        if (integration && integration.Integrations.length > 0) {

            const token = await generateTokens(code)

            if (token) {

                const today = new Date()
                const expire_date = today.setDate(today.getDate() + 60)

                const update = await updateIntegrations(
                    token.access_token,
                    new Date(expire_date),
                    integration.Integrations[0].id
                )

                if (!update) return { status: 500 }

                return {
                    status: 200,
                    data: {
                        firstname: integration.firstname,
                        lastname: integration.lastname
                    }
                }
            }

            return { status: 401 }
        }

        return { status: 404 }

    } catch (error: any) {
        console.log("onIntegrate error:", error)
        return { status: 500 }
    }
}