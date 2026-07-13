'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import NavBar from '../../components/NavBar'
import Header from '../../components/Header'

interface Produit {
  id: string
  nom: string
  reference: string
  categorie: string
  prix_ht: number
  unite: string
  created_at: string
}

interface ProduitImporte {
  nom: string
  reference: string
  categorie: string
  prix_ht: number
  unite: string
}

export default function Catalogue() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ nom: '', reference: '', categorie: '', prix_ht: '', unite: 'unite' })
  const [showImport, setShowImport] = useState(false)
  const [importing, setImporting] = useState(false)
  const [produitsImportes, setProduitsImportes] = useState<ProduitImporte[]>([])
  const [importEtape, setImportEtape] = useState<'upload' | 'apercu'>('upload')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('catalogue').select('*').order('categorie')
      setProduits(data || [])
      setLoading(false)
    }
    init()
  }, [router])

  const handleSave = async () => {
    if (!form.nom || !form.prix_ht) { alert('Nom et prix obligatoires'); return }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('catalogue').insert({
      ...form,
      prix_ht: parseFloat(form.prix_ht),
      user_id: user?.id
    }).select()
    if (data) setProduits(p => [...p, data[0]].sort((a, b) => (a.categorie || '').localeCompare(b.categorie || '')))
    setForm({ nom: '', reference: '', categorie: '', prix_ht: '', unite: 'unite' })
    setShowForm(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    await supabase.from('catalogue').delete().eq('id', id)
    setProduits(p => p.filter(pr => pr.id !== id))
  }

  const handleImportFichier = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      alert('Seuls les fichiers CSV et TXT sont acceptes. Exportez votre Excel en CSV depuis Excel.')
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Fichier trop volumineux (max 2Mo)')
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    setImporting(true)

    const reader = new FileReader()
    reader.onload = async (ev) => {
      const contenu = ev.target?.result as string

      if (!contenu || contenu.trim().length < 5) {
        alert('Le fichier semble vide')
        setImporting(false)
        return
      }

      try {
        const response = await fetch('/api/generer-devis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `Analyse ce fichier catalogue et extrais tous les produits/prestations.
Reponds UNIQUEMENT avec un tableau JSON valide, sans markdown, sans backticks, sans texte avant ou apres.
Format exact : [{"nom":"...","reference":"...","categorie":"...","prix_ht":0,"unite":"unite"}]
Regles :
- unite doit etre l un de : unite, forfait, heure, jour, m2, ml
- Si reference manque : reference=""
- Si categorie manque : categorie="Autre"
- Si unite manque : unite="unite"
- prix_ht doit etre un nombre decimal positif
- Ignore les lignes vides, titres, totaux
- Ne jamais inventer de produits absents du fichier

Contenu du fichier :
${contenu.slice(0, 8000)}`
          })
        })

        const data = await response.json()
        const texte = data.contenu.trim()
        const texteNettoye = texte.replace(/```json|```/g, '').trim()

        let produitsParsed: ProduitImporte[]
        try {
          produitsParsed = JSON.parse(texteNettoye)
        } catch {
          alert('L IA n a pas pu analyser ce fichier. Verifiez que le format est correct.')
          setImporting(false)
          return
        }

        const produitsValides = produitsParsed.filter(p =>
          p.nom && p.nom.trim().length > 0 &&
          typeof p.prix_ht === 'number' && p.prix_ht >= 0
        )

        if (produitsValides.length === 0) {
          alert('Aucun produit valide detecte. Verifiez que votre fichier contient des noms et des prix.')
          setImporting(false)
          return
        }

        setProduitsImportes(produitsValides)
        setImportEtape('apercu')
      } catch {
        alert('Erreur de connexion. Verifiez votre connexion internet et reessayez.')
      }
      setImporting(false)
    }

    reader.onerror = () => {
      alert('Impossible de lire le fichier.')
      setImporting(false)
    }

    reader.readAsText(file, 'UTF-8')
  }

  const handleConfirmerImport = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('catalogue').insert(
      produitsImportes.map(p => ({ ...p, user_id: user?.id }))
    ).select()
    if (data) {
      setProduits(p => [...p, ...data].sort((a, b) => (a.categorie || '').localeCompare(b.categorie || '')))
    }
    setShowImport(false)
    setImportEtape('upload')
    setProduitsImportes([])
    if (fileRef.current) fileRef.current.value = ''
    setSaving(false)
    alert(produitsImportes.length + ' produits importes avec succes !')
  }

  const fermerImport = () => {
    setShowImport(false)
    setImportEtape('upload')
    setProduitsImportes([])
    if (fileRef.current) fileRef.current.value = ''
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
      <Header
        back="/dashboard"
        backLabel="← Dashboard"
        action={
          <div className="flex gap-2">
            <button onClick={() => setShowImport(true)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">
              📂 Importer
            </button>
            <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
              + Ajouter
            </button>
          </div>
        }
      />

      {/* Modal Import */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Importer un catalogue</h2>
              <button onClick={fermerImport} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {importEtape === 'upload' && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Importez votre catalogue depuis un fichier CSV ou TXT.</p>
                <p className="text-xs text-amber-600 mb-4">Excel : Fichier → Enregistrer sous → CSV pour l ouvrir ici.</p>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                  onClick={() => !importing && fileRef.current?.click()}
                >
                  {importing ? (
                    <div>
                      <p className="text-2xl mb-2">⏳</p>
                      <p className="text-sm text-blue-600 font-medium">Analyse en cours...</p>
                      <p className="text-xs text-gray-400 mt-1">L IA extrait vos produits</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-3xl mb-2">📂</p>
                      <p className="text-sm font-medium text-gray-700">Cliquez pour choisir un fichier</p>
                      <p className="text-xs text-gray-400 mt-1">CSV et TXT uniquement — max 2Mo</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleImportFichier}
                />
              </div>
            )}

            {importEtape === 'apercu' && (
              <div>
                <p className="text-sm text-green-600 font-medium mb-3">✅ {produitsImportes.length} produits detectes</p>
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg mb-4">
                  {produitsImportes.map((p, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.nom}</p>
                        <p className="text-xs text-gray-400">{p.categorie}{p.reference ? ' · ' + p.reference : ''}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap ml-4">{p.prix_ht} EUR / {p.unite}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleConfirmerImport}
                    disabled={saving}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Import en cours...' : 'Confirmer l import'}
                  </button>
                  <button
                    onClick={() => { setImportEtape('upload'); setProduitsImportes([]); if (fileRef.current) fileRef.current.value = '' }}
                    className="px-4 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    Recommencer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-8 pb-24">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mon catalogue</h1>
            <p className="text-gray-500 text-sm mt-1">{produits.length} produit{produits.length > 1 ? 's' : ''}</p>
          </div>
        </div>

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
                  <label className="text-xs text-gray-500 mb-1 block">Reference</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.reference} onChange={e => set('reference', e.target.value)} placeholder="SAM-PUMP-15" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Categorie</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.categorie} onChange={e => set('categorie', e.target.value)} placeholder="Filtration" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Prix HT (EUR) *</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.prix_ht} onChange={e => set('prix_ht', e.target.value)} placeholder="380" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Unite</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.unite} onChange={e => set('unite', e.target.value)}>
                    <option value="unite">unite</option>
                    <option value="forfait">forfait</option>
                    <option value="heure">heure</option>
                    <option value="jour">jour</option>
                    <option value="m2">m2</option>
                    <option value="ml">ml</option>
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

        {produits.length > 0 && (
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-4"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        )}

        {filtered.length === 0 && !showForm ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-gray-500 text-sm">Aucun produit dans votre catalogue</p>
            <button onClick={() => setShowForm(true)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
              Ajouter mon premier produit
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
                        <span className="font-semibold text-gray-900 text-sm">{produit.prix_ht} EUR <span className="text-gray-400 font-normal">/ {produit.unite}</span></span>
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

      <NavBar active="catalogue" />
    </main>
  )
}