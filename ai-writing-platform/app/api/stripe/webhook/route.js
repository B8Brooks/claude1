import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export async function POST(request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const customerId = session.customer
        const subscriptionId = session.subscription

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        // Update user
        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionId,
            subscriptionStatus: 'active',
            subscriptionEnd: new Date(subscription.current_period_end * 1000),
          }
        })
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object

        await prisma.user.update({
          where: { stripeCustomerId: subscription.customer },
          data: {
            subscriptionStatus: subscription.status === 'active' ? 'active' : 'inactive',
            subscriptionEnd: new Date(subscription.current_period_end * 1000),
          }
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        await prisma.user.update({
          where: { stripeCustomerId: subscription.customer },
          data: {
            subscriptionStatus: 'canceled',
            subscriptionId: null,
          }
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object

        if (invoice.billing_reason === 'subscription_cycle') {
          // Renewal payment - extend subscription
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription)

          await prisma.user.update({
            where: { stripeCustomerId: invoice.customer },
            data: {
              subscriptionEnd: new Date(subscription.current_period_end * 1000),
              subscriptionStatus: 'active',
            }
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object

        await prisma.user.update({
          where: { stripeCustomerId: invoice.customer },
          data: {
            subscriptionStatus: 'past_due',
          }
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
