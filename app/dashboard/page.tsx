'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import NavBar from '../components/NavBar'
import Header from '../components/Header'

interface Devis {
  id: string
  numero: string
  client_nom: string
  montant_ttc: number
  statut: string
  created_at: string
  archive: boolean
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [devis, setDevis] = useState<Devis[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase.from('devis').select('*').order('created_at', { ascending: false }).limit(5)
      setDevis(data || [])
      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  const nom = (user?.user_metadata?.['nom'] as string) || 'Utilisateur'
  const metier = (user?.user_metadata?.['metier'] as string) || ''

  const now = new Date()
  const devisCeMois = devis.filter(d => {
    const date = new Date(d.created_at)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })
  const devisAcceptes = devis.filter(d => d.statut === 'accepte' && !d.archive)
  const devisEnAttente = devis.filter(d => d.statut === 'envoye' && !d.archive)
  const montantTotal = devisAcceptes.reduce((s, d) => s + Number(d.montant_ttc), 0)

  const getStatutStyle = (s: string) => {
    if (s === 'accepte') return 'bg-green-100 text-green-700'
    if (s === 'refuse') return 'bg-red-100 text-red-700'
    if (s === 'envoye') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header action={
        <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500">
          Deconnexion
        </button>
      } />

      <div className="max-w-5xl mx-auto px-6 py-8 pb-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Bonjour {nom} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">{metier}</p>
        </div>

        {/* Stats cliquables */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{devisCeMois.length}</p>
            <p className="text-xs text-gray-500 mt-1">Devis ce mois</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/devis?statut=accepte')}
            className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-green-300 hover:bg-green-50 transition"
          >
            <p className="text-2xl font-bold text-green-600">{devisAcceptes.length}</p>
            <p className="text-xs text-gray-500 mt-1">Acceptes</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/devis?statut=envoye')}
            className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300 hover:bg-blue-50 transition"
          >
            <p className="text-2xl font-bold text-blue-600">{devisEnAttente.length}</p>
            <p className="text-xs text-gray-500 mt-1">En attente</p>
          </button>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{montantTotal.toFixed(0)} EUR</p>
            <p className="text-xs text-gray-500 mt-1">Montant accepte</p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <a href="/dashboard/devis/nouveau" className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition">
            <p className="text-2xl mb-2">✏️</p>
            <p className="font-semibold">Nouveau devis</p>
            <p className="text-blue-200 text-sm mt-1 hidden md:block">Generer en 60 secondes</p>
          </a>
          <a href="/dashboard/clients" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
            <p className="text-2xl mb-2">👥</p>
            <p className="font-semibold text-gray-900">Mes clients</p>
          </a>
          <a href="/dashboard/catalogue" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
            <p className="text-2xl mb-2">📦</p>
            <p className="font-semibold text-gray-900">Mon catalogue</p>
          </a>
          <a href="/dashboard/profil" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
            <p className="text-2xl mb-2">⚙️</p>
            <p className="font-semibold text-gray-900">Mon profil</p>
          </a>
        </div>

        {/* Derniers devis */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Derniers devis</h2>
            <a href="/dashboard/devis" className="text-sm text-blue-600 hover:underline">Voir tous →</a>
          </div>
          <div className="p-4">
            {devis.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">Aucun devis pour le moment</p>
                <a href="/dashboard/devis/nouveau" className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Creer mon premier devis
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                {devis.map(d => (
                  <div
                    key={d.id}
                    onClick={() => router.push('/dashboard/devis/' + d.id)}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{d.numero}</p>
                      <p className="text-xs text-gray-500">{d.client_nom} · {new Date(d.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 hidden sm:block">{Number(d.montant_ttc).toFixed(2)} EUR</p>
                      <span className={'px-2 py-1 rounded-full text-xs font-medium ' + getStatutStyle(d.statut)}>
                        {d.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <NavBar active="dashboard" />
    </main>
  )
}