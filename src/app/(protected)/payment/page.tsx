import { onSubscribe } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
    searchParams: Promise<{session_id?: string; cancel?: boolean}>
}

const Page = async ({searchParams}: Props) => {
    const resolvedParams = await searchParams
    const session_id = resolvedParams.session_id
    const cancel = resolvedParams.cancel
  
    if(session_id){
        const customer = await onSubscribe(session_id)

        if(customer.status === 200){
            return redirect('/dashboard')
        }
    
        return (
            <div className='flex flex-col justify-center items-center h-screen w-full'>
                <h4 className='text-5xl font-bold'>404</h4>
                <p className='text-xl font-bold'>Oops! something went wrong</p>
            </div>
        )
    } 

    if(cancel){
        return (
            <div className='flex flex-col justify-center items-center h-screen w-full'>
                <h4 className='text-5xl font-bold'>404</h4>
                <p className='text-xl font-bold'>Oops! something went wrong</p>
            </div>
        )
    }
    
}

export default Page