'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Abonnement() {
  const [loading, setLoading] = useState(false)
  const [cancel, setCancel] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('cancel') === 'true') setCancel(true)
  }, [])

  const handleSouscrire = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, email: user.email })
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Erreur lors de la création de la session de paiement')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">FaireDesDevis Pro</h1>

        {cancel && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm mb-6">
            Paiement annulé — vous pouvez réessayer quand vous voulez.
          </div>
        )}

        <div className="bg-blue-600 rounded-2xl p-6 mb-6 mt-4">
          <p className="text-5xl font-bold text-white mb-1">19,90€</p>
          <p className="text-blue-200 text-sm">par mois · résiliation libre</p>
          <div className="bg-amber-400 text-amber-900 text-sm font-bold px-4 py-2 rounded-full mt-4 inline-block">
            🎉 1er mois gratuit
          </div>
        </div>

        <ul className="space-y-2 text-left mb-6">
          {[
            'Devis illimités',
            'Signature électronique légale',
            'Facturation en 1 clic',
            'Catalogue et clients illimités',
            'Emails automatiques',
            'Support prioritaire',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-green-500 font-bold">✓</span> {item}
            </li>
          ))}
        </ul>

        <button
          onClick={handleSouscrire}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Redirection...' : 'Commencer — 1 mois gratuit →'}
        </button>
        <p className="text-gray-400 text-xs mt-4">Carte bancaire requise · Résiliation libre · Sans engagement</p>
      </div>
    </main>
  )
}