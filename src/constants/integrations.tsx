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
        description: 'Connect your Instagram account to enable automated responses and engagement with your followers',
        icon: <InstagramDuoToneBlue/>,
        strategy: 'INSTAGRAM',
    },{
        title: 'Connect Salesforce',
        description: 'Integrate Salesforce CRM to manage customer relationships and automate sales processes',
        icon: <SalesForceDuoToneBlue/>,
        strategy: 'CRM',
    }
]