'use client'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { supabase } from '../../../../lib/supabase'
import { useRouter } from 'next/navigation'
import NavBar from '../../../components/NavBar'

interface Facture {
  id: string
  numero: string
  devis_id: string
  client_nom: string
  client_email: string
  montant_ht: number
  tva: number
  montant_ttc: number
  statut: string
  date_echeance: string
  date_paiement: string
  contenu: string
  created_at: string
}

export default function FacturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [facture, setFacture] = useState<Facture | null>(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('factures').select('*').eq('id', id).single()
      setFacture(data)
      setLoading(false)
    }
    init()
  }, [id, router])

  const handleMarquerPayee = async () => {
    if (!confirm('Marquer cette facture comme payee ?')) return
    setMarking(true)
    const { data } = await supabase.from('factures').update({
      statut: 'payee',
      date_paiement: new Date().toISOString()
    }).eq('id', id).select()
    if (data) setFacture(data[0])
    setMarking(false)
  }

  const handleEnvoyer = async () => {
    if (!facture?.client_email) { alert('Pas email client'); return }
    setSending(true)
    const { data: { user } } = await supabase.auth.getUser()
    const prestaNom = user?.user_metadata?.['nom'] || ''

    await fetch('/api/envoyer-facture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        devisId: id,
        clientEmail: facture.client_email,
        clientNom: facture.client_nom,
        prestataireNom: prestaNom,
        numero: facture.numero,
        montantTTC: Number(facture.montant_ttc).toFixed(2),
        lienSignature: 'https://fairedesdevis.fr/dashboard/factures/' + id,
        isFacture: true
      })
    })

    setSent(true)
    setSending(false)
  }

  const handleSupprimer = async () => {
    if (!confirm('Supprimer cette facture ?')) return
    await supabase.from('factures').delete().eq('id', id)
    router.push('/dashboard/factures')
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  if (!facture) return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-400">Facture introuvable</p>
    </main>
  )

  const statutColor = facture.statut === 'payee' ? 'bg-green-100 text-green-700' : facture.statut === 'en_retard' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
  const statutLabel = facture.statut === 'payee' ? 'Payee' : facture.statut === 'en_retard' ? 'En retard' : 'En attente'

  return (
    <div style={{backgroundColor:'#f1f5f9',minHeight:'100vh'}}>
      <div className="print:hidden bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <a href="/dashboard/factures" className="text-sm text-gray-500 hover:text-gray-700">Mes factures</a>
          <div className="flex flex-wrap gap-2 items-center">
            <span className={'px-3 py-1 rounded-full text-xs font-medium ' + statutColor}>{statutLabel}</span>
            {facture.devis_id && (
              <a href={'/dashboard/devis/' + facture.devis_id} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">
                Voir le devis
              </a>
            )}
            {facture.statut !== 'payee' && (
              <button onClick={handleEnvoyer} disabled={sending} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {sending ? 'Envoi...' : sent ? 'Envoyee' : 'Envoyer au client'}
              </button>
            )}
            {facture.statut !== 'payee' && (
              <button onClick={handleMarquerPayee} disabled={marking} className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
                {marking ? 'Sauvegarde...' : '✅ Marquer payee'}
              </button>
            )}
            <button onClick={() => window.print()} className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800">PDF</button>
            <button onClick={handleSupprimer} className="text-red-400 hover:text-red-600 px-3 py-2 text-sm font-semibold">Supprimer</button>
          </div>
        </div>
      </div>

      {sent && (
        <div className="max-w-3xl mx-auto mt-4 px-4 print:hidden">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Facture envoyee a {facture.client_email}
          </div>
        </div>
      )}

      {facture.statut === 'payee' && facture.date_paiement && (
        <div className="max-w-3xl mx-auto mt-4 px-4 print:hidden">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            ✅ Payee le {new Date(facture.date_paiement).toLocaleDateString('fr-FR')}
          </div>
        </div>
      )}

      {facture.date_echeance && facture.statut !== 'payee' && (
        <div className="max-w-3xl mx-auto mt-4 px-4 print:hidden">
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm">
            Echeance : {new Date(facture.date_echeance).toLocaleDateString('fr-FR')}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto my-6 bg-white shadow-sm rounded-xl overflow-hidden print:shadow-none print:my-0 print:max-w-none">
        <div style={{padding:'48px'}} dangerouslySetInnerHTML={{__html: facture.contenu}} />
      </div>

      <div style={{height:'80px'}} className="print:hidden" />
      <NavBar active="devis" />
    </div>
  )
}