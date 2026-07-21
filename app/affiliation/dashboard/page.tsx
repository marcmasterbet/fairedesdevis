'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AffiliationDashboard() {
  const router = useRouter()
  const [affilie, setAffilie] = useState<any>(null)
  const [filleuls, setFilleuls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const load = async () => {
      // Lire l'email depuis la session Supabase
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // Vérifier qu'il est bien affilié et approuvé
      const { data: affilieData } = await supabase
        .from('affilies')
        .select('*')
        .eq('email', user.email)
        .eq('statut', 'approuve')
        .single()

      if (!affilieData) { router.push('/'); return }

      setAffilie(affilieData)

      const { data: filleulsData } = await supabase
        .from('filleuls')
        .select('*')
        .eq('ref_code', affilieData.code)

      setFilleuls(filleulsData || [])
      setLoading(false)
    }
    load()
  }, [router])

  const copierLien = () => {
    navigator.clipboard.writeText(`https://fairedesdevis.fr/?ref=${affilie.code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filleulsActifs = filleuls.filter(f => f.commission_active).length
  const gainsMois = filleulsActifs * 4

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-blue-600">FaireDesDevis</a>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">Espace affilié — {affilie.nom}</p>
            <a href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">Mon compte →</a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
            <p className="text-4xl font-bold text-gray-900">{filleuls.length}</p>
            <p className="text-gray-500 text-sm mt-1">Filleuls inscrits</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
            <p className="text-4xl font-bold text-blue-600">{filleulsActifs}</p>
            <p className="text-gray-500 text-sm mt-1">Abonnements actifs</p>
          </div>
          <div className="bg-blue-600 rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-white">{gainsMois}€</p>
            <p className="text-blue-200 text-sm mt-1">Gains ce mois</p>
          </div>
        </div>

        {/* Lien affilié */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="font-bold text-gray-900 text-lg mb-4">🔗 Votre lien d'affiliation</h2>
          <div className="flex gap-3 items-center">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 font-mono truncate">
              https://fairedesdevis.fr/?ref={affilie.code}
            </div>
            <button
              onClick={copierLien}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition whitespace-nowrap"
            >
              {copied ? '✓ Copié !' : 'Copier'}
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-3">Partagez ce lien — chaque inscription via ce lien vous rapporte 4€/mois</p>
        </div>

        {/* Simulateur */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="font-bold text-gray-900 text-lg mb-4">💶 Projection de gains</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[5, 10, 25, 50].map(n => (
              <div key={n} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{n * 4}€</p>
                <p className="text-gray-500 text-xs mt-1">{n} clients actifs</p>
              </div>
            ))}
          </div>
        </div>

        {/* Liste filleuls */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="font-bold text-gray-900 text-lg mb-4">👥 Vos filleuls ({filleuls.length})</h2>
          {filleuls.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">🔗</p>
              <p className="text-gray-500 text-sm">Aucun filleul pour l'instant.</p>
              <p className="text-gray-400 text-xs mt-1">Partagez votre lien pour commencer à gagner !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filleuls.map((f, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{f.email}</p>
                    <p className="text-xs text-gray-400">
                      Inscrit le {new Date(f.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    f.commission_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {f.commission_active ? '✓ Actif — 4€/mois' : 'En attente'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Infos paiement */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h2 className="font-bold text-amber-800 text-lg mb-2">💳 Vos virements</h2>
          <p className="text-amber-700 text-sm">
            Les commissions sont versées le <strong>1er de chaque mois</strong> par virement bancaire.
            Pour mettre à jour vos coordonnées bancaires, contactez-nous à{' '}
            <a href="mailto:affiliation@fairedesdevis.fr" className="underline">affiliation@fairedesdevis.fr</a>
          </p>
        </div>

      </div>
    </main>
  )
}