import type { Prisma } from '@prisma/client'

/**
 * Prisma + driver adapter can infer `findUnique` as scalar-only User.
 * Use these payloads + narrow casts at query boundaries.
 */

export type UserWithProfile = Prisma.UserGetPayload<{
  include: {
    subscription: true
    integrations: {
      select: {
        id: true
        token: true
        expiresAt: true
        name: true
      }
    }
  }
}>

export type UserWithInstagramIntegrations = Prisma.UserGetPayload<{
  select: {
    integrations: {
      where: { name: 'INSTAGRAM' }
    }
  }
}>
