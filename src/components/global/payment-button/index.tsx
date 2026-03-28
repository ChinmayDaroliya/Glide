import { Button } from '@/components/ui/button'
import React from 'react'

type Props = {}

const PaymentButton = (props: Props) => {
    // WIP get their subscription details 
    // WIP Loading progress
  
    return (
        <Button className='bg-gradient-to-br text-white rounded-full from-[#9685DB] 
            font-bold to-[#CC3804]'>
            Upgrade
        </Button>

    )
}

export default PaymentButton
