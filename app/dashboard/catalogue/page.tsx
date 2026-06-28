'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

interface Produit {
  id: string
  nom: string
  reference: string
  categorie: string
  prix_ht: number
  unite: string
  created_at: string
}

export default function Catalogue() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ nom: '', reference: '', categorie: '', prix_ht: '', unite: 'unité' })
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('produits').select('*').order('categorie')
      setProduits(data || [])
      setLoading(false)
    }
    init()
  }, [router])

  const handleSave = async () => {
    if (!form.nom || !form.prix_ht) { alert('Nom et prix obligatoires'); return }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('produits').insert({
      ...form,
      prix_ht: parseFloat(form.prix_ht),
      user_id: user?.id
    }).select()
    if (data) setProduits(p => [...p, data[0]].sort((a,b) => a.categorie.localeCompare(b.categorie)))
    setForm({ nom: '', reference: '', categorie: '', prix_ht: '', unite: 'unité' })
    setShowForm(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    await supabase.from('produits').delete().eq('id', id)
    setProduits(p => p.filter(pr => pr.id !== id))
  }

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const filtered = produits.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.categorie?.toLowerCase().includes(search.toLowerCase()) ||
    p.reference?.toLowerCase().includes(search.toLowerCase())
  )

  const categories = [...new Set(filtered.map(p => p.categorie || 'Autre'))]

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

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mon catalogue</h1>
            <p className="text-gray-500 text-sm mt-1">{produits.length} produit{produits.length > 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
            + Ajouter
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-xl border border-blue-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Nouveau produit / prestation</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Nom *</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Pompe Samsung Eco 1.5cv" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Référence</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.reference} onChange={e => set('reference', e.target.value)} placeholder="SAM-PUMP-15" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Catégorie</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.categorie} onChange={e => set('categorie', e.target.value)} placeholder="Filtration" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Prix HT (€) *</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.prix_ht} onChange={e => set('prix_ht', e.target.value)} placeholder="380" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Unité</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.unite} onChange={e => set('unite', e.target.value)}>
                    <option>unité</option>
                    <option>forfait</option>
                    <option>heure</option>
                    <option>jour</option>
                    <option>m²</option>
                    <option>ml</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {saving ? 'Sauvegarde...' : 'Ajouter au catalogue'}
                </button>
                <button onClick={() => setShowForm(false)} className="text-gray-400 text-sm hover:text-gray-600 px-4">Annuler</button>
              </div>
            </div>
          </div>
        )}

        {/* Recherche */}
        {produits.length > 0 && (
          <input className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-4" placeholder="Rechercher un produit..." value={search} onChange={e => setSearch(e.target.value)} />
        )}

        {/* Liste par catégorie */}
        {filtered.length === 0 && !showForm ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-gray-500 text-sm">Aucun produit dans votre catalogue</p>
            <button onClick={() => setShowForm(true)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
              Ajouter mon premier produit →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{cat}</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {filtered.filter(p => (p.categorie || 'Autre') === cat).map(produit => (
                    <div key={produit.id} className="px-4 py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{produit.nom}</p>
                        {produit.reference && <p className="text-xs text-gray-400">{produit.reference}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900 text-sm">{produit.prix_ht} € <span className="text-gray-400 font-normal">/ {produit.unite}</span></span>
                        <button onClick={() => handleDelete(produit.id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}