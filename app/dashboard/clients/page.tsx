'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

interface Client {
  id: string
  nom: string
  email: string
  telephone: string
  adresse: string
  siret: string
  created_at: string
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', adresse: '', siret: '' })
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
      setClients(data || [])
      setLoading(false)
    }
    init()
  }, [router])

  const handleSave = async () => {
    if (!form.nom || !form.email) { alert('Nom et email obligatoires'); return }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('clients').insert({ ...form, user_id: user?.id }).select()
    if (data) setClients(c => [data[0], ...c])
    setForm({ nom: '', email: '', telephone: '', adresse: '', siret: '' })
    setShowForm(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce client ?')) return
    await supabase.from('clients').delete().eq('id', id)
    setClients(c => c.filter(cl => cl.id !== id))
  }

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const filtered = clients.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

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
            <h1 className="text-2xl font-bold text-gray-900">Mes clients</h1>
            <p className="text-gray-500 text-sm mt-1">{clients.length} client{clients.length > 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
            + Nouveau client
          </button>
        </div>

        {/* Formulaire ajout */}
        {showForm && (
          <div className="bg-white rounded-xl border border-blue-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Nouveau client</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Nom / Société *</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="M. Dupont" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Email *</label>
                  <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.email} onChange={e => set('email', e.target.value)} placeholder="dupont@email.fr" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Téléphone</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="06 12 34 56 78" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">SIRET (si entreprise)</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.siret} onChange={e => set('siret', e.target.value)} placeholder="123 456 789 00012" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Adresse</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.adresse} onChange={e => set('adresse', e.target.value)} placeholder="12 rue des Roses, 67000 Strasbourg" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {saving ? 'Sauvegarde...' : 'Ajouter le client'}
                </button>
                <button onClick={() => setShowForm(false)} className="text-gray-400 text-sm hover:text-gray-600 px-4">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recherche */}
        {clients.length > 0 && (
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-4"
            placeholder="Rechercher un client..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        )}

        {/* Liste clients */}
        {filtered.length === 0 && !showForm ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-gray-500 text-sm">Aucun client pour le moment</p>
            <button onClick={() => setShowForm(true)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
              Ajouter mon premier client →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(client => (
              <div key={client.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{client.nom}</p>
                  <p className="text-sm text-gray-500">{client.email} {client.telephone && `· ${client.telephone}`}</p>
                  {client.adresse && <p className="text-xs text-gray-400 mt-1">{client.adresse}</p>}
                </div>
                <div className="flex gap-2">
                  <a href={`/dashboard/devis/nouveau?client=${client.id}`} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100">
                    Devis
                  </a>
                  <button onClick={() => handleDelete(client.id)} className="text-xs text-red-400 hover:text-red-600 px-2">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}