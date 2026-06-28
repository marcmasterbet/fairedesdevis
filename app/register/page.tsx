'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nom, setNom] = useState('')
  const [metier, setMetier] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nom, metier } }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <a href="/" className="text-blue-600 font-bold text-xl">FaireDesDevis</a>
        <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Créer votre compte</h2>
        <p className="text-gray-500 text-sm mb-6">1 devis gratuit — sans carte bancaire</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nom complet</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Jean-Pierre Moreau"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Votre métier</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Plombier, électricien, graphiste..."
              value={metier}
              onChange={(e) => setMetier(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="jean@exemple.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Mot de passe</label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Minimum 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer mon compte gratuitement →'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ? <a href="/login" className="text-blue-600">Se connecter</a>
        </p>
      </div>
    </main>
  )
}