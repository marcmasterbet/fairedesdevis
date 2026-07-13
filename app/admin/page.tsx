'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const ADMIN_EMAIL = 'marc.masterbet@gmail.com'

interface Utilisateur {
  id: string
  email: string
  created_at: string
  user_metadata: {
    nom: string
    metier: string
    siret: string
    telephone: string
    adresse: string
  }
  nbDevis?: number
  nbFactures?: number
}

export default function Admin() {
  const [users, setUsers] = useState<Utilisateur[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalUsers: 0, totalDevis: 0, totalFactures: 0, totalMontant: 0 })
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/')
        return
      }

      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data.users || [])
      setStats(data.stats || {})
      setLoading(false)
    }
    init()
  }, [router])

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.user_metadata?.nom?.toLowerCase().includes(search.toLowerCase()) ||
    u.user_metadata?.metier?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-blue-600">FaireDesDevis</h1>
          <p className="text-xs text-gray-400">Dashboard Admin</p>
        </div>
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Mon compte</a>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Admin</h2>

        {/* Stats globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            <p className="text-xs text-gray-500 mt-1">Utilisateurs</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.totalDevis}</p>
            <p className="text-xs text-gray-500 mt-1">Devis créés</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.totalFactures}</p>
            <p className="text-xs text-gray-500 mt-1">Factures</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{Number(stats.totalMontant).toFixed(0)} EUR</p>
            <p className="text-xs text-gray-500 mt-1">Montant total devis</p>
          </div>
        </div>

        {/* Recherche */}
        <input
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-4"
          placeholder="Rechercher par nom, email, métier..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Liste utilisateurs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <p className="text-xs font-semibold text-gray-500 uppercase">{filtered.length} utilisateurs</p>
          </div>
          <div className="divide-y divide-gray-100">
            {filtered.map(u => (
              <div key={u.id} className="px-6 py-4">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{u.user_metadata?.nom || '—'}</p>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{u.user_metadata?.metier || '—'}</span>
                    </div>
                    <p className="text-sm text-gray-500">{u.email}</p>
                    {u.user_metadata?.siret && (
                      <p className="text-xs text-gray-400 mt-1">SIRET : {u.user_metadata.siret}</p>
                    )}
                    {u.user_metadata?.telephone && (
                      <p className="text-xs text-gray-400">Tel : {u.user_metadata.telephone}</p>
                    )}
                    {u.user_metadata?.adresse && (
                      <p className="text-xs text-gray-400">{u.user_metadata.adresse}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Inscrit le {new Date(u.created_at).toLocaleDateString('fr-FR')}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{u.nbDevis || 0} devis</p>
                    <p className="text-sm text-gray-500">{u.nbFactures || 0} factures</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}