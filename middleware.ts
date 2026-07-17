import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return req.cookies.get(name)?.value },
        set(name: string, value: string, options: any) { res.cookies.set({ name, value, ...options }) },
        remove(name: string, options: any) { res.cookies.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const meta = user.user_metadata
    const estVIP = meta?.actif_manuellement === true
    const estActif = meta?.abonnement_actif === true || meta?.stripe_statut === 'trialing' || meta?.stripe_statut === 'actif'
    const dateInscription = new Date(user.created_at)
    const joursDepuis = Math.floor((new Date().getTime() - dateInscription.getTime()) / (1000 * 60 * 60 * 24))
    const essaiValide = joursDepuis <= 30

    if (!estVIP && !estActif && !essaiValide) {
      return NextResponse.redirect(new URL('/abonnement', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*']
}