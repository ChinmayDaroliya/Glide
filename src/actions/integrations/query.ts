"use server"
import {client} from '../../lib/prisma'

export const updateIntegrations = async (token:string, expire:Date, id:string) => {
    return await client.integrations.update({
        where : {id},
        data : {
            token,
            expiresAt: expire ,
        }
    })
}

export const getIntegration = async (clerkId: string) => {
    return await client.user.findUnique({
        where:{
            clerkId
        },
        select:{ 
            integrations:{
                where:{
                    name:'INSTAGRAM'
                }
            }
        }
    })
}

export const createIntegration = async (
    clerkId: string,
    token : string,
    expire: Date,
    igId?: string
)=>{
    console.log("=== CREATE INTEGRATION START ===")
    console.log("createIntegration: clerkId:", clerkId)
    console.log("createIntegration: token:", token.substring(0, 20) + "...")
    console.log("createIntegration: expiresAt:", expire)
    console.log("createIntegration: instagramId:", igId)
    
    try {
        console.log("createIntegration: Calling Prisma update...")
        const result = await client.user.update({
            where:{
                clerkId,
            },
            data:{
                integrations:{
                    create:{
                        token,
                        expiresAt:expire,
                        instagramId: igId,
                    },
                },
            },
            select:{
                firstname:true,
                lastname: true,
            },
        })

        console.log("createIntegration: Prisma update result:", JSON.stringify(result, null, 2))
        console.log("createIntegration: Integration created successfully")
        return result
    } catch (error) {
        console.log("createIntegration: Error occurred:", error)
        if (error instanceof Error) {
            console.log("createIntegration: Error stack:", error.stack)
        } else {
            console.log("createIntegration: Error stack:", "No stack trace available")
        }
        throw error
    }
    console.log("=== CREATE INTEGRATION END ===")
}