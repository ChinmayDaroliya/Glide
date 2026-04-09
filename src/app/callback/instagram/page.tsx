import { onIntegrate } from '@/actions/integrations'
import { verifyInstagramOAuthState } from '@/lib/oauth-state'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    searchParams: Promise<{
        code?: string
        state?: string
        error?: string
        error_description?: string
    }>
}

const Page = async({searchParams}: Props) => {
    const params = await searchParams
    const code = params.code
    console.log("=== OAUTH CALLBACK START ===")
    console.log("OAuth Callback: Received code:", code ? "YES" : "NO")
    console.log("OAuth Callback: Full searchParams:", params)

    if (params.error) {
        console.log("OAuth Callback: Instagram returned error:", params.error)
        console.log("OAuth Callback: Error description:", params.error_description)
        return redirect('/dashboard')
    }

    const clerkIdFromState = verifyInstagramOAuthState(params.state)
    const sessionUser = await currentUser()
    const effectiveClerkId = clerkIdFromState ?? sessionUser?.id

    if (!effectiveClerkId) {
        console.log("OAuth Callback: No valid state and no Clerk session — cannot tie OAuth to user")
        return redirect('/sign-in')
    }

    console.log("OAuth Callback: Clerk user for integration:", effectiveClerkId, "fromState:", !!clerkIdFromState)
    
    if(code){
        console.log("OAuth Callback: Processing integration with code:", code.substring(0, 30) + "...")
        console.log("OAuth Callback: Code split:", code.split("#_")[0])
        
        try {
            console.log("OAuth Callback: Calling onIntegrate...")
            const integrationResult = await onIntegrate(code.split("#_")[0], effectiveClerkId)
            console.log("OAuth Callback: Integration result status:", integrationResult.status)
            console.log("OAuth Callback: Integration result data:", JSON.stringify(integrationResult.data, null, 2))
            
            if(integrationResult.status === 200){
                const firstName = integrationResult.data?.firstname
                const lastName = integrationResult.data?.lastname
                console.log("OAuth Callback: Firstname:", firstName, "Lastname:", lastName)
                const fullName = firstName + (lastName ? lastName : '')
                console.log("OAuth Callback: Constructed fullName:", fullName)
                const redirectUrl = `/dashboard/${fullName}/integrations`
                console.log("OAuth Callback: Final redirect URL:", redirectUrl)
                console.log("OAuth Callback: About to redirect to:", redirectUrl)
                return redirect(redirectUrl)
            } else {
                console.log("OAuth Callback: Integration failed with status:", integrationResult.status)
                console.log("OAuth Callback: Integration result:", JSON.stringify(integrationResult, null, 2))
            }
        } catch (error: any) {
            console.log("OAuth Callback: Error during integration:", error)
            console.log("OAuth Callback: Error stack:", error.stack)
        }
    } else {
        console.log("OAuth Callback: No code received, redirecting to dashboard")
    }

    console.log("OAuth Callback: Fallback redirect to dashboard")
    console.log("=== OAUTH CALLBACK END ===")
    console.log("FULL URL CODE:", code)
    return redirect('/dashboard')
}

export default Page
