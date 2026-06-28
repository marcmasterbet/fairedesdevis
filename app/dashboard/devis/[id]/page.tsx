'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import { useRouter } from 'next/navigation'

interface Devis {
  id: string
  numero: string
  client_nom: string
  client_email: string
  client_adresse: string
  client_siret: string
  description: string
  date_debut: string
  delai: string
  montant_ht: number
  tva: number
  montant_ttc: number
  statut: string
  contenu: string
  created_at: string
}

export default function DevisPage({ params }: { params: { id: string } }) {
  const [devis, setDevis] = useState<Devis | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('devis').select('*').eq('id', params.id).single()
      setDevis(data)
      setLoading(false)
    }
    init()
  }, [params.id, router])

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  if (!devis) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Devis introuvable</p>
    </main>
  )

  const getStatutStyle = (statut: string) => {
    if (statut === 'accepté') return 'bg-green-100 text-green-700'
    if (statut === 'refusé') return 'bg-red-100 text-red-700'
    if (statut === 'envoyé') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <a href="/dashboard" className="text-blue-600 font-bold text-xl">FaireDesDevis</a>
        <div className="flex gap-3">
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← Dashboard</a>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Imprimer / PDF
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{devis.numero}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Créé le {new Date(devis.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutStyle(devis.statut)}`}>
            {devis.statut.charAt(0).toUpperCase() + devis.statut.slice(1)}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Client</h2>
          <p className="font-medium text-gray-900">{devis.client_nom}</p>
          <p className="text-sm text-gray-500">{devis.client_email}</p>
          {devis.client_adresse && <p className="text-sm text-gray-500">{devis.client_adresse}</p>}
          {devis.client_siret && <p className="text-sm text-gray-500">SIRET : {devis.client_siret}</p>}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Montants</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Total HT</span>
              <span>{Number(devis.montant_ht).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>TVA {devis.tva}%</span>
              <span>{(Number(devis.montant_ht) * Number(devis.tva) / 100).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
              <span>Total TTC</span>
              <span>{Number(devis.montant_ttc).toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Devis généré par l'IA</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
            {devis.contenu}
          </pre>
        </div>

        <div className="flex gap-3">
          <a href="/dashboard/devis/nouveau" className="flex-1 text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            Nouveau devis
          </a>
          <a href="/dashboard" className="flex-1 text-center bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:border-gray-300">
            Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}