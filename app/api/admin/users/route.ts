import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    const { data: devis } = await supabaseAdmin.from('devis').select('user_id, montant_ttc')
    const { data: factures } = await supabaseAdmin.from('factures').select('user_id')

    const usersAvecStats = users.map(u => {
      const userDevis = devis?.filter(d => d.user_id === u.id) || []
      const userFactures = factures?.filter(f => f.user_id === u.id) || []

      const dateInscription = new Date(u.created_at)
      const maintenant = new Date()
      const joursDepuisInscription = Math.floor((maintenant.getTime() - dateInscription.getTime()) / (1000 * 60 * 60 * 24))
      const joursRestants = 30 - joursDepuisInscription
      const essaiActif = joursRestants > 0

      const bannedUntil = (u as any).banned_until || null
      const suspendu = bannedUntil && bannedUntil !== 'none' && new Date(bannedUntil) > new Date()

      return {
        ...u,
        nbDevis: userDevis.length,
        nbFactures: userFactures.length,
        joursDepuisInscription,
        joursRestants,
        essaiActif,
        banned_until: bannedUntil,
        suspendu
      }
    })

    const totalMontant = devis?.reduce((s, d) => s + Number(d.montant_ttc), 0) || 0

    return NextResponse.json({
      users: usersAvecStats,
      stats: {
        totalUsers: users.length,
        totalDevis: devis?.length || 0,
        totalFactures: factures?.length || 0,
        totalMontant,
        essaisActifs: usersAvecStats.filter(u => u.essaiActif && !u.suspendu).length,
        essaisExpires: usersAvecStats.filter(u => !u.essaiActif && !u.suspendu).length,
        suspendus: usersAvecStats.filter(u => u.suspendu).length
      }
    })
  } catch (error) {
    console.error('Erreur admin:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}