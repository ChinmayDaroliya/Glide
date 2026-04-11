import { onIntegrate } from '@/actions/integrations'
import { verifyInstagramOAuthState } from '@/lib/oauth-state'
import { redirect } from 'next/navigation'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Page = async ({ searchParams }: Props) => {
  const params = await searchParams
  const code = typeof params.code === 'string' ? params.code : undefined
  const state = typeof params.state === 'string' ? params.state : undefined

  if (code) {
    // Verify the signed OAuth state to recover the Clerk user ID
    // (the redirect comes from Facebook, so Clerk cookies may be absent)
    const clerkId = verifyInstagramOAuthState(state)

    if (!clerkId) {
      console.log('Instagram callback: invalid or expired state param')
      return redirect('/sign-in')
    }

    const user = await onIntegrate(code, clerkId || undefined)
    if (user.status === 200) {
      return redirect(
        `/dashboard/${user.data?.firstname}${user.data?.lastname}/integrations`
      )
    }
  }
  return redirect('/sign-up')
}

export default Page