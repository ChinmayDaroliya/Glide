import { onIntegrate } from '@/actions/integrations'
import { verifyInstagramOAuthState } from '@/lib/oauth-state'
import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

function redirectTo(request: NextRequest, path: string) {
  const target = new URL(path, request.nextUrl.origin)
  return NextResponse.redirect(target)
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone()
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  const errorDescription = url.searchParams.get('error_description')

  console.log('=== OAUTH CALLBACK (route) ===')
  console.log('OAuth Callback: full URL:', url.toString())
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
    console.log(
      'OAuth Callback: No valid state and no Clerk session — cannot tie OAuth to user'
    )
    return redirectTo(request, '/sign-in')
  }

  console.log(
    'OAuth Callback: Clerk user for integration:',
    effectiveClerkId,
    'fromState:',
    !!clerkIdFromState
  )

  if (!code) {
    console.log('OAuth Callback: No code in query string — check redirect URI / Facebook app settings')
    return redirectTo(request, '/dashboard')
  }

  const cleanCode = code.split('#_')[0]

  try {
    console.log('OAuth Callback: Calling onIntegrate...')
    const integrationResult = await onIntegrate(cleanCode, effectiveClerkId)
    console.log('OAuth Callback: Integration result status:', integrationResult.status)

    if (integrationResult.status === 200 && integrationResult.data) {
      const firstName = integrationResult.data.firstname
      const lastName = integrationResult.data.lastname
      const fullName = firstName + (lastName ?? '')
      const redirectUrl = `/dashboard/${fullName}/integrations`
      console.log('OAuth Callback: Redirecting to:', redirectUrl)
      return redirectTo(request, redirectUrl)
    }

    console.log(
      'OAuth Callback: Integration failed:',
      JSON.stringify(integrationResult)
    )
  } catch (e: unknown) {
    const err = e as Error
    console.log('OAuth Callback: Error during integration:', err?.message)
    console.log('OAuth Callback: Stack:', err?.stack)
  }

  return redirectTo(request, '/dashboard')
}
