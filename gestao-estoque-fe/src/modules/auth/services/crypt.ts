import bcrypt from 'bcryptjs'

export function cryptPassword(password: string) {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hash(password, salt)
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
