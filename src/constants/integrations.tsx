import { InstagramDuoToneBlue, SalesForceDuoToneBlue } from "@/icons"


type Props = {
    title: string
    icon: React.ReactNode
    description: string
    strategy: 'INSTAGRAM' | 'CRM'
}

export const INTEGRATION_CARD: Props[] = [
    {
        title: 'Connect Instagram',
        description: 'lorem ipsum dolor sit',
        icon: <InstagramDuoToneBlue/>,
        strategy: 'INSTAGRAM',
    },{
        title: 'Connect Salesforce',
        description: 'lorem ipsum dolor sit',
        icon: <SalesForceDuoToneBlue/>,
        strategy: 'CRM',
    }
]