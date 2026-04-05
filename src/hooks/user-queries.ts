import { useQuery } from "@tanstack/react-query"
import { getAllAutomations, getAutomationInfo, getProfilePosts } from "@/actions/automations"
import { onUserInfo } from "@/actions/user"
import { use } from "react"

export const useQueryAutomations = () => {
    return useQuery({
        queryKey: ['user-automation'],
        queryFn: getAllAutomations,
})

}

export const useQueryAutomation = (id:string) => {
    return useQuery({
        queryKey: ['automation-info'],
        queryFn: () => getAutomationInfo(id),
    })
}

export const useQueryUser = () => {
    return useQuery({
        queryKey: ['user-profile'],
        queryFn: onUserInfo,
    })
}

export const useQueryAutomationPosts = () => {
    const fetchPosts = async() =>  await getProfilePosts()
    return useQuery({
        queryKey: ['instagram-media'],
        queryFn: fetchPosts,
    })
}