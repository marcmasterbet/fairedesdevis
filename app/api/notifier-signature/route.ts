import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const devisId = body.devisId
  const action = body.action
  const nom = body.nom

  console.log('ACTION RECU:', action)
  console.log('EST ACCEPTE:', action === 'accepte')

  try {
    const supabaseAdmin = getSupabaseAdmin()

    const { data: devisData } = await supabaseAdmin
      .from('devis')
      .select('*')
      .eq('id', devisId)
      .single()

    if (!devisData) return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 })

    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(devisData.user_id)
    const prestaEmail = userData?.user?.email
    const prestaNom = userData?.user?.user_metadata?.nom || 'Votre prestataire'

    const estAccepte = action === 'accepte'
    const couleur = estAccepte ? '#16a34a' : '#dc2626'
    const titreEmail = estAccepte ? 'Devis accepte' : 'Devis refuse'
    const sujet = estAccepte
      ? 'Devis ' + devisData.numero + ' accepte par ' + nom
      : 'Devis ' + devisData.numero + ' refuse par ' + nom

    console.log('SUJET:', sujet)
    console.log('COULEUR:', couleur)

    if (prestaEmail) {
      await resend.emails.send({
        from: 'FaireDesDevis <noreply@fairedesdevis.fr>',
        to: prestaEmail,
        subject: sujet,
        html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px"><div style="background:' + couleur + ';padding:24px;border-radius:12px 12px 0 0;text-align:center"><h1 style="color:white;margin:0;font-size:24px">' + titreEmail + '</h1></div><div style="background:white;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px"><p style="font-size:16px;color:#1e293b">Votre devis <strong>' + devisData.numero + '</strong> a ete <strong>' + (estAccepte ? 'accepte' : 'refuse') + '</strong> par <strong>' + nom + '</strong>.</p>' + (estAccepte ? '<div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:8px;margin:20px 0"><p style="margin:0;color:#16a34a;font-weight:bold">Montant : ' + Number(devisData.montant_ttc).toFixed(2) + ' EUR TTC</p></div>' : '') + '<a href="https://fairedesdevis.fr/dashboard/devis/' + devisId + '" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin-top:16px">Voir le devis</a></div></div>'
      })
    }

    if (estAccepte && devisData.client_email) {
      await resend.emails.send({
        from: 'FaireDesDevis <noreply@fairedesdevis.fr>',
        to: devisData.client_email,
        subject: 'Confirmation devis ' + devisData.numero + ' accepte',
        html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px"><div style="background:#2563eb;padding:24px;border-radius:12px 12px 0 0;text-align:center"><h1 style="color:white;margin:0;font-size:24px">FaireDesDevis</h1></div><div style="background:white;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px"><p style="font-size:16px;color:#1e293b">Bonjour <strong>' + nom + '</strong>,</p><p style="color:#64748b">Confirmation de votre acceptation du devis <strong>' + devisData.numero + '</strong> de <strong>' + prestaNom + '</strong>.</p><div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:8px;margin:20px 0"><p style="margin:0;color:#16a34a;font-weight:bold">Devis accepte</p><p style="margin:8px 0 0;color:#64748b;font-size:13px">Montant : ' + Number(devisData.montant_ttc).toFixed(2) + ' EUR TTC</p></div><p style="color:#94a3b8;font-size:12px">Conservez cet email comme preuve.</p></div></div>'
      })
    }

    return NextResponse.json({ success: true, action, estAccepte })
  } catch (error) {
    console.error('Erreur notification:', error)
    return NextResponse.json({ error: 'Erreur notification' }, { status: 500 })
  }
}