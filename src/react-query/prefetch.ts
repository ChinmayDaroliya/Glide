import { onUserInfo } from "@/actions/user"
import { getAllAutomations } from "@/actions/automations"
import { QueryClient, QueryFunction } from "@tanstack/react-query"

const prefetch = async (
    client: QueryClient,
    actions: QueryFunction,
    key:string
) => {
    return await client.prefetchQuery({
        queryKey: [key],
        queryFn: actions,
        staleTime: 60000,
    })
}

export const prefetchUserProfile = async (client:QueryClient) => {
    return await prefetch(client, onUserInfo, 'user-profile')
}

export const prefetchUserAutomations = async (client:QueryClient) => {
    return await prefetch(client, getAllAutomations, 'user-automations')
}