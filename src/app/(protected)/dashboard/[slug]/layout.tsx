

import { QueryClient } from '@tanstack/react-query'
import NavBar from '@/components/global/navbar'
import Sidebar from '@/components/global/sidebar'
import React from 'react'

type Props = {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}

const Layout = async ({ children, params }: Props) => {

    // Query client
    // WIP Query client and fetch data

    const query = new QueryClient()

    
    
    const { slug } = await params

    return <div className='p-3'>
        {/* sidebar */}
        <Sidebar slug={slug} />

        {/* Navbar */}
        <div className='lg:ml-[250px] lg:pl-10 lg:py-5 flex flex-col overflow-auto'>
            <NavBar slug={slug}/>
            {children}
        </div>
    </div>

}

export default Layout