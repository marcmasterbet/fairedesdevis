'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export default function Profil() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    nom: '',
    metier: '',
    siret: '',
    telephone: '',
    adresse: '',
    email: '',
    taux_horaire: '',
    tva: '20',
    acompte: '30',
    delai_validite: '30',
    mentions_legales: '',
  })
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setForm(f => ({
        ...f,
        nom: user.user_metadata?.['nom'] || '',
        metier: user.user_metadata?.['metier'] || '',
        email: user.email || '',
        siret: user.user_metadata?.['siret'] || '',
        telephone: user.user_metadata?.['telephone'] || '',
        adresse: user.user_metadata?.['adresse'] || '',
        taux_horaire: user.user_metadata?.['taux_horaire'] || '',
        tva: user.user_metadata?.['tva'] || '20',
        acompte: user.user_metadata?.['acompte'] || '30',
        delai_validite: user.user_metadata?.['delai_validite'] || '30',
        mentions_legales: user.user_metadata?.['mentions_legales'] || '',
      }))
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    await supabase.auth.updateUser({ data: form })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <a href="/dashboard" className="text-blue-600 font-bold text-xl">FaireDesDevis</a>
        <a href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← Dashboard</a>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon profil</h1>
        <p className="text-gray-500 text-sm mb-8">Ces informations apparaîtront sur tous vos devis</p>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-6">
            ✓ Profil sauvegardé avec succès !
          </div>
        )}

        {/* Informations personnelles */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Informations personnelles</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nom / Société</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Jean-Pierre Moreau" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Métier</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" value={form.metier} onChange={e => set('metier', e.target.value)} placeholder="Plombier chauffagiste" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">SIRET</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" value={form.siret} onChange={e => set('siret', e.target.value)} placeholder="123 456 789 00012" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Téléphone</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="06 12 34 56 78" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Adresse</label>
              <input className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" value={form.adresse} onChange={e => set('adresse', e.target.value)} placeholder="12 rue des Artisans, 67000 Strasbourg" />
            </div>
          </div>
        </div>

        {/* Paramètres devis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Paramètres des devis</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Taux horaire (€/h)</label>
                <input type="number" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" value={form.taux_horaire} onChange={e => set('taux_horaire', e.target.value)} placeholder="65" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">TVA appliquée (%)</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" value={form.tva} onChange={e => set('tva', e.target.value)}>
                  <option value="20">20% — Taux normal</option>
                  <option value="10">10% — Travaux</option>
                  <option value="5.5">5,5% — Rénovation</option>
                  <option value="0">0% — Exonéré</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Acompte demandé (%)</label>
                <input type="number" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" value={form.acompte} onChange={e => set('acompte', e.target.value)} placeholder="30" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Validité du devis (jours)</label>
                <input type="number" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" value={form.delai_validite} onChange={e => set('delai_validite', e.target.value)} placeholder="30" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Mentions légales</label>
              <textarea className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 h-24 resize-none" value={form.mentions_legales} onChange={e => set('mentions_legales', e.target.value)} placeholder="Garantie décennale n°... Assurance..." />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
          {saving ? 'Sauvegarde...' : 'Sauvegarder mon profil →'}
        </button>
      </div>
    </main>
  )
}