import Link from 'next/link'

const articles = [
  {
    slug: 'comment-faire-un-devis-professionnel',
    categorie: 'GUIDE PRATIQUE',
    date: '24 juillet 2026',
    titre: 'Comment faire un devis professionnel en 2026 (guide complet)',
    extrait: 'Mentions obligatoires, TVA, signature — tout ce qu\'il faut pour créer un devis légal et professionnel en France.',
  },
  {
    slug: 'logiciel-devis-artisan-gratuit',
    categorie: 'GUIDE LOGICIEL',
    date: '22 juillet 2026',
    titre: 'Logiciel devis artisan gratuit : pourquoi la gratuité coûte cher',
    extrait: 'Les logiciels gratuits semblent attractifs, mais cachent des limitations sérieuses. Voici pourquoi les artisans passent à payant.',
  },
  {
    slug: 'mentions-legales-devis-artisan',
    categorie: 'RÉGLEMENTATION',
    date: '20 juillet 2026',
    titre: 'Mentions légales obligatoires sur un devis artisan en France',
    extrait: 'SIRET, TVA, assurance décennale... Voici la checklist complète des mentions obligatoires sur vos devis.',
  },
  {
    slug: 'signature-electronique-devis-valeur-legale',
    categorie: 'RÉGLEMENTATION',
    date: '18 juillet 2026',
    titre: 'Signature électronique sur un devis : valeur légale en France',
    extrait: 'La signature électronique a-t-elle la même valeur qu\'une signature manuscrite ? Tout ce qu\'il faut savoir sur le règlement eIDAS.',
  },
  {
    slug: 'devis-plombier-electricien-menuisier',
    categorie: 'MODÈLES',
    date: '15 juillet 2026',
    titre: 'Devis plombier, électricien, menuisier : modèles gratuits 2026',
    extrait: 'Téléchargez nos modèles de devis adaptés à chaque corps de métier et créez votre premier devis en 60 secondes.',
  },
  {
    slug: 'transformer-devis-en-facture',
    categorie: 'GUIDE PRATIQUE',
    date: '10 juillet 2026',
    titre: 'Comment transformer un devis accepté en facture en 1 clic',
    extrait: 'Une fois le devis signé par votre client, la facturation doit être rapide et sans erreur. Voici comment automatiser ce processus.',
  },
  {
    slug: 'devis-batiment-travaux',
    categorie: 'GUIDE PRATIQUE',
    date: '8 juillet 2026',
    titre: 'Comment faire un devis pour travaux en bâtiment en 2026',
    extrait: 'Chiffrage, TVA, mentions obligatoires — tout ce qu\'il faut savoir pour établir un devis bâtiment légal et professionnel.',
  },
  {
    slug: 'relance-devis-non-signe',
    categorie: 'CONSEILS',
    date: '5 juillet 2026',
    titre: 'Comment relancer un client après un devis non signé',
    extrait: '60% des devis non relancés ne sont jamais signés. Voici comment relancer efficacement sans être intrusif.',
  },
  {
    slug: 'auto-entrepreneur-devis-facture',
    categorie: 'RÉGLEMENTATION',
    date: '2 juillet 2026',
    titre: 'Auto-entrepreneur : comment faire ses devis et factures légalement',
    extrait: 'SIRET, TVA non applicable, mentions obligatoires — tout ce que l\'auto-entrepreneur doit savoir sur ses devis.',
  },
  {
    slug: 'catalogue-produits-artisan',
    categorie: 'PRODUCTIVITÉ',
    date: '28 juin 2026',
    titre: 'Comment créer un catalogue produits pour artisan et gagner 2h par semaine',
    extrait: 'Un catalogue bien organisé vous permet de créer un devis en 60 secondes au lieu de 45 minutes. Voici comment.',
  },
]

export default function Blog() {
  return (
    <main style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 20, fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>FaireDesDevis</Link>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <Link href="/#fonctionnalites" style={{ fontSize: 13, fontWeight: 600, color: '#1f2937', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fonctionnalités</Link>
          <Link href="/#comment-ca-marche" style={{ fontSize: 13, fontWeight: 600, color: '#1f2937', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>La solution</Link>
          <Link href="/#tarif" style={{ fontSize: 13, fontWeight: 600, color: '#1f2937', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tarifs</Link>
          <Link href="/blog" style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Blog</Link>
          <Link href="/#faq" style={{ fontSize: 13, fontWeight: 600, color: '#1f2937', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>FAQ</Link>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>Se connecter</Link>
          <Link href="/register" style={{ background: '#2563eb', color: '#fff', borderRadius: 8, padding: '10px 18px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Essai gratuit 7j</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1a1a2e', border: '1px solid #2563eb', borderRadius: 20, padding: '6px 16px', fontSize: 12, color: '#2563eb', fontWeight: 700, marginBottom: 24, letterSpacing: '0.1em' }}>
          📋 LE BLOG DE L'ARTISAN
        </div>
        <h1 style={{ fontSize: 64, fontWeight: 900, color: '#ffffff', lineHeight: 1.1, marginBottom: 20 }}>
          RESSOURCES &amp; <span style={{ color: '#2563eb' }}>GUIDES</span>
        </h1>
        <p style={{ fontSize: 18, color: '#9ca3af', maxWidth: 520, margin: '0 auto' }}>
          Retrouvez nos meilleurs conseils pour créer des devis professionnels et développer votre activité.
        </p>
      </section>

      {/* ARTICLES */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {articles.map((a) => (
          <Link key={a.slug} href={`/blog/${a.slug}`} style={{ textDecoration: 'none', display: 'block', background: '#1a1a1a', borderRadius: 16, padding: '32px', border: '1px solid #2a2a2a', transition: 'border-color 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '0.1em' }}>{a.categorie}</span>
              <span style={{ fontSize: 11, color: '#6b7280' }}>·</span>
              <span style={{ fontSize: 11, color: '#6b7280' }}>{a.date}</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', marginBottom: 12, lineHeight: 1.3 }}>{a.titre}</h2>
            <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7, marginBottom: 24 }}>{a.extrait}</p>
            <span style={{ fontSize: 14, color: '#ffffff', fontWeight: 600 }}>Lire l'article →</span>
          </Link>
        ))}
      </section>

    </main>
  )
}