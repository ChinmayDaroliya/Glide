import { onIntegrate } from '@/actions/integrations'
import { verifyInstagramOAuthState } from '@/lib/oauth-state'
import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

/** Avoid Edge quirks; OAuth + Prisma run on Node. */
export const runtime = 'nodejs'

function redirectTo(request: NextRequest, path: string) {
  let target: URL
  try {
    target = new URL(path, request.url)
  } catch (e) {
    target = new URL(path, process.env.NEXT_PUBLIC_HOST_URL || 'https://glide-sandy.vercel.app')
  }
  return NextResponse.redirect(target)
}

function parseOAuthParams(request: NextRequest) {
  const fromRequestUrl = new URL(request.url)
  let code = fromRequestUrl.searchParams.get('code')
  let state = fromRequestUrl.searchParams.get('state')
  let error = fromRequestUrl.searchParams.get('error')
  let errorDescription = fromRequestUrl.searchParams.get('error_description')

  if (!code && !error) {
    const forwarded = request.headers.get('x-forwarded-uri')
    if (forwarded) {
      try {
        const u = new URL(forwarded, request.nextUrl?.origin || request.url)
        code = u.searchParams.get('code')
        state = state ?? u.searchParams.get('state')
        error = error ?? u.searchParams.get('error')
        errorDescription = errorDescription ?? u.searchParams.get('error_description')
      } catch {
        /* ignore */
      }
    }
  }

  return { code, state, error, errorDescription, href: fromRequestUrl.toString() }
}

export async function GET(request: NextRequest) {
  try {
    const { code, state, error, errorDescription, href } = parseOAuthParams(request)

    console.log('=== OAUTH CALLBACK (route) ===')
    console.log('OAuth Callback: full URL:', href)
    console.log('OAuth Callback: Received code:', code ? 'YES' : 'NO')

    if (error) {
      console.log('OAuth Callback: Instagram returned error:', error)
      console.log('OAuth Callback: Error description:', errorDescription)
      return redirectTo(request, '/dashboard')
    }

    const clerkIdFromState = verifyInstagramOAuthState(state ?? undefined)
    const sessionUser = await currentUser()
    const effectiveClerkId = clerkIdFromState ?? sessionUser?.id

    if (!effectiveClerkId) {
      console.log('OAuth Callback: No valid state and no Clerk session — cannot tie OAuth to user')
      return redirectTo(request, '/sign-in')
    }

    if (!code) {
      console.log('OAuth Callback: No code in query string — check redirect URI')
      return redirectTo(request, '/dashboard')
    }

    const cleanCode = code.split('#_')[0]

    try {
      const integrationResult = await onIntegrate(cleanCode, effectiveClerkId)
      
      if (integrationResult && integrationResult.status === 200 && integrationResult.data) {
        const firstName = integrationResult.data.firstname
        const lastName = integrationResult.data.lastname
        const fullName = firstName + (lastName ?? '')
        const redirectUrl = `/dashboard/${fullName}/integrations`
        console.log('OAuth Callback: Redirecting to:', redirectUrl)
        return redirectTo(request, redirectUrl)
      }

      console.log('OAuth Callback: Integration failed:', JSON.stringify(integrationResult))
    } catch (e: unknown) {
      const err = e as Error
      console.log('OAuth Callback: Error during integration block:', err?.message)
    }

    return redirectTo(request, '/dashboard')
  } catch (err: any) {
    console.log('OAuth Callback: UNHANDLED FATAL ERROR in GET():', err?.message)
    // Fallback if everything fails
    return redirectTo(request, '/dashboard')
  }
}
