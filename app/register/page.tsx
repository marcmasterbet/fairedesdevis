'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nom, setNom] = useState('')
  const [metier, setMetier] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { label: '', color: '' }
    if (pwd.length < 8) return { label: 'Trop court', color: 'bg-red-400' }
    const hasUpper = /[A-Z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    const score = [hasUpper, hasNumber, hasSymbol].filter(Boolean).length
    if (score === 0) return { label: 'Faible', color: 'bg-red-400' }
    if (score === 1) return { label: 'Moyen', color: 'bg-orange-400' }
    if (score === 2) return { label: 'Bien', color: 'bg-yellow-400' }
    return { label: 'Fort', color: 'bg-green-400' }
  }

  const strength = getPasswordStrength(password)

  const getRefCookie = () => {
    const match = document.cookie.match(/fairedesdevis_ref=([^;]+)/)
    return match ? match[1] : null
  }

  const handleRegister = async () => {
    if (!nom || !metier || !email || !password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (!/[A-Z]/.test(password)) {
      setError('Le mot de passe doit contenir au moins une majuscule.')
      return
    }
    if (!/[0-9]/.test(password)) {
      setError('Le mot de passe doit contenir au moins un chiffre.')
      return
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setError('Le mot de passe doit contenir au moins un symbole (!@#$%...).')
      return
    }

    setLoading(true)
    setError('')

    const refCode = getRefCookie()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nom, metier, ref: refCode },
        emailRedirectTo: 'https://fairedesdevis.fr/auth/callback'
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (refCode && data.user) {
      await supabase.from('filleuls').insert({
        user_id: data.user.id,
        ref_code: refCode,
        email: email,
      })
    }

    await fetch('/api/notifier-inscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, email, metier, ref: refCode })
    })

    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">📬</div>
        <a href="/" className="text-blue-600 font-bold text-xl">FaireDesDevis</a>
        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Vérifiez vos emails !</h2>
        <p className="text-gray-500 text-sm mb-4">
          Un email de confirmation a été envoyé à<br/>
          <strong className="text-gray-900">{email}</strong>
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6">
          <p className="text-yellow-700 text-sm">
            📁 Si vous ne trouvez pas l'email, vérifiez vos <strong>spams</strong> ou courriers indésirables.
          </p>
        </div>
        <p className="text-gray-400 text-sm mb-4">Une fois confirmé, cliquez sur le lien dans l'email pour accéder à votre compte.</p>
        <a href="/login" className="block bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
          Aller à la connexion →
        </a>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <a href="/" className="text-blue-600 font-bold text-xl">FaireDesDevis</a>
        <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Créer votre compte</h2>

        {/* Message rassurant */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-blue-700 text-sm font-semibold mb-1">🎉 30 jours pour créer autant de devis que vous voulez</p>
          <div className="space-y-0.5">
            <p className="text-blue-600 text-xs">✅ Aucun engagement</p>
            <p className="text-blue-600 text-xs">✅ Annulation en 1 clic avant la fin de l'essai</p>
            <p className="text-blue-600 text-xs">✅ Aucun frais pendant 30 jours</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nom complet</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Jean-Pierre Moreau"
              value={nom}
              onChange={e => setNom(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Votre métier</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Plombier, électricien, graphiste..."
              value={metier}
              onChange={e => setMetier(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="jean@exemple.fr"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 pr-12"
                placeholder="Minimum 8 caractères"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded ${
                      strength.label === 'Fort' ? 'bg-green-400' :
                      strength.label === 'Moyen' && i < 2 ? 'bg-yellow-400' :
                      strength.label === 'Faible' && i < 1 ? 'bg-orange-400' :
                      strength.label === 'Trop court' && i < 1 ? 'bg-red-400' :
                      'bg-gray-200'
                    }`} />
                  ))}
                </div>
                <p className="text-xs text-gray-500">{strength.label}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Création en cours...' : 'Commencer mes 30 jours gratuits →'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ? <a href="/login" className="text-blue-600 hover:underline">Se connecter</a>
        </p>
        <p className="text-center text-xs text-gray-400 mt-4">🔒 Vos données sont sécurisées et chiffrées</p>
      </div>
    </main>
  )
}