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

export const onOAuthInstagram =async (strategy: 'INSTAGRAM' | 'CRM') => {
    if(strategy === 'INSTAGRAM'){
        const sessionUser = await currentUser()
        if (!sessionUser) {
            return redirect('/sign-in')
        }

        const clientId = process.env.INSTAGRAM_CLIENT_ID
        const redirectUri = getInstagramRedirectUri()
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

export const onIntegrate = async(code: string, userId?: string) => {
    console.log("=== ONINTEGRATE START ===")
    console.log("onIntegrate: Starting integration process")
    const user = userId ? { id: userId } : await onCurrentUser()
    console.log("onIntegrate: User ID:", user.id)
    
    try {
        console.log("onIntegrate: Calling getIntegration...")
        const integration = await getIntegration(user.id)
        console.log("onIntegrate: getIntegration result:", JSON.stringify(integration, null, 2))
        console.log("onIntegrate: Existing integrations count:", integration?.Integrations?.length || 0)
        
        if(integration && integration.Integrations.length === 0){
            console.log("onIntegrate: No existing integration, proceeding with token generation")
            console.log("onIntegrate: Calling generateTokens with code:", code.substring(0, 20) + "...")
            const token = await generateTokens(code)
            console.log("onIntegrate: Token generated:", token ? "SUCCESS" : "FAILED")

            if(token){
                console.log("onIntegrate: Token received, getting Instagram ID...")
                const insta_id = await axios.get(
                    `${process.env.INSTAGRAM_BASE_URL}/me?fields=user_id&access_token=${token.access_token}`
                )
                console.log("onIntegrate: Instagram ID retrieved:", insta_id.data.user_id)
                console.log("onIntegrate: Instagram ID type:", typeof insta_id.data.user_id)

                const today = new Date()
                const expire_date = today.setDate(today.getDate() + 60)
                console.log("onIntegrate: Token expires on:", new Date(expire_date))

                console.log("onIntegrate: Calling createIntegration...")
                const create = await createIntegration(
                    user.id,
                    token.access_token,
                    new Date(expire_date),
                    insta_id.data.user_id
                )
                console.log("onIntegrate: createIntegration result:", JSON.stringify(create, null, 2))
                console.log("onIntegrate: Integration created successfully")

                return {status: 200, data:create}
            }
            console.log("onIntegrate: Token generation failed")
            return {status: 401}
        }
        if (integration && integration.Integrations.length > 0) {
            console.log("onIntegrate: Existing integration found, proceeding with token update")
            const token = await generateTokens(code)
            if (token) {
                const today = new Date()
                const expire_date = today.setDate(today.getDate() + 60)
                const update = await updateIntegrations(
                    token.access_token,
                    new Date(expire_date),
                    integration.Integrations[0].id
                )
                if (!update) {
                    console.log("onIntegrate: Failed to update integration")
                    return { status: 500 }
                }
                console.log("onIntegrate: Integration updated successfully")
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

        console.log("onIntegrate: User does not have an integration but integration object was falsy, returning 404")
        return {status: 404}
    } catch (error: any) {
        console.log("onIntegrate: Error occurred:", error)
        console.log("onIntegrate: Error stack:", error.stack)
        return {status: 500}
    }
    console.log("=== ONINTEGRATE END ===")
}