'use server'

import type { UserWithProfile } from '@/lib/prisma-payloads'
import { client } from '@/lib/prisma'

export const findUser = async (
    clerkId: string
): Promise<UserWithProfile | null> => {
    const row = await client.user.findUnique({
        where: { clerkId },
        include: {
            Subscription: true,
            Integrations: {
                select: {
                    id: true,
                    token: true,
                    expiresAt: true,
                    name: true,
                },
            },
        },
    })
    return row as UserWithProfile | null
}

export const createUser = async (
    clerkId: string,
    firstname: string,
    lastname: string,
    email: string
) => {
    return await client.user.create({
        data: {
            clerkId,
            firstname,
            lastname,
            email,
            Subscription: {
                create: {},
            },
        },
        select:{
            firstname: true,
            lastname: true,
        }
    })
}

export const updateSubscription = async (
    clerkId: string,
    props: {customerId?:string ; plan?: 'PRO' | 'FREE'}
) => {
    return await client.user.update({
        where: {
            clerkId,
        },
        data:{
            Subscription:{
                update:{
                    data:{
                        ...props,
                    }
                }
            }
        }
    })
}