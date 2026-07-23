import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

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
      // Créer une session Stripe checkout avec trial 7 jours
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email })
      })

      const stripeData = await res.json()

      if (stripeData.url) {
        return NextResponse.redirect(stripeData.url)
      }
    }
  }

  // Fallback si erreur
  return NextResponse.redirect(new URL('/login', request.url))
}