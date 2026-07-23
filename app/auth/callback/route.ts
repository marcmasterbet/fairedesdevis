import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data } = await supabase.auth.exchangeCodeForSession(code)
    const user = data?.user

    if (user) {
      try {
        const session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          payment_method_types: ['card'],
          customer_email: user.email,
          line_items: [
            {
              price: process.env.STRIPE_PRICE_ID!,
              quantity: 1,
            }
          ],
          subscription_data: {
            trial_period_days: 7,
            metadata: { userId: user.id }
          },
          metadata: { userId: user.id },
          success_url: 'https://fairedesdevis.fr/dashboard?abonnement=success',
          cancel_url: 'https://fairedesdevis.fr/abonnement?cancel=true',
        })

        if (session.url) {
          return NextResponse.redirect(session.url)
        }
      } catch (error) {
        console.error('Erreur Stripe:', error)
      }
    }
  }

  return NextResponse.redirect(new URL('/login', request.url))
}