import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { userId, email } = await req.json()

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        }
      ],
      subscription_data: {
        trial_period_days: 30,
        metadata: { userId }
      },
      metadata: { userId },
      success_url: 'https://fairedesdevis.fr/dashboard?abonnement=success',
      cancel_url: 'https://fairedesdevis.fr/abonnement?cancel=true',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erreur Stripe checkout:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}