'use server'

import type { Prisma } from '@prisma/client'
import { client } from '@/lib/prisma'
import { v4 } from 'uuid'

/**
 * Explicit payload: PrismaPg adapter can widen `findUnique` to scalar User without this.
 */
export type UserWithAutomationsList = any

export const createAutomation = async (clerkId: string, id?: string) => {
  return await client.user.update({
    where: { clerkId },
    data: {
      Automation: {
        create: {
          ...(id && { id }),
        },
      },
    },
  })
}

export const getAutomations = async (
  clerkId: string
): Promise<UserWithAutomationsList | null> => {
  const row = await client.user.findUnique({
    where: { clerkId },
    include: {
        Automation: {
        orderBy: { createdAt: 'asc' },
        include: {
          Keyword: true,
          Listener: true,
          Post: true,
          Trigger: true,
        },
      },
    },
  })
  return row as UserWithAutomationsList | null
}

export const findAutomation = async (id: string) => {
  return await client.automation.findUnique({
    where: { id },
    include: {
      Keyword: true,
      Trigger: true,
      Post: true,
      Listener: true,
      User: {
        select: {
          Subscription: true,
          Integrations: true,
        },
      },
    },
  })
}

export const updateAutomation = async (
  id: string,
  update: {
    name?: string
    active?: boolean
  }
) => {
  return await client.automation.update({
    where: { id },
    data: {
      name: update.name,
      active: update.active,
    },
  })
}

export const addListener = async (
  automationId: string,
  listener: 'SMARTAI' | 'MESSAGE',
  prompt: string,
  reply?: string
) => {
  return await client.automation.update({
    where: { id: automationId },
    data: {
      Listener: {
        create: {
          listener,
          prompt,
          commentReply: reply,
        },
      },
    },
  })
}

export const addTrigger = async (automationId: string, trigger: string[]) => {
  if (trigger.length === 2) {
    return await client.automation.update({
      where: { id: automationId },
      data: {
        Trigger: {
          createMany: {
            data: [{ type: trigger[0] }, { type: trigger[1] }],
          },
        },
      },
    })
  }
  return await client.automation.update({
    where: { id: automationId },
    data: {
      Trigger: {
        create: {
          type: trigger[0],
        },
      },
    },
  })
}

export const addKeyword = async (automationId: string, keyword: string) => {
  return await client.automation.update({
    where: { id: automationId },
    data: {
      Keyword: {
        create: {
          word: keyword,
        },
      },
    },
  })
}

export const deleteKeywordQuery = async (id: string) => {
  return await client.keyword.delete({
    where: { id },
  })
}

export const addPost = async (
  automationId: string,
  posts: {
    postid: string,
    caption?: string,
    media: string,
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM',
  }[]
) => {
  return await client.automation.update({
    where: { id: automationId },
    data: {
      Post: {
        createMany: {
          data: posts,
        },
      },
    },
  })
}

export const deleteAutomation = async (automationId: string) => {
  return await client.automation.delete({
    where: { id: automationId },
  })
}