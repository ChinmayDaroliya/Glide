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
  console.log('sending message')
  return await axios.post(
    `${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`,
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

  const shortUrl =
    `https://graph.facebook.com/v21.0/oauth/access_token` +
    `?client_id=${process.env.INSTAGRAM_CLIENT_ID}` +
    `&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&code=${encodeURIComponent(code)}`

  const shortRes = await fetch(shortUrl)
  const shortData = await shortRes.json()

  if (!shortData.access_token) return null

  // exchange for long lived token
  const longRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token` +
    `?grant_type=fb_exchange_token` +
    `&client_id=${process.env.INSTAGRAM_CLIENT_ID}` +
    `&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}` +
    `&fb_exchange_token=${shortData.access_token}`
  )

  const longData = await longRes.json()

  return longData
}