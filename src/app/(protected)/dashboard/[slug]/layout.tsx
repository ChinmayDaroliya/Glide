import Sidebar from '@/components/global/sidebar'
import React from 'react'

type Props = {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}

const Layout = async ({ children, params }: Props) => {

    // Query client
    // WIP Query client and fetch data
    const { slug } = await params

    return <div className='p-3'>
        {/* sidebar */}
        <Sidebar slug={slug} />

        {/* Navbar */}
    </div>

}

export default Layout