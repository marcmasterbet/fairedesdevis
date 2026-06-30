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
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
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
      const logo = user.user_metadata?.['logo_url'] || ''
      setLogoUrl(logo)
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    await supabase.auth.updateUser({ data: { ...form, logo_url: logoUrl } })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (file.size > 2 * 1024 * 1024) { alert('Logo trop lourd — max 2 Mo'); return }
    setUploadingLogo(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}/logo.${ext}`
    const { error } = await supabase.storage.from('logos').upload(path, file, { upsert: true })
    if (error) { alert('Erreur upload logo'); setUploadingLogo(false); return }
    const { data } = supabase.storage.from('logos').getPublicUrl(path)
    const url = data.publicUrl + '?t=' + Date.now()
    setLogoUrl(url)
    await supabase.auth.updateUser({ data: { ...form, logo_url: url } })
    setUploadingLogo(false)
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

      <div className="max-w-2xl mx-auto px-6 py-8 pb-24">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon profil</h1>
        <p className="text-gray-500 text-sm mb-8">Ces informations apparaîtront sur tous vos devis</p>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-6">
            ✓ Profil sauvegardé avec succès !
          </div>
        )}

        {/* Logo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Logo de l&apos;entreprise</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
              {logoUrl
                ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                : <span className="text-gray-300 text-3xl">🏢</span>
              }
            </div>
            <div>
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 inline-block">
                {uploadingLogo ? 'Upload...' : logoUrl ? 'Changer le logo' : 'Ajouter un logo'}
                <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
              </label>
              <p className="text-xs text-gray-400 mt-2">PNG ou JPG — max 2 Mo</p>
              {logoUrl && (
                <button onClick={() => { setLogoUrl(''); supabase.auth.updateUser({ data: { ...form, logo_url: '' } }) }} className="text-xs text-red-400 hover:text-red-600 mt-1 block">
                  Supprimer le logo
                </button>
              )}
            </div>
          </div>
        </div>

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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden flex justify-around py-3 px-4">
        <a href="/dashboard" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">🏠</span><span className="text-xs">Accueil</span></a>
        <a href="/dashboard/devis/nouveau" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">✏️</span><span className="text-xs">Devis</span></a>
        <a href="/dashboard/clients" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">👥</span><span className="text-xs">Clients</span></a>
        <a href="/dashboard/catalogue" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">📦</span><span className="text-xs">Catalogue</span></a>
        <a href="/dashboard/profil" className="flex flex-col items-center gap-1 text-blue-600"><span className="text-xl">⚙️</span><span className="text-xs">Profil</span></a>
      </div>
    </main>
  )
}