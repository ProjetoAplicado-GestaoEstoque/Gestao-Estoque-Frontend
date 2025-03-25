import jwt from 'jsonwebtoken'
import { UserToken } from '../types/types'

export function createToken(user: UserToken) {
  const token = jwt.sign(
    { userID: user.id, email: user.email },
    process.env.NEXT_PUBLIC_SECRET_KEY as string,
    {
      expiresIn: '2 days',
    },
  )

  return token
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string)
}
