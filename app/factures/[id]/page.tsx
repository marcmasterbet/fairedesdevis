'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { supabase } from '../../../lib/supabase'

interface Facture {
  id: string
  numero: string
  client_nom: string
  client_email: string
  montant_ht: number
  tva: number
  montant_ttc: number
  statut: string
  date_echeance: string | null
  date_paiement: string | null
  contenu: string
  created_at: string
}

export default function VoirFacture({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [facture, setFacture] = useState<Facture | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase
        .from('factures')
        .select('*')
        .eq('id', id)
        .single()

      setFacture(data)
      setLoading(false)
    }

    init()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">
          Chargement de la facture...
        </p>
      </main>
    )
  }

  if (!facture) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">
          Facture introuvable
        </p>
      </main>
    )
  }

  const statutColor =
    facture.statut === 'payee'
      ? 'bg-green-100 text-green-700'
      : facture.statut === 'en_retard'
      ? 'bg-red-100 text-red-700'
      : 'bg-amber-100 text-amber-700'

  const statutLabel =
    facture.statut === 'payee'
      ? 'Payée'
      : facture.statut === 'en_retard'
      ? 'En retard'
      : 'En attente'

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="bg-white border-b px-6 py-4 flex justify-between items-center print:hidden">

        <span className="text-blue-600 font-bold text-xl">
          FaireDesDevis
        </span>

        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
        >
          Télécharger PDF
        </button>

      </div>

      <div className="max-w-3xl mx-auto mt-6 px-4 print:hidden">

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-center">

          <div>
            <p className="text-sm text-gray-500">
              Facture
            </p>

            <h1 className="text-2xl font-bold">
              {facture.numero}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Client : {facture.client_nom}
            </p>

            <p className="text-sm text-gray-500">
              {facture.client_email}
            </p>
          </div>

          <span
            className={
              'px-3 py-1 rounded-full text-xs font-medium ' +
              statutColor
            }
          >
            {statutLabel}
          </span>

        </div>

      </div>

      {facture.date_echeance && (
        <div className="max-w-3xl mx-auto mt-4 px-4 print:hidden">

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">

            Échéance :
            {' '}
            {new Date(
              facture.date_echeance
            ).toLocaleDateString('fr-FR')}

          </div>

        </div>
      )}

      {facture.date_paiement && (
        <div className="max-w-3xl mx-auto mt-4 px-4 print:hidden">

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">

            ✅ Payée le{' '}
            {new Date(
              facture.date_paiement
            ).toLocaleDateString('fr-FR')}

          </div>

        </div>
      )}

      <div className="max-w-3xl mx-auto my-6 bg-white rounded-xl shadow-sm overflow-hidden">

        <div
          className="p-8"
          dangerouslySetInnerHTML={{
            __html: facture.contenu,
          }}
        />

      </div>

      <div className="max-w-3xl mx-auto px-4 pb-8 print:hidden">

        <div className="bg-white rounded-xl border border-gray-200 p-6">

          <div className="flex justify-between py-2">
            <span>Montant HT</span>
            <strong>
              {Number(facture.montant_ht).toFixed(2)} €
            </strong>
          </div>

          <div className="flex justify-between py-2">
            <span>TVA</span>
            <strong>
              {Number(facture.tva).toFixed(2)} €
            </strong>
          </div>

          <div className="flex justify-between border-t pt-4 mt-2 text-lg font-bold">
            <span>Total TTC</span>
            <span className="text-blue-600">
              {Number(facture.montant_ttc).toFixed(2)} €
            </span>
          </div>

        </div>

      </div>

    </main>
  )
}