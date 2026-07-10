'use client'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { supabase } from '../../../../../lib/supabase'
import { useRouter } from 'next/navigation'

interface Devis {
  id: string
  numero: string
  contenu: string
}

export default function ModifierDevis({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [devis, setDevis] = useState<Devis | null>(null)
  const [contenu, setContenu] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('devis').select('*').eq('id', id).single()
      setDevis(data)
      setContenu(data?.contenu || '')
      setLoading(false)
    }
    init()
  }, [id, router])

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('devis').update({ contenu }).eq('id', id)
    setSaving(false)
    router.push('/dashboard/devis/' + id)
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  if (!devis) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Devis introuvable</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <a href="/dashboard" className="text-blue-600 font-bold text-xl">FaireDesDevis</a>
        <div className="flex gap-3 items-center">
          <a href={'/dashboard/devis/' + id} className="text-sm text-gray-400 hover:text-gray-600">Annuler</a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Modifier le devis {devis.numero}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Contenu HTML</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-4 text-xs font-mono focus:outline-none focus:border-blue-500 resize-none"
              style={{ height: '70vh' }}
              value={contenu}
              onChange={e => setContenu(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Apercu en direct</label>
            <div
              className="border border-gray-200 rounded-xl bg-white overflow-auto"
              style={{ height: '70vh', padding: '24px' }}
              dangerouslySetInnerHTML={{ __html: contenu }}
            />
          </div>
        </div>
      </div>
    </main>
  )
}