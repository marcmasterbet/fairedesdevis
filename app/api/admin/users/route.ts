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
      return {
        ...u,
        nbDevis: userDevis.length,
        nbFactures: userFactures.length
      }
    })

    const totalMontant = devis?.reduce((s, d) => s + Number(d.montant_ttc), 0) || 0

    return NextResponse.json({
      users: usersAvecStats,
      stats: {
        totalUsers: users.length,
        totalDevis: devis?.length || 0,
        totalFactures: factures?.length || 0,
        totalMontant
      }
    })
  } catch (error) {
    console.error('Erreur admin:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}