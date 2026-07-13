import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { action, userId, email, message } = await req.json()

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    if (action === 'supprimer') {
      await supabaseAdmin.from('devis').delete().eq('user_id', userId)
      await supabaseAdmin.from('factures').delete().eq('user_id', userId)
      await supabaseAdmin.from('clients').delete().eq('user_id', userId)
      await supabaseAdmin.from('catalogue').delete().eq('user_id', userId)
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return NextResponse.json({ success: true })
    }

    if (action === 'suspendre') {
      await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: '876600h' })
      return NextResponse.json({ success: true })
    }

    if (action === 'reactiver') {
      await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: 'none' })
      return NextResponse.json({ success: true })
    }

    if (action === 'email') {
      await resend.emails.send({
        from: 'FaireDesDevis <noreply@fairedesdevis.fr>',
        to: email,
        subject: 'Message de FaireDesDevis',
        html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">'
          + '<div style="background:#2563eb;padding:24px;border-radius:12px 12px 0 0;text-align:center">'
          + '<h1 style="color:white;margin:0;font-size:20px">FaireDesDevis</h1>'
          + '</div>'
          + '<div style="background:white;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">'
          + '<p style="color:#1e293b;font-size:14px;line-height:1.6">' + message + '</p>'
          + '</div></div>'
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
  } catch (error) {
    console.error('Erreur admin action:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}