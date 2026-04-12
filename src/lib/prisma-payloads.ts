import type { Prisma } from '@prisma/client'

/**
 * Prisma + driver adapter can infer `findUnique` as scalar-only User.
 * Use these payloads + narrow casts at query boundaries.
 */

export interface UserWithInstagramIntegrations {
  firstname: string | null
  lastname: string | null
  Integrations: Array<{
    id: string
    token: string
    expiresAt: Date | null
    name: 'INSTAGRAM'
    instagramId: string | null
    createdAt: Date
    userId: string | null
  }>
}

export interface UserWithProfile {
  firstname: string | null
  lastname: string | null
  Subscription: {
    id: string
    userId: string | null
    createdAt: Date
    plan: 'PRO' | 'FREE'
    updatedAt: Date
    customerId: string | null
  } | null
  Integrations: Array<{
    id: string
    token: string
    expiresAt: Date | null
    name: string
    instagramId: string | null
  }>
}
