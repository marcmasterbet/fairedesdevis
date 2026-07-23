'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    const user = data.user
    const metadata = user.user_metadata ?? {}
    const estVIP = metadata.actif_manuellement === true
    const statutStripe = String(metadata.stripe_statut ?? '').toLowerCase()
    const aUnAbonnement =
      metadata.abonnement_actif === true ||
      statutStripe === 'trialing' ||
      statutStripe === 'active' ||
      statutStripe === 'actif'
    const aUneCarteStripe = !!metadata.stripe_customer_id

    // Si pas VIP et pas d'abonnement et pas de carte → Stripe
    if (!estVIP && !aUnAbonnement && !aUneCarteStripe) {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email })
      })
      const stripeData = await res.json()
      if (stripeData.url) {
        window.location.href = stripeData.url
        return
      }
    }

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <a href="/" className="text-blue-600 font-bold text-xl">FaireDesDevis</a>
        <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Connexion</h2>
        <p className="text-gray-500 text-sm mb-6">Accédez à votre espace professionnel</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="jean@exemple.fr"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Mot de passe</label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Votre mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ? <a href="/register" className="text-blue-600 hover:underline">Créer un compte</a>
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          <a href="/mot-de-passe-oublie" className="hover:text-blue-600">Mot de passe oublié ?</a>
        </p>
      </div>
    </main>
  )
}