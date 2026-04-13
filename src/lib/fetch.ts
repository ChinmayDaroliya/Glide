import axios from 'axios'

const getInstagramRedirectUri = () => {
  if (process.env.INSTAGRAM_REDIRECT_URI) {
    return process.env.INSTAGRAM_REDIRECT_URI
  }
  return `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`
}

export const refreshToken = async (token: string) => {
  const refresh_token = await axios.get(
    `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  )

  return refresh_token.data
}

export const sendDM = async (
  userId: string,
  recieverId: string,
  prompt: string,
  token: string
) => {
  console.log('sending DM to user')
  console.log('DM Details:', {
    userId,
    recieverId,
    hasToken: !!token
  })
  return await axios.post(
    `https://graph.facebook.com/v21.0/${userId}/messages`,
    {
      recipient: {
        id: recieverId,
      },
      message: {
        text: prompt,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
}

export const sendPrivateMessage = async (
  userId: string,
  recieverId: string,
  prompt: string,
  token: string
) => {
  console.log('sending message')
  return await axios.post(
    `${process.env.INSTAGRAM_BASE_URL}/${userId}/messages`,
    {
      messaging_type: "RESPONSE",
      recipient: {
        comment_id: recieverId,
      },
      message: {
        text: prompt,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
}



export const generateTokens = async (code: string) => {
  const redirectUri = getInstagramRedirectUri()

  // Step 1 — exchange code for user token
  const res = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token` +
      `?client_id=${process.env.INSTAGRAM_CLIENT_ID}` +
      `&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&code=${code}` +
      `&grant_type=authorization_code`
  )

  const data = await res.json()
  if (!data.access_token) return null

  // Step 2 — get pages
  const pagesRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${data.access_token}`
  )

  const pages = await pagesRes.json()

  const page = pages.data?.find(
    (p: any) => p.instagram_business_account
  )

  if (!page) return null

  // Step 3 — return page token + ig id
  return {
    access_token: page.access_token,
    instagramId: page.instagram_business_account.id,
    pageId: page.id
  }
}