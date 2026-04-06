

import { Button } from '@/components/ui/button'
import { useSubscription } from '@/hooks/use-subscription'
import { CreditCardIcon, Loader2 } from 'lucide-react'
import React from 'react'

type Props = {}

const PaymentButton = (props: Props) => {
  
    const  {onSubscribe, isProcessing} = useSubscription()

    return (
        <Button 
            disabled={isProcessing}
            onClick={onSubscribe}
            className='bg-gradient-to-br text-white rounded-full from-[#9685DB] 
            font-bold to-[#CC3804]'>
            {isProcessing ? <Loader2 className='animate-spin'/> : <CreditCardIcon/>}
            Upgrade
        </Button>

    )
}

export default PaymentButton
