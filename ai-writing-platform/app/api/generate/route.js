import { NextResponse } from 'next/server'
import { getCurrentUser, canGenerate, isSubscribed } from '@/lib/auth'
import { generateContent } from '@/lib/openai'
import { prisma } from '@/lib/db'

export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user can generate
    if (!canGenerate(user)) {
      return NextResponse.json(
        {
          error: 'Usage limit reached',
          message: 'You have used all 5 free generations this month. Upgrade to Pro for unlimited access!'
        },
        { status: 403 }
      )
    }

    const { type, prompt } = await request.json()

    if (!type || !prompt) {
      return NextResponse.json(
        { error: 'Type and prompt are required' },
        { status: 400 }
      )
    }

    // Generate content
    const output = await generateContent(type, prompt)

    // Save generation
    await prisma.generation.create({
      data: {
        userId: user.id,
        type,
        prompt,
        output,
      }
    })

    // Update usage (reset if new month)
    const resetDate = new Date(user.usageResetDate)
    const now = new Date()
    const monthDiff = (now.getFullYear() - resetDate.getFullYear()) * 12 +
                      (now.getMonth() - resetDate.getMonth())

    if (monthDiff >= 1) {
      // Reset usage for new month
      await prisma.user.update({
        where: { id: user.id },
        data: {
          monthlyUsage: 1,
          usageResetDate: now,
        }
      })
    } else if (!isSubscribed(user)) {
      // Increment usage for free users
      await prisma.user.update({
        where: { id: user.id },
        data: {
          monthlyUsage: { increment: 1 }
        }
      })
    }

    return NextResponse.json({
      success: true,
      output,
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    )
  }
}
