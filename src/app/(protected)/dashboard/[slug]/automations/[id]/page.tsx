import { getAutomationInfo } from '@/actions/automations'
import ThenNode from '@/components/global/automations/then/node'
import Trigger from '@/components/global/automations/trigger'
import AutomationsBreadCrumb from '@/components/global/bread-crumbs/automations'
import { Warning } from '@/icons'
import { prefetchUserAutomation } from '@/react-query/prefetch'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetaData({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const info = await getAutomationInfo(resolvedParams.id)

    return {
        title: info.data?.name,
    }
}

const Page = async ({params}: Props) => {
    const resolvedParams = await params
    const query = new QueryClient()

    await prefetchUserAutomation(query, resolvedParams.id)


  return (
    <HydrationBoundary state={dehydrate(query)}>
    <div className='flex flex-col items-center gap-y-20'>
        <AutomationsBreadCrumb id={resolvedParams.id}/>
        <div className='w-full lg:w-10/12 xl:w-6/12 p-5 rounded-xl flex flex-col bg-[#1D1D1D]
        gap-y-3'>
            <div className='flex gap-x-2'>
                <Warning/>
                When...
            </div>
            <Trigger id={resolvedParams.id}/>
        </div>
        <ThenNode id={resolvedParams.id}/>
    </div>
    </HydrationBoundary>
  )
}

export default Page
