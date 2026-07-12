'use client'
import { useEffect, useState, useRef } from 'react'
import { use } from 'react'
import { supabase } from '../../../lib/supabase'
import SignatureCanvas from 'react-signature-canvas'

interface Devis {
  id: string
  numero: string
  client_nom: string
  client_email: string
  montant_ht: number
  tva: number
  montant_ttc: number
  statut: string
  contenu: string
  signe_par: string
  signe_le: string
  signature_image: string
}

export default function SignerDevis({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [devis, setDevis] = useState<Devis | null>(null)
  const [loading, setLoading] = useState(true)
  const [nom, setNom] = useState('')
  const [mentionBPA, setMentionBPA] = useState('')
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(false)
  const [refused, setRefused] = useState(false)
  const [step, setStep] = useState<'view' | 'sign' | 'refuse'>('view')
  const sigCanvas = useRef<SignatureCanvas>(null)

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.from('devis').select('*').eq('id', id).single()
      setDevis(data)
      if (data?.statut === 'accepte') setSigned(true)
      if (data?.statut === 'refuse') setRefused(true)
      setLoading(false)
    }
    init()
  }, [id])

  const handleSign = async () => {
    if (!mentionBPA.toLowerCase().includes('bon pour accord')) {
      alert('Vous devez ecrire "Bon pour accord" dans le premier champ')
      return
    }
    if (!nom.trim()) { alert('Veuillez entrer votre nom complet'); return }
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) { alert('Veuillez dessiner votre signature'); return }
    setSigning(true)

    const signatureImage = sigCanvas.current.toDataURL('image/png')
    const ip = await fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(d => d.ip)
      .catch(() => 'inconnue')

    await supabase.from('devis').update({
      statut: 'accepte',
      signe_par: mentionBPA + ' — ' + nom,
      signe_le: new Date().toISOString(),
      signature_image: signatureImage,
      signe_ip: ip
    }).eq('id', id)

    await fetch('/api/notifier-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ devisId: id, action: 'accepte', nom, devis })
    })

    setSigned(true)
    setSigning(false)
  }

  const handleRefuse = async () => {
    await supabase.from('devis').update({ statut: 'refuse' }).eq('id', id)
    await fetch('/api/notifier-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ devisId: id, action: 'refuse', nom: devis?.client_nom, devis })
    })
    setRefused(true)
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-400">Chargement du devis...</p>
    </main>
  )

  if (!devis) return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-400">Devis introuvable</p>
    </main>
  )

  if (signed) return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Devis accepte !</h2>
        <p className="text-gray-500 text-sm mb-4">Vous avez accepte le devis <strong>{devis.numero}</strong>.</p>
        <p className="text-gray-400 text-sm">Une copie vous a ete envoyee par email. Le prestataire a ete notifie.</p>
      </div>
    </main>
  )

  if (refused) return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Devis refuse</h2>
        <p className="text-gray-500 text-sm">Vous avez refuse le devis <strong>{devis.numero}</strong>. Le prestataire a ete notifie.</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <span className="text-blue-600 font-bold text-xl">FaireDesDevis</span>
        <span className="text-sm text-gray-500">{devis.numero}</span>
      </div>

      {step === 'view' && (
        <div>
          <div className="max-w-3xl mx-auto my-6 bg-white shadow-sm rounded-xl overflow-hidden">
            <div className="p-8" dangerouslySetInnerHTML={{ __html: devis.contenu }} />
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Que souhaitez-vous faire ?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Montant total : <strong className="text-blue-600">{Number(devis.montant_ttc).toFixed(2)} EUR TTC</strong>
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setStep('sign')}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Accepter et signer
                </button>
                <button
                  onClick={() => setStep('refuse')}
                  className="flex-1 bg-red-50 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-100"
                >
                  Refuser le devis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'sign' && (
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-1">Signer le devis</h3>
            <p className="text-xs text-gray-400 mb-4">Conformement a la loi, vous devez ecrire la mention "Bon pour accord" puis signer.</p>

            {/* Mention Bon pour accord */}
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-1 block font-medium">
                Mention obligatoire *
              </label>
              <input
                className={'w-full border rounded-lg px-4 py-3 text-sm focus:outline-none ' + (
                  mentionBPA.length === 0 ? 'border-gray-200 focus:border-blue-500' :
                  mentionBPA.toLowerCase().includes('bon pour accord') ? 'border-green-400 bg-green-50' :
                  'border-red-300 bg-red-50'
                )}
                placeholder='Ecrivez: Bon pour accord'
                value={mentionBPA}
                onChange={e => setMentionBPA(e.target.value)}
              />
              {mentionBPA.length > 0 && !mentionBPA.toLowerCase().includes('bon pour accord') && (
                <p className="text-xs text-red-500 mt-1">Vous devez ecrire "Bon pour accord"</p>
              )}
              {mentionBPA.toLowerCase().includes('bon pour accord') && (
                <p className="text-xs text-green-600 mt-1">Mention valide</p>
              )}
            </div>

            {/* Nom complet */}
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-1 block font-medium">
                Votre nom complet *
              </label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Jean Dupont"
                value={nom}
                onChange={e => setNom(e.target.value)}
              />
            </div>

            {/* Signature */}
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-2 block font-medium">Votre signature *</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg overflow-hidden bg-white">
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    width: 500,
                    height: 150,
                    className: 'w-full',
                    style: { touchAction: 'none' }
                  }}
                  backgroundColor="white"
                  penColor="#1e293b"
                />
              </div>
              <button
                onClick={() => sigCanvas.current?.clear()}
                className="text-xs text-gray-400 hover:text-gray-600 mt-1"
              >
                Effacer la signature
              </button>
            </div>

            {/* Info legale */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-700">
                En signant ce devis avec la mention "Bon pour accord", vous acceptez les conditions et le montant de <strong>{Number(devis.montant_ttc).toFixed(2)} EUR TTC</strong>. Cette signature electronique a valeur legale.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSign}
                disabled={signing || !mentionBPA.toLowerCase().includes('bon pour accord')}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {signing ? 'Signature en cours...' : 'Valider ma signature'}
              </button>
              <button
                onClick={() => setStep('view')}
                className="text-gray-400 px-4 hover:text-gray-600 text-sm"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'refuse' && (
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-4xl mb-4">🤔</p>
            <h3 className="font-semibold text-gray-900 mb-2">Confirmer le refus ?</h3>
            <p className="text-sm text-gray-500 mb-6">Le prestataire sera notifie de votre decision.</p>
            <div className="flex gap-3">
              <button
                onClick={handleRefuse}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600"
              >
                Confirmer le refus
              </button>
              <button
                onClick={() => setStep('view')}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-200"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}