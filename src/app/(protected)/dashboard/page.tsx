import { onBoardUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const Page = async (props: Props) => {
  const user = await onBoardUser()
  if (user.status === 200 || user.status === 201) {
    const fullName = user.data?.firstname + (user.data?.lastname ? user.data.lastname : '')
    return redirect(`/dashboard/${fullName}`)
  }

  return redirect('/sign-in')
}

export default Page