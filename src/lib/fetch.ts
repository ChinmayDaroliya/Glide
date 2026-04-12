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
  console.log('sending comment reply')
  console.log('API Call Details:', {
    endpoint: `https://graph.facebook.com/v21.0/${userId}/messages`,
    recipientId: recieverId,
    hasToken: !!token
  })
  
  try {
    // For Instagram comment replies, use the correct API structure
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/me/messages`,
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
    console.log('Comment reply sent successfully:', response.status)
    return response
  } catch (error: any) {
    console.log('Error sending comment reply:', error.response?.data || error.message)
    
    // Try alternative endpoint for Instagram messages
    try {
      const fallbackResponse = await axios.post(
        `https://graph.facebook.com/v21.0/${userId}/messages`,
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
      console.log('Fallback API call successful:', fallbackResponse.status)
      return fallbackResponse
    } catch (fallbackError: any) {
      console.log('Both API calls failed:', fallbackError.response?.data || fallbackError.message)
      throw fallbackError
    }
  }
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

  // IMPORTANT: do NOT exchange again
  return data
}