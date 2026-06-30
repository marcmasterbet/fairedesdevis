'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

interface Client {
  id: string
  nom: string
  email: string
  telephone: string
  telephone_fixe: string
  adresse: string
  code_postal: string
  ville: string
  pays: string
  siret: string
  created_at: string
}

const emptyForm = {
  nom: '', email: '', telephone: '', telephone_fixe: '',
  adresse: '', code_postal: '', ville: '', pays: 'France', siret: ''
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
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
    setForm(emptyForm)
    setShowForm(false)
    setSaving(false)
  }

  const handleUpdate = async () => {
    if (!editingClient) return
    if (!editingClient.nom || !editingClient.email) { alert('Nom et email obligatoires'); return }
    setSaving(true)
    const { data } = await supabase.from('clients').update({
      nom: editingClient.nom,
      email: editingClient.email,
      telephone: editingClient.telephone,
      telephone_fixe: editingClient.telephone_fixe,
      adresse: editingClient.adresse,
      code_postal: editingClient.code_postal,
      ville: editingClient.ville,
      pays: editingClient.pays,
      siret: editingClient.siret,
    }).eq('id', editingClient.id).select()
    if (data) {
      setClients(c => c.map(cl => cl.id === editingClient.id ? data[0] : cl))
      setSelectedClient(data[0])
    }
    setEditingClient(null)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce client ?')) return
    await supabase.from('clients').delete().eq('id', id)
    setClients(c => c.filter(cl => cl.id !== id))
    setSelectedClient(null)
  }

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))
  const setEdit = (key: string, val: string) => setEditingClient(e => e ? { ...e, [key]: val } : e)

  const filtered = clients.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.ville?.toLowerCase().includes(search.toLowerCase())
  )

  const NavBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden flex justify-around py-3 px-4">
      <a href="/dashboard" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">🏠</span><span className="text-xs">Accueil</span></a>
      <a href="/dashboard/devis/nouveau" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">✏️</span><span className="text-xs">Devis</span></a>
      <a href="/dashboard/clients" className="flex flex-col items-center gap-1 text-blue-600"><span className="text-xl">👥</span><span className="text-xs">Clients</span></a>
      <a href="/dashboard/catalogue" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">📦</span><span className="text-xs">Catalogue</span></a>
      <a href="/dashboard/profil" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">⚙️</span><span className="text-xs">Profil</span></a>
    </div>
  )

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  if (selectedClient) {
    const c = editingClient || selectedClient
    const editing = !!editingClient
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <a href="/dashboard" className="text-blue-600 font-bold text-xl">FaireDesDevis</a>
          <button onClick={() => { setSelectedClient(null); setEditingClient(null) }} className="text-sm text-gray-400 hover:text-gray-600">
            ← Retour clients
          </button>
        </header>
        <div className="max-w-2xl mx-auto px-6 py-8 pb-24">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedClient.nom}</h1>
              <p className="text-gray-500 text-sm mt-1">Fiche client</p>
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <>
                  <button onClick={() => setEditingClient(selectedClient)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(selectedClient.id)} className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100">
                    Supprimer
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleUpdate} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                  <button onClick={() => setEditingClient(null)} className="text-gray-400 text-sm px-4 py-2 hover:text-gray-600">
                    Annuler
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <h2 className="font-semibold text-gray-900 mb-4">Coordonnées</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Nom / Société</label>
                  {editing
                    ? <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={c.nom} onChange={e => setEdit('nom', e.target.value)} />
                    : <p className="text-sm font-medium text-gray-900">{c.nom}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Email</label>
                  {editing
                    ? <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={c.email} onChange={e => setEdit('email', e.target.value)} />
                    : <p className="text-sm text-gray-700">{c.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Téléphone mobile</label>
                  {editing
                    ? <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={c.telephone || ''} onChange={e => setEdit('telephone', e.target.value)} placeholder="06 12 34 56 78" />
                    : <p className="text-sm text-gray-700">{c.telephone || '—'}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Téléphone fixe</label>
                  {editing
                    ? <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={c.telephone_fixe || ''} onChange={e => setEdit('telephone_fixe', e.target.value)} placeholder="03 88 12 34 56" />
                    : <p className="text-sm text-gray-700">{c.telephone_fixe || '—'}</p>}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Adresse</label>
                {editing
                  ? <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={c.adresse || ''} onChange={e => setEdit('adresse', e.target.value)} />
                  : <p className="text-sm text-gray-700">{c.adresse || '—'}</p>}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Code postal</label>
                  {editing
                    ? <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={c.code_postal || ''} onChange={e => setEdit('code_postal', e.target.value)} />
                    : <p className="text-sm text-gray-700">{c.code_postal || '—'}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Ville</label>
                  {editing
                    ? <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={c.ville || ''} onChange={e => setEdit('ville', e.target.value)} />
                    : <p className="text-sm text-gray-700">{c.ville || '—'}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Pays</label>
                  {editing
                    ? <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={c.pays || ''} onChange={e => setEdit('pays', e.target.value)} />
                    : <p className="text-sm text-gray-700">{c.pays || '—'}</p>}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">SIRET</label>
                {editing
                  ? <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={c.siret || ''} onChange={e => setEdit('siret', e.target.value)} placeholder="123 456 789 00012" />
                  : <p className="text-sm text-gray-700">{c.siret || '—'}</p>}
              </div>
            </div>
          </div>
          {!editing && (
            <a href={`/dashboard/devis/nouveau?client=${selectedClient.id}`} className="block text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
              Créer un devis pour ce client →
            </a>
          )}
        </div>
        <NavBar />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <a href="/dashboard" className="text-blue-600 font-bold text-xl">FaireDesDevis</a>
        <a href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← Dashboard</a>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-8 pb-24">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes clients</h1>
            <p className="text-gray-500 text-sm mt-1">{clients.length} client{clients.length > 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
            + Nouveau client
          </button>
        </div>
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
                  <label className="text-xs text-gray-500 mb-1 block">Téléphone mobile</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="06 12 34 56 78" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Téléphone fixe</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.telephone_fixe} onChange={e => set('telephone_fixe', e.target.value)} placeholder="03 88 12 34 56" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Adresse</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.adresse} onChange={e => set('adresse', e.target.value)} placeholder="12 rue des Roses" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Code postal</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.code_postal} onChange={e => set('code_postal', e.target.value)} placeholder="67000" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Ville</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.ville} onChange={e => set('ville', e.target.value)} placeholder="Strasbourg" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Pays</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.pays} onChange={e => set('pays', e.target.value)} placeholder="France" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">SIRET (si entreprise)</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.siret} onChange={e => set('siret', e.target.value)} placeholder="123 456 789 00012" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {saving ? 'Sauvegarde...' : 'Ajouter le client'}
                </button>
                <button onClick={() => setShowForm(false)} className="text-gray-400 text-sm hover:text-gray-600 px-4">Annuler</button>
              </div>
            </div>
          </div>
        )}
        {clients.length > 0 && (
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-4"
            placeholder="Rechercher un client..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        )}
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
              <div
                key={client.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-start hover:border-blue-200 transition cursor-pointer"
                onClick={() => setSelectedClient(client)}
              >
                <div>
                  <p className="font-semibold text-gray-900">{client.nom}</p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                  <p className="text-sm text-gray-500">
                    {client.telephone && `📱 ${client.telephone}`}
                    {client.telephone && client.telephone_fixe && ' · '}
                    {client.telephone_fixe && `☎️ ${client.telephone_fixe}`}
                  </p>
                  {client.ville && (
                    <p className="text-xs text-gray-400 mt-1">
                      {client.adresse && `${client.adresse}, `}{client.code_postal} {client.ville}{client.pays && ` · ${client.pays}`}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => { setSelectedClient(client); setEditingClient(client) }}
                    className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-xs text-red-400 hover:text-red-600 px-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <NavBar />
    </main>
  )
}