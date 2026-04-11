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

  console.log('\n=== generateTokens ===')
  console.log('redirect_uri:', redirectUri)
  console.log('code (first 30):', code.substring(0, 30) + '...')

  const url =
    `https://graph.facebook.com/v21.0/oauth/access_token` +
    `?client_id=${process.env.INSTAGRAM_CLIENT_ID}` +
    `&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&code=${encodeURIComponent(code)}` +
    `&grant_type=authorization_code`

  try {
    const res = await fetch(url, { method: 'GET' })
    const data = await res.json()

    console.log('Token exchange status:', res.status)
    console.log('TOKEN RESPONSE:', JSON.stringify(data))

    if (!data.access_token) {
      console.log('NO ACCESS TOKEN — error:', data.error?.message ?? data)
      return null
    }

    return data
  } catch (err) {
    console.error('generateTokens fetch error:', err)
    return null
  }
}