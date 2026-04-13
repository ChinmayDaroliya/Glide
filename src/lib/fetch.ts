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
  console.log('sending comment private reply')
  console.log('Private reply details:', {
    commentId: recieverId,
    hasToken: !!token
  })

  return await axios.post(
    `https://graph.facebook.com/v21.0/${recieverId}/private_replies`,
    {
      message: prompt
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

  const ig = await fetch(
    `https://graph.facebook.com/v21.0/me?fields=user_id,username&access_token=${data.access_token}`
  )

  const igData = await ig.json()

  return {
    access_token: data.access_token,
    instagramId: igData.user_id
  }
}