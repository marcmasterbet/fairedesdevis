import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nom, email, metier } = body

  try {
    await resend.emails.send({
      from: 'FaireDesDevis <noreply@fairedesdevis.fr>',
      to: 'marc.masterbet@gmail.com',
      subject: '🎉 Nouvel utilisateur : ' + nom,
      html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">'
        + '<div style="background:#2563eb;padding:24px;border-radius:12px 12px 0 0;text-align:center">'
        + '<h1 style="color:white;margin:0;font-size:20px">Nouvel utilisateur FaireDesDevis</h1>'
        + '</div>'
        + '<div style="background:white;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">'
        + '<p style="font-size:16px;color:#1e293b">Un nouvel artisan vient de s inscrire !</p>'
        + '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:20px 0">'
        + '<p style="margin:0 0 8px 0;color:#64748b;font-size:13px"><strong style="color:#1e293b">Nom :</strong> ' + nom + '</p>'
        + '<p style="margin:0 0 8px 0;color:#64748b;font-size:13px"><strong style="color:#1e293b">Email :</strong> ' + email + '</p>'
        + '<p style="margin:0;color:#64748b;font-size:13px"><strong style="color:#1e293b">Metier :</strong> ' + metier + '</p>'
        + '</div>'
        + '<p style="color:#64748b;font-size:13px">Date : ' + new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + '</p>'
        + '<a href="https://fairedesdevis.fr/admin" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin-top:16px">Voir le dashboard admin</a>'
        + '</div>'
        + '</div>'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur notification inscription:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}