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
  client_adresse: string
  client_siret: string
  description: string
  montant_ht: number
  tva: number
  montant_ttc: number
  statut: string
  contenu: string
  created_at: string
}

export default function DevisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [devis, setDevis] = useState<Devis | null>(null)
  const [loading, setLoading] = useState(true)
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

      {/* Barre actions — cachée à l'impression */}
      <div className="print:hidden" style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <a href="/dashboard" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>
          ← Retour au dashboard
        </a>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{
            fontSize: '12px',
            padding: '4px 10px',
            borderRadius: '20px',
            backgroundColor: '#f1f5f9',
            color: '#64748b'
          }}>
            {devis.statut}
          </span>
          <a href="/dashboard/devis/nouveau" style={{
            fontSize: '14px',
            color: '#2563eb',
            textDecoration: 'none'
          }}>
            + Nouveau devis
          </a>
          <button
            onClick={() => window.print()}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Imprimer / PDF
          </button>
        </div>
      </div>

      {/* Document */}
      <div style={{
        maxWidth: '800px',
        margin: '32px auto',
        backgroundColor: 'white',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
        className="print:shadow-none print:rounded-none print:my-0 print:max-w-none"
      >
        <div
          style={{ padding: '48px' }}
          dangerouslySetInnerHTML={{ __html: devis.contenu }}
        />
      </div>

      <div style={{ height: '48px' }} className="print:hidden" />
    </div>
  )
}