'use server'

import { onCurrentUser } from "../user"
import { findUser } from "../user/queries"
import { addKeyword, addListener, addPost, addTrigger, createAutomation, deleteAutomation, deleteKeywordQuery, findAutomation, getAutomations, updateAutomation } from "./queries"

export const createAutomations = async (id?: string) => {
    const user = await onCurrentUser()

    try {
        const create = await createAutomation(user.id, id)

        if (create) return { status: 200, data: "Automation created" }

        return { status: 404, data: "Oops! something went wrong" }
    } catch (error) {
        return { status: 500, data: "Internal server error" }
    }
}

export const getAllAutomations = async () => {
    const user = await onCurrentUser()

    try {
        const userWithAutomations = await getAutomations(user.id)

        if (userWithAutomations?.Automation) {
            return { status: 200, data: userWithAutomations.Automation }
        }

        return { status: 404, data: [] }
    } catch (error) {
        return { status: 500, data: [] }
    }
}

export const getAutomationInfo = async (id: string) => {
    await onCurrentUser()
    try {
        const automation = await findAutomation(id)
        if (automation) return { status: 200, data: automation }

        return { status: 404 }
    } catch (error) {
        return { status: 500 }
    }
}

export const updateAutomationName = async (
    automationId: string,
    data: {
        name?: string,
        active?: boolean,
        automation?: string,
    }
) => {
    await onCurrentUser()
    try {
        const update = await updateAutomation(automationId, data)
        if (update) {
            return { status: 200, data: 'Automation successfully updated' }
        }

        return { status: 404, data: 'Oops! could not find automation' }
    } catch (error) {
        return { status: 500, data: 'Oops! something went wrong' }
    }
}

export const saveListener = async (
    automationId: string,
    listener: 'SMARTAI' | 'MESSAGE',
    prompt: string,
    reply?: string
) => {
    await onCurrentUser()
    try {
        const create = await addListener(automationId, listener, prompt, reply)
        if (create) return { status: 200, data: 'Listener created' }

        return { status: 404, data: 'Cant save listener' }
    } catch (error) {
        return { status: 500, data: 'Oops! something went wrong' }
    }
}

export const saveTrigger = async (automationId: string, trigger: string[]) => {
    await onCurrentUser()
    try {
        const create = await addTrigger(automationId, trigger)
        if (create) return { status: 200, data: 'Trigger saved' }
        return { status: 404, data: 'Cannot save trigger' }
    } catch (error) {
        return { status: 500, data: 'Oops! something went wrong ' }
    }
}

export const saveKeyword = async (automationId: string, keyword: string) => {
    await onCurrentUser()
    try {
        const create = await addKeyword(automationId, keyword)

        if (create) return { status: 200, data: "Keyword added successfully" }

        return { status: 404, data: 'Cannot add this key' }
    } catch (error) {
        return { status: 500, data: 'Oops! something went wrong' }
    }
}

export const deleteKeyword = async (id: string) => {
    await onCurrentUser()
    try {
        const deleted = await deleteKeywordQuery(id)
        if (deleted)
            return {
                status: 200,
                data: 'Keyword deleted'
            }
        return { status: 404, data: 'Keyword not found' }
    } catch (error) {
        return { status: 500, data: 'Oops! something went wrong' }
    }
}

import axios from 'axios'

export const getProfilePosts = async () => {
    const user = await onCurrentUser()
    try {
        const profile = await findUser(user.id)

        if (!profile || !profile.Integrations || (profile.Integrations as any[]).length === 0) {
            console.log("No Instagram integration found")
            return { status: 404, message: "No Instagram integration found" }
        }

        const token = (profile.Integrations[0] as any).token
        const instagramId = (profile.Integrations[0] as any).instagramId
        if (!token || !instagramId) {
            console.log("No access token or instagram id found")
            return { status: 404, message: "No access token or instagram id found" }
        }

        const posts = await axios.get(
            `https://graph.facebook.com/v21.0/${instagramId}/media`,
            {
                params: {
                    fields: "id,caption,media_type,media_url,permalink",
                    access_token: token
                }
            }
        )
        const parsed = posts.data?.data
        if (parsed) return { status: 200, data: parsed }
        console.log("error in getting posts")
        return { status: 404 }

    } catch (error) {
        console.log('server side error in getting the posts')
        return { status: 500 }

    }
}

export const savePosts = async (
    automationId: string,
    posts: {
        postid: string
        caption?: string
        media: string
        mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM'
    }[]
) => {
    await onCurrentUser()
    try {
        const create = await addPost(automationId, posts)

        if (create) return { status: 200, data: 'Posts attached' }

        return { status: 404, data: 'Automation not found' }

    } catch (error) {
        return { status: 500, data: 'Oops! something went wrong' }
    }
}

export const activateAutomation = async (id: string, state: boolean) => {
    await onCurrentUser()
    try {
        const update = await updateAutomation(id, { active: state })
        if (update)
            return {
                status: 200,
                data: `Automation ${state ? 'activated' : 'disabled'}`
            }

        return { status: 404, data: ' Automation not found' }
    } catch (error) {
        return { status: 500, data: 'Oops! something went wrong ' }
    }
}

export const deleteAutomationAction = async (automationId: string) => {
    await onCurrentUser()
    try {
        const deleted = await deleteAutomation(automationId)
        if (deleted) return { status: 200, data: "Automation deleted successfully" }
        return { status: 404, data: "Automation not found" }
    } catch (error) {
        return { status: 500, data: "Oops! something went wrong" }
    }
}