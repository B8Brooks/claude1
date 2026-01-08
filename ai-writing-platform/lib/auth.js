import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me'

export async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

export function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded) return null

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionStatus: true,
        subscriptionEnd: true,
        monthlyUsage: true,
        usageResetDate: true,
      }
    })

    return user
  } catch {
    return null
  }
}

export function isSubscribed(user) {
  if (!user) return false
  return user.subscriptionStatus === 'active' &&
         user.subscriptionEnd &&
         new Date(user.subscriptionEnd) > new Date()
}

export function canGenerate(user) {
  if (!user) return false

  // Free tier: 5 generations per month
  // Paid: unlimited
  if (isSubscribed(user)) return true

  // Check if we need to reset monthly usage
  const resetDate = new Date(user.usageResetDate)
  const now = new Date()
  const monthDiff = (now.getFullYear() - resetDate.getFullYear()) * 12 +
                    (now.getMonth() - resetDate.getMonth())

  if (monthDiff >= 1) {
    // Would reset usage - they can generate
    return true
  }

  return user.monthlyUsage < 5
}
