import { createHmac, timingSafeEqual } from 'crypto'

const getSecret = () =>
  process.env.INSTAGRAM_OAUTH_STATE_SECRET ?? process.env.CLERK_SECRET_KEY

/** Signed payload so /callback/instagram can run without Clerk cookies on the redirect host (e.g. Vercel vs localhost). */
export function signInstagramOAuthState(clerkId: string): string {
  const exp = Date.now() + 10 * 60 * 1000
  const payload = JSON.stringify({ clerkId, exp })
  const secret = getSecret()
  if (!secret) {
    throw new Error('Set CLERK_SECRET_KEY or INSTAGRAM_OAUTH_STATE_SECRET')
  }
  const sig = createHmac('sha256', secret).update(payload).digest('base64url')
  return Buffer.from(JSON.stringify({ p: payload, sig }), 'utf8').toString(
    'base64url'
  )
}

export function verifyInstagramOAuthState(
  state: string | undefined
): string | null {
  if (!state) return null
  const secret = getSecret()
  if (!secret) return null
  try {
    const raw = Buffer.from(state, 'base64url').toString('utf8')
    const { p, sig } = JSON.parse(raw) as { p: string; sig: string }
    const expected = createHmac('sha256', secret).update(p).digest('base64url')
    if (sig.length !== expected.length) return null
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
    const { clerkId, exp } = JSON.parse(p) as { clerkId: string; exp: number }
    if (typeof exp !== 'number' || Date.now() > exp) return null
    return clerkId
  } catch {
    return null
  }
}
