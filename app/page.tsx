'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

const LOGO = 'https://xkwdwragibeingoaizwq.supabase.co/storage/v1/object/public/logos/ChatGPT%20Image%2026%20juil.%202026,%2016_39_11.png'

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const metadata = user.user_metadata ?? {}
        const isVIP = metadata.actif_manuellement === true
        const statutStripe = String(metadata.stripe_statut ?? '').toLowerCase()
        const abonnementActif = metadata.abonnement_actif === true || statutStripe === 'active' || statutStripe === 'actif'
        const joursDepuis = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))
        const essaiValide = joursDepuis <= 7
        if (isVIP || abonnementActif || essaiValide) router.push('/dashboard')
      }
    }
    check()
  }, [router])

  const faqs = [
    { q: "Est-ce vraiment gratuit les 7 premiers jours ?", a: "Oui, 7 jours complets pour tester toutes les fonctionnalités sans limitation. Aucun frais pendant 7 jours, aucun engagement, annulation en 1 clic avant la fin de l'essai." },
    { q: "Mes devis sont-ils vraiment professionnels ?", a: "Oui. L'IA génère des devis avec votre logo, votre signature, vos coordonnées bancaires, les conditions de paiement et les mentions légales." },
    { q: "La signature électronique a-t-elle une valeur légale ?", a: "Oui. La signature électronique avec mention 'Bon pour accord', horodatage et adresse IP a valeur légale en France conformément au règlement eIDAS." },
    { q: "Puis-je importer mon catalogue de produits ?", a: "Oui. Importez votre catalogue depuis un fichier CSV ou TXT. L'IA extrait automatiquement vos produits, références et prix." },
    { q: "Combien de devis puis-je créer ?", a: "Illimité. Le plan unique à 24,99€/mois vous donne accès à des devis illimités, une facturation illimitée et un catalogue illimité." },
    { q: "Puis-je transformer un devis en facture ?", a: "Oui en 1 clic. Une fois le devis accepté et signé par votre client, transformez-le en facture automatiquement." },
  ]

  const features = [
    { icon: "⚡", title: "Devis en 60 secondes", desc: "L'IA génère un devis complet avec toutes les mentions légales en moins d'une minute." },
    { icon: "✍️", title: "Signature électronique", desc: "Votre client signe en ligne depuis son téléphone. Valeur légale garantie, conforme eIDAS." },
    { icon: "🧾", title: "Facturation intégrée", desc: "Transformez un devis accepté en facture en 1 clic. Suivi des paiements en temps réel." },
    { icon: "📦", title: "Catalogue intelligent", desc: "Importez depuis Excel ou CSV. L'IA extrait vos produits et prix automatiquement." },
    { icon: "👥", title: "Carnet clients", desc: "Gérez vos clients et consultez l'historique de leurs devis en un coup d'œil." },
    { icon: "📱", title: "100% mobile", desc: "Créez vos devis depuis le chantier. Interface optimisée pour tous les écrans." },
  ]

  const temoignages = [
    { nom: 'Karim B.', metier: 'Plombier · Lyon', texte: 'Avant je passais 1h à faire mes devis sur Word. Maintenant c\'est 2 minutes. Mes clients signent le soir même depuis leur téléphone.' },
    { nom: 'Sophie M.', metier: 'Électricienne · Strasbourg', texte: 'La signature électronique m\'a convaincue. Plus besoin d\'imprimer, scanner, renvoyer. Le client signe en 30 secondes.' },
    { nom: 'Thierry D.', metier: 'Menuisier · Bordeaux', texte: 'J\'ai importé mon catalogue de 200 produits en 5 minutes. Je fais mes devis sur le chantier depuis mon téléphone.' },
  ]

  return (
    <main style={{ background: '#050510', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', minHeight: '100vh' }}>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .float { animation: float 6s ease-in-out infinite; }
        .glow-blue { box-shadow: 0 0 40px rgba(37, 99, 235, 0.3); }
        .glow-text { text-shadow: 0 0 40px rgba(99, 179, 237, 0.5); }
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .glass-blue { background: rgba(37, 99, 235, 0.1); backdrop-filter: blur(20px); border: 1px solid rgba(37, 99, 235, 0.3); }
        .gradient-text { background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-bg { background: radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.15) 0%, transparent 70%), radial-gradient(ellipse at 80% 50%, rgba(124,58,237,0.1) 0%, transparent 60%), #050510; }
        .card-hover { transition: transform 0.3s, border-color 0.3s; }
        .card-hover:hover { transform: translateY(-4px); border-color: rgba(37,99,235,0.5) !important; }
        @media (max-width: 768px) { .hero-title { font-size: 36px !important; } .hide-mobile { display: none !important; } .grid-mobile { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(5,5,16,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src={LOGO} alt="FaireDesDevis" style={{ height: 36, width: 'auto', filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>FaireDesDevis</span>
        </a>
        <div className="hide-mobile" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#comment-ca-marche" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Comment ça marche</a>
          <a href="#tarif" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Tarif</a>
          <a href="#faq" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>FAQ</a>
          <a href="/blog" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Blog</a>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/login" style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Connexion</a>
          <a href="/register" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Essai gratuit →
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-bg" style={{ paddingTop: 140, paddingBottom: 100, textAlign: 'center', padding: '140px 24px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'pulse-glow 4s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '30%', right: '10%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'pulse-glow 6s ease-in-out infinite' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.4)', borderRadius: 20, padding: '8px 20px', fontSize: 13, color: '#60a5fa', fontWeight: 600, marginBottom: 32 }}>
            🎉 7 jours gratuits — aucun engagement, annulation en 1 clic
          </div>

          <h1 className="hero-title" style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
            Votre devis professionnel<br/>
            <span className="gradient-text">en 60 secondes</span>
          </h1>

          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
            L'IA génère vos devis, vos clients signent en ligne, vous facturez en 1 clic. Conçu pour les artisans et indépendants.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <a href="/register" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', borderRadius: 14, padding: '16px 36px', fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: '0 0 40px rgba(37,99,235,0.4)' }}>
              Commencer gratuitement →
            </a>
            <a href="#comment-ca-marche" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 14, padding: '16px 36px', fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
              Voir comment ça marche
            </a>
          </div>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
            ✓ Sans carte bancaire &nbsp;·&nbsp; ✓ Sans engagement &nbsp;·&nbsp; ✓ Annulation en 1 clic
          </p>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center' }}>
          {[
            { val: '3M+', label: 'artisans font leurs devis à la main' },
            { val: '60s', label: 'pour créer un devis complet' },
            { val: '100%', label: 'légal — conforme eIDAS' },
            { val: '0€', label: 'pendant 7 jours' },
          ].map((s, i) => (
            <div key={i}>
              <p style={{ fontSize: 36, fontWeight: 900, color: '#60a5fa', marginBottom: 8 }}>{s.val}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section id="comment-ca-marche" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: '#60a5fa', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Simple & Rapide</p>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: '#ffffff' }}>Comment ça marche ?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="grid-mobile">
            {[
              { num: '01', icon: '⚙️', titre: 'Configurez', desc: 'Logo, signature, IBAN — une seule fois.' },
              { num: '02', icon: '✏️', titre: 'Créez', desc: 'Sélectionnez vos produits, l\'IA génère le devis.' },
              { num: '03', icon: '📧', titre: 'Envoyez', desc: 'Le client reçoit son devis par email.' },
              { num: '04', icon: '💶', titre: 'Encaissez', desc: 'Devis signé → facture en 1 clic.' },
            ].map((e, i) => (
              <div key={i} className="glass card-hover" style={{ borderRadius: 20, padding: 28, textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700, letterSpacing: '0.2em', marginBottom: 16 }}>{e.num}</p>
                <p style={{ fontSize: 36, marginBottom: 12 }}>{e.icon}</p>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>{e.titre}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: '#60a5fa', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Fonctionnalités</p>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: '#ffffff' }}>Tout ce qu'il vous faut</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="grid-mobile">
            {features.map((f, i) => (
              <div key={i} className="glass card-hover" style={{ borderRadius: 20, padding: 28 }}>
                <p style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</p>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: '#60a5fa', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Témoignages</p>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: '#ffffff' }}>Ce que disent nos artisans</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="grid-mobile">
            {temoignages.map((t, i) => (
              <div key={i} className="glass card-hover" style={{ borderRadius: 20, padding: 28 }}>
                <p style={{ fontSize: 14, marginBottom: 8 }}>⭐⭐⭐⭐⭐</p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>"{t.texte}"</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{t.nom}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.metier}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARIF */}
      <section id="tarif" style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#60a5fa', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Tarifs</p>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#ffffff', marginBottom: 16 }}>Simple et transparent</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginBottom: 64 }}>Pas de surprise, pas de frais cachés</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="grid-mobile">

            {/* MENSUEL */}
            <div className="glass card-hover" style={{ borderRadius: 24, padding: 36, textAlign: 'left' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>Mensuel</h3>
              <p style={{ fontSize: 48, fontWeight: 900, color: '#ffffff', marginBottom: 4 }}>24,99€</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>par mois · résiliation libre</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Devis illimités', 'Signature électronique', 'Facturation en 1 clic', 'Catalogue illimité', 'Support prioritaire'].map((item, i) => (
                  <li key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a href="/register" style={{ display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', borderRadius: 12, padding: '14px 24px', fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
                Commencer — 7 jours gratuits →
              </a>
            </div>

            {/* ANNUEL */}
            <div style={{ borderRadius: 24, padding: 36, textAlign: 'left', background: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(124,58,237,0.2))', border: '1px solid rgba(37,99,235,0.5)', position: 'relative', boxShadow: '0 0 60px rgba(37,99,235,0.2)' }}>
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#78350f', fontSize: 12, fontWeight: 800, padding: '6px 20px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                🎉 2 mois offerts
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 8, marginTop: 8 }}>Annuel</h3>
              <p style={{ fontSize: 48, fontWeight: 900, color: '#ffffff', marginBottom: 4 }}>249€</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>par an · soit 20,75€/mois</p>
              <p style={{ fontSize: 12, color: '#fbbf24', fontWeight: 600, marginBottom: 32 }}>Économisez 51€</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Devis illimités', 'Signature électronique', 'Facturation en 1 clic', 'Catalogue illimité', 'Support prioritaire'].map((item, i) => (
                  <li key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a href="/register" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#ffffff', borderRadius: 12, padding: '14px 24px', fontWeight: 700, textDecoration: 'none', fontSize: 15, boxShadow: '0 0 30px rgba(37,99,235,0.4)' }}>
                Commencer — 7 jours gratuits →
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: '#60a5fa', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>FAQ</p>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: '#ffffff' }}>Questions fréquentes</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{ width: '100%', textAlign: 'left', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: '#ffffff' }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{faq.q}</span>
                  <span style={{ fontSize: 20, color: '#60a5fa', flexShrink: 0, transform: faqOpen === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                </button>
                {faqOpen === i && (
                  <div style={{ padding: '0 24px 20px' }}>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '100px 24px', textAlign: 'center', background: 'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.2) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 48, fontWeight: 900, color: '#ffffff', marginBottom: 16, lineHeight: 1.2 }}>
            Prêt à gagner<br/><span className="gradient-text">du temps ?</span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', marginBottom: 48 }}>
            Rejoignez les artisans qui créent leurs devis en 60 secondes
          </p>
          <a href="/register" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', borderRadius: 16, padding: '20px 48px', fontSize: 18, fontWeight: 800, textDecoration: 'none', boxShadow: '0 0 60px rgba(37,99,235,0.4)' }}>
            Commencer — 7 jours gratuits →
          </a>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginTop: 20 }}>
            ✓ Sans carte bancaire · ✓ Sans engagement · ✓ Annulation en 1 clic
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '48px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          <img src={LOGO} alt="FaireDesDevis" style={{ height: 28, width: 'auto', filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>FaireDesDevis</span>
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Blog', href: '/blog' },
            { label: 'CGU', href: '/legal/cgu' },
            { label: 'Confidentialité', href: '/legal/confidentialite' },
            { label: 'Mentions légales', href: '/legal/mentions' },
            { label: 'Connexion', href: '/login' },
          ].map((l, i) => (
            <a key={i} href={l.href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>{l.label}</a>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>© 2026 FaireDesDevis — Tous droits réservés</p>
      </footer>

    </main>
  )
}