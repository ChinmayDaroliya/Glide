"use server"

import { redirect } from "next/navigation"
import { onCurrentUser } from "../user"
import { createIntegration, getIntegration } from "./query"
import { generateTokens } from "@/lib/fetch"
import axios from "axios"

export const onOAuthInstagram =async (strategy: 'INSTAGRAM' | 'CRM') => {
    if(strategy === 'INSTAGRAM'){
        return redirect(process.env.INSTAGRAM_EMBEDDED_OAUTH_URL as string)
    }
}

export const onIntegrate = async(code: string, userId?: string) => {
    console.log("onIntegrate: Starting integration process")
    const user = userId ? { id: userId } : await onCurrentUser()
    console.log("onIntegrate: User ID:", user.id)
    
    try {
        const integration = await getIntegration(user.id)
        console.log("onIntegrate: Existing integrations count:", integration?.integrations?.length || 0)
        
        if(integration && integration.integrations.length === 0){
            console.log("onIntegrate: Generating tokens with code")
            const token = await generateTokens(code)
            console.log("onIntegrate: Token generated:", token ? "SUCCESS" : "FAILED")

            if(token){
                const insta_id = await axios.get(
                    `${process.env.INSTAGRAM_BASE_URL}/me?fields=user_id&
                    access_token=${token.access_token}`
                )
                console.log("onIntegrate: Instagram ID retrieved:", insta_id.data.user_id)

                const today = new Date()
                const expire_date = today.setDate(today.getDate() + 60)

                const create = await createIntegration(
                    user.id,
                    token.access_token,
                    new Date(expire_date),
                    insta_id.data.user_id
                )
                console.log("onIntegrate: Integration created successfully")

                return {status: 200, data:create}
            }
            console.log("onIntegrate: Token generation failed")
            return {status: 401}
        }
        console.log("onIntegrate: User already has integration")
        return {status: 404}
    } catch (error) {
        console.log("onIntegrate: Error occurred:", error)
        return {status: 500}
    }
}