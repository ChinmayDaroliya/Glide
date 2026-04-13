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

  return await axios.post(
    "https://graph.instagram.com/v25.0/me/messages",
    {
      recipient: {
        id: recieverId
      },
      message: {
        text: prompt
      }
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  )
}

export const sendPrivateMessage = async (
  userId: string,
  recieverId: string,
  prompt: string,
  token: string
) => {
  console.log("sending comment reply")

  return await axios.post(
    "https://graph.instagram.com/v25.0/me/messages",
    {
      recipient: {
        comment_id: recieverId
      },
      message: {
        text: prompt
      }
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  )
}



// export const generateTokens = async (code: string) => {
//   const redirectUri = getInstagramRedirectUri()

//   const res = await fetch(
//     `https://graph.facebook.com/v21.0/oauth/access_token` +
//       `?client_id=${process.env.INSTAGRAM_CLIENT_ID}` +
//       `&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}` +
//       `&redirect_uri=${encodeURIComponent(redirectUri)}` +
//       `&code=${code}` +
//       `&grant_type=authorization_code`
//   )

//   const data = await res.json()
//   if (!data.access_token) return null

//   const ig = await fetch(
//     `https://graph.facebook.com/v21.0/me?fields=user_id,username&access_token=${data.access_token}`
//   )

//   const igData = await ig.json()

//   return {
//     access_token: data.access_token,
//     instagramId: igData.user_id
//   }
// }

export const generateTokens = async (code: string) => {
  const redirectUri = getInstagramRedirectUri()

  // Step 1: exchange code → user token (EAA)
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

  // Step 2: exchange → Instagram messaging token (IGAA)
  const igRes = await fetch(
    `https://graph.instagram.com/access_token` +
      `?grant_type=ig_exchange_token` +
      `&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}` +
      `&access_token=${data.access_token}`
  )

  const igToken = await igRes.json()

  // Step 3: get IG user id
  const igUser = await fetch(
    `https://graph.instagram.com/me?fields=user_id,username&access_token=${igToken.access_token}`
  )

  const igData = await igUser.json()

  return {
    access_token: igToken.access_token, // IGAA token
    instagramId: igData.user_id
  }
}