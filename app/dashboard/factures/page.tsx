'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import NavBar from '../../components/NavBar'
import Header from '../../components/Header'

interface Facture {
  id: string
  numero: string
  client_nom: string
  client_email: string
  montant_ttc: number
  statut: string
  date_echeance: string
  created_at: string
}

export default function Factures() {
  const [factures, setFactures] = useState<Facture[]>([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState('tous')
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('factures').select('*').order('created_at', { ascending: false })
      setFactures(data || [])
      setLoading(false)
    }
    init()
  }, [router])

  const statutColor = (statut: string) => {
    if (statut === 'payee') return 'bg-green-100 text-green-700'
    if (statut === 'en_retard') return 'bg-red-100 text-red-700'
    if (statut === 'en_attente') return 'bg-amber-100 text-amber-700'
    return 'bg-gray-100 text-gray-600'
  }

  const statutLabel = (statut: string) => {
    if (statut === 'payee') return 'Payee'
    if (statut === 'en_retard') return 'En retard'
    if (statut === 'en_attente') return 'En attente'
    return statut
  }

  const filtered = factures.filter(f => {
    const matchFiltre = filtre === 'tous' || f.statut === filtre
    const matchSearch = f.client_nom?.toLowerCase().includes(search.toLowerCase()) ||
      f.numero?.toLowerCase().includes(search.toLowerCase())
    return matchFiltre && matchSearch
  })

  const totalEnAttente = factures.filter(f => f.statut === 'en_attente').reduce((s, f) => s + Number(f.montant_ttc), 0)
  const totalPayee = factures.filter(f => f.statut === 'payee').reduce((s, f) => s + Number(f.montant_ttc), 0)
  const totalEnRetard = factures.filter(f => f.statut === 'en_retard').reduce((s, f) => s + Number(f.montant_ttc), 0)

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <Header back="/dashboard" backLabel="← Dashboard" />
      <div className="max-w-3xl mx-auto px-6 py-8 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mes factures</h1>
          <p className="text-gray-500 text-sm mt-1">{factures.length} facture{factures.length > 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">En attente</p>
            <p className="text-lg font-bold text-amber-600">{totalEnAttente.toFixed(2)} EUR</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Payees</p>
            <p className="text-lg font-bold text-green-600">{totalPayee.toFixed(2)} EUR</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">En retard</p>
            <p className="text-lg font-bold text-red-600">{totalEnRetard.toFixed(2)} EUR</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {['tous', 'en_attente', 'payee', 'en_retard'].map(f => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={'px-4 py-2 rounded-lg text-sm font-medium transition ' + (
                filtre === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              )}
            >
              {f === 'tous' ? 'Toutes' : statutLabel(f)}
            </button>
          ))}
        </div>

        {factures.length > 0 && (
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-4"
            placeholder="Rechercher par client ou numero..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        )}

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">🧾</p>
            <p className="text-gray-500 text-sm">Aucune facture pour le moment</p>
            <p className="text-gray-400 text-xs mt-2">Transformez un devis accepte en facture depuis la page du devis</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(facture => (
              <div
                key={facture.id}
                onClick={() => router.push('/dashboard/factures/' + facture.id)}
                className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center hover:border-blue-200 transition cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{facture.numero}</p>
                    <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + statutColor(facture.statut)}>
                      {statutLabel(facture.statut)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{facture.client_nom}</p>
                  {facture.date_echeance && (
                    <p className="text-xs text-gray-400 mt-1">
                      Echeance : {new Date(facture.date_echeance).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{Number(facture.montant_ttc).toFixed(2)} EUR</p>
                  <p className="text-xs text-gray-400">{new Date(facture.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <NavBar active="devis" />
    </main>
  )
}