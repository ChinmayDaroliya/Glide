import React from 'react'
import {Sheet as ShadcnSheet, 
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet'  

type Props = {
    trigger: React.ReactNode
    children: React.ReactNode
    className?: string
    side: 'left' | 'right'
}

const Sheet = ({children, trigger, className, side}: Props) => {
  return( 
  <ShadcnSheet>
    <SheetTrigger className={className}>
        {trigger}
    </SheetTrigger>
    <SheetContent className='p-0' side={side}>
      {children}
    </SheetContent>
  </ShadcnSheet>
  )
}

export default Sheet
