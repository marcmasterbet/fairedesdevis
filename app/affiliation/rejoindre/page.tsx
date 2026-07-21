'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function RejoindreAffiliation() {
  const [form, setForm] = useState({ nom: '', email: '', activite: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const genererCode = (nom: string) => {
    const base = nom.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').slice(0, 10)
    const random = Math.random().toString(36).slice(2, 6)
    return base + random
  }

  const handleSubmit = async () => {
    if (!form.nom || !form.email) { setError('Nom et email obligatoires'); return }
    setLoading(true)
    setError('')

    const code = genererCode(form.nom)

    const { error: err } = await supabase.from('affilies').insert({
      nom: form.nom,
      email: form.email,
      code,
      activite: form.activite,
      description: form.description
    })

    if (err) {
      setError('Erreur lors de l inscription. Réessayez.')
      setLoading(false)
      return
    }

    await fetch('/api/notifier-inscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom: form.nom + ' (AFFILIÉ)', email: form.email, metier: form.activite || 'Affilié' })
    })

    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">🎉</div>
        <a href="/" className="text-blue-600 font-bold text-xl">FaireDesDevis</a>
        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Bienvenue dans le programme !</h2>
        <p className="text-gray-500 text-sm mb-6">
          Votre demande a été reçue. Nous vous contactons sous 24h avec votre lien d'affiliation personnalisé et accès à votre dashboard.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
          <p className="text-blue-700 text-sm font-medium">📧 Vérifiez votre boîte mail — un email de confirmation vous a été envoyé.</p>
        </div>
        <a href="/" className="block bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
          Retour à l'accueil →
        </a>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-lg">
        <a href="/affiliation" className="text-blue-600 font-bold text-xl">FaireDesDevis</a>
        <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Rejoindre le programme</h2>
        <p className="text-gray-500 text-sm mb-8">Gagnez 4€/mois par artisan parrainé — sans limite</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nom complet *</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Jean-Pierre Moreau"
              value={form.nom}
              onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email *</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="jean@exemple.fr"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Société / Activité / Situation</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Expert-comptable, créateur de contenu, particulier..."
              value={form.activite}
              onChange={e => setForm(f => ({ ...f, activite: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Comment comptez-vous promouvoir FaireDesDevis ?</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 h-24 resize-none"
              placeholder="Je suis expert-comptable avec 50 clients artisans, je conseille des groupements professionnels..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
            <p className="text-blue-700 text-sm font-semibold mb-1">💶 Ce que vous gagnez :</p>
            <p className="text-blue-600 text-sm">4€/mois par client actif · Virement mensuel · Sans plafond</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Inscription en cours...' : 'Rejoindre le programme →'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          En vous inscrivant vous acceptez nos <a href="/legal/cgu" className="text-blue-600">CGU</a>. Réponse sous 24h.
        </p>
      </div>
    </main>
  )
}