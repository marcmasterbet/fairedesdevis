'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Abonnement() {
  const [loading, setLoading] = useState<string | null>(null)
  const [cancel, setCancel] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('cancel') === 'true') setCancel(true)
  }, [])

  const handleSouscrire = async (plan: 'mensuel' | 'annuel') => {
    setLoading(plan)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, email: user.email, plan })
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Erreur lors de la création de la session de paiement')
      setLoading(null)
    }
  }

  const features = [
    'Devis illimités',
    'Signature électronique légale',
    'Facturation en 1 clic',
    'Catalogue et clients illimités',
    'Emails automatiques au client',
    'Support prioritaire',
  ]

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">

        <a href="/" className="text-blue-600 font-bold text-xl block text-center mb-6">FaireDesDevis</a>

        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Votre essai est terminé</h1>
        <p className="text-gray-500 text-sm mb-8 text-center">Continuez à créer vos devis en quelques secondes</p>

        {cancel && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm mb-6 text-center">
            Paiement annulé — vous pouvez réessayer quand vous voulez.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* MENSUEL */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Mensuel</h3>
            <p className="text-4xl font-bold text-gray-900 mb-1">24,99€</p>
            <p className="text-gray-400 text-sm mb-6">par mois · résiliation libre</p>
            <ul className="space-y-2 mb-6">
              {features.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500 font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSouscrire('mensuel')}
              disabled={loading !== null}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {loading === 'mensuel' ? 'Redirection...' : 'Choisir le mensuel →'}
            </button>
          </div>

          {/* ANNUEL */}
          <div className="bg-blue-600 rounded-2xl p-6 border-2 border-blue-600 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
              🎉 2 mois offerts — meilleure offre
            </div>
            <h3 className="text-lg font-bold text-white mb-2 mt-2">Annuel</h3>
            <p className="text-4xl font-bold text-white mb-1">249€</p>
            <p className="text-blue-200 text-sm mb-1">par an · soit 20,75€/mois</p>
            <p className="text-amber-300 text-xs font-semibold mb-6">Économisez 51€ par rapport au mensuel</p>
            <ul className="space-y-2 mb-6">
              {features.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white">
                  <span className="text-green-300 font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSouscrire('annuel')}
              disabled={loading !== null}
              className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 disabled:opacity-50 transition"
            >
              {loading === 'annuel' ? 'Redirection...' : 'Choisir l\'annuel →'}
            </button>
          </div>

        </div>

        <div className="flex justify-center gap-4 text-gray-400 text-xs flex-wrap mb-4">
          <span>✅ Aucun engagement</span>
          <span>✅ Annulation en 1 clic</span>
          <span>✅ Résiliation libre</span>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg px-4 py-3 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            ⚠️ En vous abonnant, votre carte sera prélevée du montant choisi à chaque renouvellement. Résiliation en 1 clic depuis votre espace client, sans frais ni préavis.
          </p>
        </div>

        <p className="text-gray-300 text-xs mt-3 text-center">
          Une question ? <a href="mailto:support@fairedesdevis.fr" className="text-blue-400 hover:underline">support@fairedesdevis.fr</a>
        </p>

      </div>
    </main>
  )
}