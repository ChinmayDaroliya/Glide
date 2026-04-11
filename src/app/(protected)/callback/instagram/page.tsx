import { onIntegrate } from '@/actions/integrations'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async ({ searchParams }: Props) => {
  const code = searchParams.code
  if (code) {

    const user = await onIntegrate(code as string)
    if (user.status === 200) {
      return redirect(
        `/dashboard/${user.data?.firstname}${user.data?.lastname}/integrations`
      )
    }
  }
  return redirect('/sign-up')
}

export default Page