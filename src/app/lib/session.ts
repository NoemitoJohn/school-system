import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload : {id : string, role : string, approve : boolean}, expiration: number | string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(encodedKey)
}

export async function decrypt(token: string | undefined = '') {
  try {

    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
    console.log(error)
  }
}


export async function createSession(token : string) {
  cookies().set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  })
}

export function deleteSession() {
  cookies().delete('session')
}