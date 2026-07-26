import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICE_MENSUEL = process.env.STRIPE_PRICE_ID!
const PRICE_ANNUEL = process.env.STRIPE_PRICE_ID_ANNUEL!

export async function POST(req: NextRequest) {
  const { userId, email, plan } = await req.json()

  const priceId = plan === 'annuel' ? PRICE_ANNUEL : PRICE_MENSUEL

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        }
      ],
      subscription_data: {
        trial_period_days: 7,
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