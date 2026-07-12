'use client'
import { useEffect, useState, Suspense } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import NavBar from '../../components/NavBar'
import Header from '../../components/Header'

interface Devis {
  id: string
  numero: string
  client_nom: string
  montant_ttc: number
  statut: string
  created_at: string
  archive: boolean
}

const STATUTS = [
  { id: 'tous', label: 'Tous' },
  { id: 'brouillon', label: 'Brouillons' },
  { id: 'envoye', label: 'Envoyes' },
  { id: 'accepte', label: 'Acceptes' },
  { id: 'refuse', label: 'Refuses' },
  { id: 'archive', label: 'Archives' },
]

const PAGE_SIZE = 20

function MesDevisContent() {
  const [devis, setDevis] = useState<Devis[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtre, setFiltre] = useState('tous')
  const [tri, setTri] = useState('date')
  const [page, setPage] = useState(1)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const statut = searchParams.get('statut')
    if (statut) setFiltre(statut)
  }, [searchParams])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('devis').select('*').order('created_at', { ascending: false })
      setDevis(data || [])
      setLoading(false)
    }
    init()
  }, [router])

  const handleSupprimer = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm('Supprimer ce devis ?')) return
    await supabase.from('devis').delete().eq('id', id)
    setDevis(d => d.filter(dv => dv.id !== id))
  }

  const handleArchiver = async (e: React.MouseEvent, id: string, archive: boolean) => {
    e.stopPropagation()
    await supabase.from('devis').update({ archive: !archive }).eq('id', id)
    setDevis(d => d.map(dv => dv.id === id ? { ...dv, archive: !archive } : dv))
  }

  const getStatutStyle = (s: string) => {
    if (s === 'accepte') return 'bg-green-100 text-green-700'
    if (s === 'refuse') return 'bg-red-100 text-red-700'
    if (s === 'envoye') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-600'
  }

  const setFiltreReset = (f: string) => { setFiltre(f); setPage(1) }
  const setSearchReset = (s: string) => { setSearch(s); setPage(1) }

  let filtered = devis.filter(d => {
    if (filtre === 'tous') return !d.archive
    if (filtre === 'archive') return d.archive
    return d.statut === filtre && !d.archive
  })

  if (search) {
    filtered = filtered.filter(d =>
      d.numero.toLowerCase().includes(search.toLowerCase()) ||
      d.client_nom?.toLowerCase().includes(search.toLowerCase())
    )
  }

  filtered = [...filtered].sort((a, b) => {
    if (tri === 'montant') return Number(b.montant_ttc) - Number(a.montant_ttc)
    if (tri === 'client') return (a.client_nom || '').localeCompare(b.client_nom || '')
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
          <a href="/dashboard/devis/nouveau" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
            + Nouveau
          </a>
        }
      />

      <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900">Mes devis</h1>
          <p className="text-sm text-gray-400">{filtered.length} devis</p>
        </div>

        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-4"
          placeholder="Rechercher par numero, client..."
          value={search}
          onChange={e => setSearchReset(e.target.value)}
        />

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {STATUTS.map(s => (
            <button
              key={s.id}
              onClick={() => setFiltreReset(s.id)}
              className={'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ' + (filtre === s.id ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300')}
            >
              {s.label}
              <span className="ml-1 opacity-60">
                {s.id === 'tous' ? devis.filter(d => !d.archive).length :
                 s.id === 'archive' ? devis.filter(d => d.archive).length :
                 devis.filter(d => d.statut === s.id && !d.archive).length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-4 items-center">
          <span className="text-xs text-gray-400">Trier :</span>
          {[{ id: 'date', label: 'Date' }, { id: 'montant', label: 'Montant' }, { id: 'client', label: 'Client' }].map(t => (
            <button
              key={t.id}
              onClick={() => setTri(t.id)}
              className={'px-3 py-1 rounded-lg text-xs font-medium transition ' + (tri === t.id ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {paginated.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">📄</p>
            <p className="text-gray-500 text-sm">Aucun devis trouve</p>
            <a href="/dashboard/devis/nouveau" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
              Creer un devis
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {paginated.map(d => (
              <div
                key={d.id}
                onClick={() => router.push('/dashboard/devis/' + d.id)}
                className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center hover:border-blue-200 hover:bg-blue-50 transition cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{d.numero}</p>
                  <p className="text-sm text-gray-500 truncate">{d.client_nom}</p>
                  <p className="text-xs text-gray-400">{new Date(d.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <p className="font-semibold text-gray-900 hidden sm:block text-sm">{Number(d.montant_ttc).toFixed(2)} EUR</p>
                  <span className={'px-2 py-1 rounded-full text-xs font-medium ' + getStatutStyle(d.statut)}>
                    {d.statut}
                  </span>
                  <button onClick={e => handleArchiver(e, d.id, d.archive)} className="text-gray-400 hover:text-gray-600 px-1" title={d.archive ? 'Desarchiver' : 'Archiver'}>
                    {d.archive ? '📤' : '📁'}
                  </button>
                  <button onClick={e => handleSupprimer(e, d.id)} className="text-red-400 hover:text-red-600 px-1" title="Supprimer">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40">
              Precedent
            </button>
            <span className="text-sm text-gray-500">Page {page} sur {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40">
              Suivant
            </button>
          </div>
        )}
      </div>

      <NavBar active="devis" />
    </main>
  )
}

export default function MesDevis() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400">Chargement...</p></main>}>
      <MesDevisContent />
    </Suspense>
  )
}