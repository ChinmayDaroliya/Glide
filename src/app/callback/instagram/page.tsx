import { onIntegrate } from '@/actions/integrations'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    searchParams : {code: string}
}

const Page = async({searchParams:{code}}: Props) => {
    
    console.log("OAuth Callback: Received code:", code ? "YES" : "NO")
    
    // Check if user is authenticated
    const user = await currentUser()
    if (!user) {
        console.log("OAuth Callback: No user authenticated, redirecting to sign-in")
        return redirect('/sign-in')
    }
    
    console.log("OAuth Callback: User authenticated:", user.id)
    
    if(code){
        console.log("OAuth Callback: Processing integration with code:", code.substring(0, 20) + "...")
        try {
            const integrationResult = await onIntegrate(code.split("#_")[0], user.id)
            console.log("OAuth Callback: Integration result status:", integrationResult.status)
            
            if(integrationResult.status === 200){
                console.log("OAuth Callback: Integration result data:", JSON.stringify(integrationResult.data, null, 2))
                const firstName = integrationResult.data?.firstname
                const lastName = integrationResult.data?.lastname
                console.log("OAuth Callback: Firstname:", firstName, "Lastname:", lastName)
                const fullName = firstName + (lastName ? lastName : '')
                console.log("OAuth Callback: Constructed fullName:", fullName)
                const redirectUrl = `/dashboard/${fullName}/integrations`
                console.log("OAuth Callback: Final redirect URL:", redirectUrl)
                return redirect(redirectUrl)
            } else {
                console.log("OAuth Callback: Integration failed with status:", integrationResult.status)
            }
        } catch (error) {
            console.log("OAuth Callback: Error during integration:", error)
        }
    } else {
        console.log("OAuth Callback: No code received, redirecting to dashboard")
    }

    console.log("OAuth Callback: Fallback redirect to dashboard")
   console.log("FULL URL CODE:", code)
    return redirect('/dashboard')
}

export default Page
