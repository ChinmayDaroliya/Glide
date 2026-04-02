import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
  return new PrismaClient()
}

export const client = globalThis.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client