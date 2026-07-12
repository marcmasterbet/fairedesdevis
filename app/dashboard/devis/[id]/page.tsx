'use client'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { supabase } from '../../../../lib/supabase'
import { useRouter } from 'next/navigation'
import NavBar from '../../../components/NavBar'

interface Devis {
  id: string
  numero: string
  client_nom: string
  client_email: string
  montant_ttc: number
  statut: string
  contenu: string
  signe_par: string
  signe_le: string
}

export default function DevisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [devis, setDevis] = useState<Devis | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('devis').select('*').eq('id', id).single()
      setDevis(data)
      setLoading(false)
    }
    init()
  }, [id, router])

  const handleEnvoyer = async () => {
    if (!devis) return
    if (!devis.client_email) { alert('Pas email client'); return }
    setSending(true)
    const { data: { user } } = await supabase.auth.getUser()
    const lien = 'https://fairedesdevis.fr/signer/' + id
    const res = await fetch('/api/envoyer-devis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        devisId: id,
        clientEmail: devis.client_email,
        clientNom: devis.client_nom,
        prestataireNom: user?.user_metadata?.['nom'] || '',
        numero: devis.numero,
        montantTTC: Number(devis.montant_ttc).toFixed(2),
        lienSignature: lien
      })
    })
    if (res.ok) {
      await supabase.from('devis').update({ statut: 'envoye', lien_signature: lien }).eq('id', id)
      setDevis(d => d ? { ...d, statut: 'envoye' } : d)
      setSent(true)
    } else {
      alert('Erreur envoi')
    }
    setSending(false)
  }

  const handleSauvegarder = async () => {
    await supabase.from('devis').update({ statut: 'brouillon' }).eq('id', id)
    setDevis(d => d ? { ...d, statut: 'brouillon' } : d)
    alert('Sauvegarde OK')
  }

  const handleSupprimer = async () => {
    if (!confirm('Supprimer ce devis definitivement ?')) return
    await supabase.from('devis').delete().eq('id', id)
    router.push('/dashboard/devis')
  }

  const getStatutColor = (s: string) => {
    if (s === 'accepte') return 'bg-green-100 text-green-700'
    if (s === 'refuse') return 'bg-red-100 text-red-700'
    if (s === 'envoye') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-600'
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  if (!devis) return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-400">Devis introuvable</p>
    </main>
  )

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>

      <div className="print:hidden bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <a href="/dashboard/devis" className="text-sm text-gray-500 hover:text-gray-700">← Mes devis</a>
          <div className="flex flex-wrap gap-2 items-center">
            <span className={'px-3 py-1 rounded-full text-xs font-medium ' + getStatutColor(devis.statut)}>
              {devis.statut}
            </span>
            <a href={'/dashboard/devis/' + id + '/modifier'} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">
              Modifier
            </a>
            <button onClick={handleSauvegarder} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">
              Sauvegarder
            </button>
            <button onClick={handleEnvoyer} disabled={sending} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
              {sending ? 'Envoi...' : sent ? 'Envoye' : 'Envoyer'}
            </button>
            <button onClick={() => window.print()} className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800">
              PDF
            </button>
            <button onClick={handleSupprimer} className="text-red-400 hover:text-red-600 px-3 py-2 text-sm font-semibold">
              Supprimer
            </button>
          </div>
        </div>
      </div>

      {sent && (
        <div className="max-w-3xl mx-auto mt-4 px-4 print:hidden">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Envoye a {devis.client_email}
          </div>
        </div>
      )}

      {(devis.statut === 'accepte') && devis.signe_par && (
        <div className="max-w-3xl mx-auto mt-4 px-4 print:hidden">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Accepte par {devis.signe_par}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto my-6 bg-white shadow-sm rounded-xl overflow-hidden print:shadow-none print:my-0 print:max-w-none">
        <div style={{ padding: '48px' }} dangerouslySetInnerHTML={{ __html: devis.contenu }} />
      </div>

      <div style={{ height: '80px' }} className="print:hidden" />
      <NavBar active="devis" />
    </div>
  )
}