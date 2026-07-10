import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { devisId, action, nom } = await req.json()

  try {
    const { data: devisData } = await supabaseAdmin
      .from('devis')
      .select('*')
      .eq('id', devisId)
      .single()

    if (!devisData) return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 })

    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(devisData.user_id)
    const prestaEmail = userData?.user?.email
    const prestaNom = userData?.user?.user_metadata?.['nom'] || 'Votre prestataire'

    const emoji = action === 'accepté' ? '✅' : '❌'
    const sujet = action === 'accepté'
      ? `${emoji} Devis ${devisData.numero} accepté par ${nom}`
      : `${emoji} Devis ${devisData.numero} refusé`

    if (prestaEmail) {
      await resend.emails.send({
        from: 'FaireDesDevis <onboarding@resend.dev>',
        to: prestaEmail,
        subject: sujet,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <div style="background:${action === 'accepte' ? '#16a34a' : '#dc2626'};padding:24px;border-radius:12px 12px 0 0;text-align:center">
              <h1 style="color:white;margin:0;font-size:24px">${emoji} Devis ${action}</h1>
            </div>
            <div style="background:white;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">
              <p style="font-size:16px;color:#1e293b">Votre devis <strong>${devisData.numero}</strong> a été <strong>${action}</strong> par <strong>${nom}</strong>.</p>
              ${action === 'accepté' ? `
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:8px;margin:20px 0">
                  <p style="margin:0;color:#16a34a;font-weight:bold">Montant : ${Number(devisData.montant_ttc).toFixed(2)} € TTC</p>
                  <p style="margin:8px 0 0;color:#64748b;font-size:13px">Signé le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
                </div>
              ` : ''}
              <a href="https://fairedesdevis.fr/dashboard/devis/${devisId}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin-top:16px">
                Voir le devis →
              </a>
            </div>
          </div>
        `
      })
    }

    if (action === 'accepté' && devisData.client_email) {
      await resend.emails.send({
        from: 'FaireDesDevis <onboarding@resend.dev>',
        to: devisData.client_email,
        subject: `✅ Confirmation — Devis ${devisData.numero} accepté`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <div style="background:#2563eb;padding:24px;border-radius:12px 12px 0 0;text-align:center">
              <h1 style="color:white;margin:0;font-size:24px">FaireDesDevis</h1>
            </div>
            <div style="background:white;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">
              <p style="font-size:16px;color:#1e293b">Bonjour <strong>${nom}</strong>,</p>
              <p style="color:#64748b">Voici la confirmation de votre acceptation du devis <strong>${devisData.numero}</strong> de <strong>${prestaNom}</strong>.</p>
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:8px;margin:20px 0">
                <p style="margin:0;color:#16a34a;font-weight:bold">✅ Devis accepté</p>
                <p style="margin:8px 0 0;color:#64748b;font-size:13px">Montant : ${Number(devisData.montant_ttc).toFixed(2)} € TTC</p>
                <p style="margin:4px 0 0;color:#64748b;font-size:13px">Date : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
              </div>
              <p style="color:#94a3b8;font-size:12px">Conservez cet email comme preuve d'acceptation.</p>
            </div>
          </div>
        `
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur notification:', error)
    return NextResponse.json({ error: 'Erreur notification' }, { status: 500 })
  }
}