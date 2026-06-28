'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else { setUser(user); setLoading(false) }
    }
    getUser()
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

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <span className="text-blue-600 font-bold text-xl">FaireDesDevis</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{nom}</span>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500">Déconnexion</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Bienvenue */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Bonjour {nom} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">{metier}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Devis ce mois', value: '0' },
            { label: 'Acceptés', value: '0' },
            { label: 'En attente', value: '0' },
            { label: 'Montant total', value: '0 €' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <a href="/dashboard/devis/nouveau" className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition">
            <p className="text-2xl mb-2">✏️</p>
            <p className="font-semibold">Nouveau devis</p>
            <p className="text-blue-200 text-sm mt-1">Générer en 60 secondes</p>
          </a>
          <a href="/dashboard/clients" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
            <p className="text-2xl mb-2">👥</p>
            <p className="font-semibold text-gray-900">Mes clients</p>
            <p className="text-gray-400 text-sm mt-1">Gérer le carnet clients</p>
          </a>
          <a href="/dashboard/catalogue" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
            <p className="text-2xl mb-2">📦</p>
            <p className="font-semibold text-gray-900">Mon catalogue</p>
            <p className="text-gray-400 text-sm mt-1">Produits et prestations</p>
          </a>
        </div>

        {/* Derniers devis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Mes devis</h2>
            <a href="/dashboard/devis/nouveau" className="text-sm text-blue-600 hover:underline">+ Nouveau</a>
          </div>
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📄</p>
            <p className="text-gray-500 text-sm">Vous n'avez pas encore de devis</p>
            <a href="/dashboard/devis/nouveau" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
              Créer mon premier devis →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}