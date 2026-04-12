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
        oauthUrl.searchParams.set('auth_type', 'rerequest')
        oauthUrl.searchParams.set('state', signInstagramOAuthState(sessionUser.id))
        oauthUrl.searchParams.set(
            'extras',
            JSON.stringify({ setup: { channel: 'IG_API_ONBOARDING' } })
        )
        oauthUrl.searchParams.set('auth_type', 'rerequest')

        return redirect(oauthUrl.toString())
    }
}

export const onIntegrate = async (code: string, userId?: string) => {
    console.log('\n' + '='.repeat(50))
    console.log('=== INSTAGRAM INTEGRATION PROCESS STARTED ===')
    console.log('='.repeat(50))

    let user: { id: string }
    if (userId) {
        user = { id: userId }
    } else {
        user = await onCurrentUser()
    }

    try {
        const integration = await getIntegration(user.id)

        // CREATE NEW
        if (integration && integration.Integrations.length === 0) {
            const token = await generateTokens(code)
            if (!token) return { status: 401 }

            // ✅ FINAL CORRECT FLOW
            const me = await axios.get(
                `https://graph.facebook.com/v21.0/me?fields=accounts{instagram_business_account,name,id}&access_token=${token.access_token}`
            )

            const page = me.data.accounts?.data?.[0]

            if (!page) {
                console.log("No page found")
                return { status: 404 }
            }

            const pageId = page.id
            const igId = page.instagram_business_account?.id
            const pageAccessToken = token.access_token

            if (!igId) {
                console.log("No instagram account connected")
                return { status: 404 }
            }

            console.log("Page ID:", pageId)
            console.log("Instagram ID:", igId)

            const today = new Date()
            const expire_date = today.setDate(today.getDate() + 60)

            const create = await createIntegration(
                user.id,
                pageAccessToken,
                new Date(expire_date),
                igId
            )

            return { status: 200, data: create }
        }

        // UPDATE EXISTING
        if (integration && integration.Integrations.length > 0) {
            const token = await generateTokens(code)
            if (!token) return { status: 401 }

            const me = await axios.get(
                `https://graph.facebook.com/v21.0/me?fields=accounts{instagram_business_account,name,id}&access_token=${token.access_token}`
            )

            const page = me.data.accounts?.data?.[0]
            if (!page) return { status: 404 }

            const pageAccessToken = page.access_token

            const today = new Date()
            const expire_date = today.setDate(today.getDate() + 60)

            const update = await updateIntegrations(
                pageAccessToken,
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

        return { status: 404 }

    } catch (error: any) {
        console.log(
            'onIntegrate error:',
            error?.response?.data ?? error?.message ?? error
        )
        return { status: 500 }
    }
}