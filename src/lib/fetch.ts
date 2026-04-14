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


// old working code this generates short lived EAA token 
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

// new working code this generates long lived IAA token
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


// testing...
// test this in morning
export const generateTokens = async (code: string) => {
  const redirectUri = getInstagramRedirectUri()

  const form = new URLSearchParams()
  form.append("client_id", process.env.INSTAGRAM_CLIENT_ID!)
  form.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET!)
  form.append("grant_type", "authorization_code")
  form.append("redirect_uri", redirectUri)
  form.append("code", code)

  const res = await fetch(
    "https://api.instagram.com/oauth/access_token",
    {
      method: "POST",
      body: form
    }
  )

  const data = await res.json()

  return {
    access_token: data.access_token, // IGAA token
    instagramId: data.user_id
  }
}