import { onIntegrate } from '@/actions/integrations'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    searchParams : {code: string}
}

const Page = async({searchParams:{code}}: Props) => {
    
    // Check if user is authenticated
    const user = await currentUser()
    if (!user) {
        return redirect('/sign-in')
    }
    
    if(code){
        console.log(code)
        const integrationResult = await onIntegrate(code.split("#_")[0], user.id)
        if(integrationResult.status === 200){
            const fullName = integrationResult.data?.firstname + (integrationResult.data?.lastname ? integrationResult.data.lastname : '')
            return redirect(`/dashboard/${fullName}/integrations`)
        }
    }

    return redirect('/dashboard')
}

export default Page
