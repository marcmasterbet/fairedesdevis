'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

interface Devis {
  id: string
  numero: string
  client_nom: string
  montant_ttc: number
  statut: string
  created_at: string
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
      const { data } = await supabase.from('devis').select('*').order('created_at', { ascending: false })
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
  const metier = (user?.user_metadata?.['metier'] as string) || 'Non renseigné'

  const now = new Date()
  const devisCeMois = devis.filter(d => {
    const date = new Date(d.created_at)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })
  const devisAcceptes = devis.filter(d => d.statut === 'accepte' || d.statut === 'accepté')
  const devisEnAttente = devis.filter(d => d.statut === 'envoye' || d.statut === 'envoyé' || d.statut === 'brouillon')
  const montantTotal = devisAcceptes.reduce((s, d) => s + Number(d.montant_ttc), 0)

  const getStatutStyle = (s: string) => {
    if (s === 'accepte' || s === 'accepté') return 'bg-green-100 text-green-700'
    if (s === 'refuse' || s === 'refusé') return 'bg-red-100 text-red-700'
    if (s === 'envoye' || s === 'envoyé') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <span className="text-blue-600 font-bold text-xl">FaireDesDevis</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden md:block">{nom}</span>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500">Déconnexion</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 pb-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Bonjour {nom} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">{metier}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{devisCeMois.length}</p>
            <p className="text-xs text-gray-500 mt-1">Devis ce mois</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-green-600">{devisAcceptes.length}</p>
            <p className="text-xs text-gray-500 mt-1">Acceptés</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-blue-600">{devisEnAttente.length}</p>
            <p className="text-xs text-gray-500 mt-1">En attente</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{montantTotal.toFixed(0)} €</p>
            <p className="text-xs text-gray-500 mt-1">Montant accepté</p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <a href="/dashboard/devis/nouveau" className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition">
            <p className="text-2xl mb-2">✏️</p>
            <p className="font-semibold">Nouveau devis</p>
            <p className="text-blue-200 text-sm mt-1 hidden md:block">Générer en 60 secondes</p>
          </a>
          <a href="/dashboard/clients" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
            <p className="text-2xl mb-2">👥</p>
            <p className="font-semibold text-gray-900">Mes clients</p>
            <p className="text-gray-400 text-sm mt-1 hidden md:block">Gérer le carnet clients</p>
          </a>
          <a href="/dashboard/catalogue" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
            <p className="text-2xl mb-2">📦</p>
            <p className="font-semibold text-gray-900">Mon catalogue</p>
            <p className="text-gray-400 text-sm mt-1 hidden md:block">Produits et prestations</p>
          </a>
          <a href="/dashboard/profil" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
            <p className="text-2xl mb-2">⚙️</p>
            <p className="font-semibold text-gray-900">Mon profil</p>
            <p className="text-gray-400 text-sm mt-1 hidden md:block">Taux horaire, TVA, SIRET</p>
          </a>
        </div>

        {/* Liste devis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Mes devis ({devis.length})</h2>
            <a href="/dashboard/devis/nouveau" className="text-sm text-blue-600 hover:underline">+ Nouveau</a>
          </div>
          {devis.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📄</p>
              <p className="text-gray-500 text-sm">Vous n'avez pas encore de devis</p>
              <a href="/dashboard/devis/nouveau" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
                Créer mon premier devis →
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {devis.map(d => (
                <a key={d.id} href={'/dashboard/devis/' + d.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition">
                  <div>
                    <p className="font-semibold text-gray-900">{d.numero}</p>
                    <p className="text-sm text-gray-500">{d.client_nom}</p>
                    <p className="text-xs text-gray-400">{new Date(d.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-gray-900">{Number(d.montant_ttc).toFixed(2)} €</p>
                    <span className={'px-2 py-1 rounded-full text-xs font-medium ' + getStatutStyle(d.statut)}>
                      {d.statut}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden flex justify-around py-3 px-4">
        <a href="/dashboard" className="flex flex-col items-center gap-1 text-blue-600"><span className="text-xl">🏠</span><span className="text-xs">Accueil</span></a>
        <a href="/dashboard/devis/nouveau" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">✏️</span><span className="text-xs">Devis</span></a>
        <a href="/dashboard/clients" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">👥</span><span className="text-xs">Clients</span></a>
        <a href="/dashboard/catalogue" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">📦</span><span className="text-xs">Catalogue</span></a>
        <a href="/dashboard/profil" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">⚙️</span><span className="text-xs">Profil</span></a>
      </div>
    </main>
  )
}