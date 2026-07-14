import Link from 'next/link'

interface NavBarProps {
  active?: string
}

export default function NavBar({ active }: NavBarProps) {
  const items = [
    { id: 'dashboard', href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'devis', href: '/dashboard/devis', icon: '📄', label: 'Devis' },
    { id: 'clients', href: '/dashboard/clients', icon: '👥', label: 'Clients' },
    { id: 'catalogue', href: '/dashboard/catalogue', icon: '📦', label: 'Catalogue' },
    { id: 'profil', href: '/dashboard/profil', icon: '⚙️', label: 'Profil' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 px-4 z-50 print:hidden">
      {items.map(item => (
        <Link
          key={item.id}
          href={item.href}
          className={'flex flex-col items-center gap-1 ' + (active === item.id ? 'text-blue-600' : 'text-gray-400')}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
    </div>
  )
}