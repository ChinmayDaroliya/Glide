import { SIDEBAR_MENU } from '@/constants/menu'
import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
    page: string
    slug: string
}

const Items = ({ page, slug }: Props) => {
    return SIDEBAR_MENU.map((items) => (
        <Link key={items.id}
            href={`/dashboard/${slug}/${items.label === 'home' ? '/' : items.label}`}
            className={cn('capitalize flex gap-x-2 rounded-full p-3',
                page === items.label && 'bg-[#0f0f0f]',
                page === slug && items.label === 'home' ? 'bg-[#0f0f0f]' : 'text-[#989CA0]'
            )}
        >
            {items.icon}
            {items.label}
        </Link>
    ))
}

export default Items