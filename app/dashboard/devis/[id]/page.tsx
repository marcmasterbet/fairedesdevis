'use client'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { supabase } from '../../../../lib/supabase'
import { useRouter } from 'next/navigation'

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
    if (!devis.client_email) { alert('Pas email'); return }
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

  if (loading) return <main className="min-h-screen bg-gray-100 flex items-center justify-center"><p className="text-gray-400">Chargement...</p></main>
  if (!devis) return <main className="min-h-screen bg-gray-100 flex items-center justify-center"><p className="text-gray-400">Introuvable</p></main>

  return (
    <div style={{backgroundColor:'#f1f5f9',minHeight:'100vh'}}>
      <div className="print:hidden bg-white border-b px-4 py-3">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <a href="/dashboard" className="text-sm text-gray-500">Dashboard</a>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">{devis.statut}</span>
            <a href={'/dashboard/devis/' + id + '/modifier'} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold">Modifier</a>
            <button onClick={handleSauvegarder} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold">Sauvegarder</button>
            <button onClick={handleEnvoyer} disabled={sending} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">{sending ? 'Envoi...' : sent ? 'Envoye' : 'Envoyer'}</button>
            <button onClick={() => window.print()} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold">PDF</button>
          </div>
        </div>
      </div>
      {sent && <div className="max-w-3xl mx-auto mt-4 px-4"><div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">Envoye a {devis.client_email}</div></div>}
      <div className="max-w-3xl mx-auto my-6 bg-white shadow-sm rounded-xl overflow-hidden">
        <div style={{padding:'48px'}} dangerouslySetInnerHTML={{__html:devis.contenu}} />
      </div>
      {(devis.statut === 'accepte' || devis.statut === 'accepté') && devis.signe_par && (
        <div className="max-w-3xl mx-auto mt-4 px-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Devis accepte par {devis.signe_par}
          </div>
        </div>
      )}
      <div style={{height:'80px'}} />
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden flex justify-around py-3 px-4">
        <a href="/dashboard" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">🏠</span><span className="text-xs">Accueil</span></a>
        <a href="/dashboard/devis/nouveau" className="flex flex-col items-center gap-1 text-blue-600"><span className="text-xl">✏️</span><span className="text-xs">Devis</span></a>
        <a href="/dashboard/clients" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">👥</span><span className="text-xs">Clients</span></a>
        <a href="/dashboard/catalogue" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">📦</span><span className="text-xs">Catalogue</span></a>
        <a href="/dashboard/profil" className="flex flex-col items-center gap-1 text-gray-400"><span className="text-xl">⚙️</span><span className="text-xs">Profil</span></a>
      </div>
    </div>
  )
}