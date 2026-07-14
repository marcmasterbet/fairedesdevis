import Link from 'next/link'

interface HeaderProps {
  back?: string
  backLabel?: string
  action?: React.ReactNode
}

export default function Header({ back, backLabel = '← Retour', action }: HeaderProps) {
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <Link href="/" className="text-blue-600 font-bold text-xl">FaireDesDevis</Link>
      <div className="flex items-center gap-4">
        {action}
        {back && (
          <Link href={back} className="text-sm text-gray-400 hover:text-gray-600">
            {backLabel}
          </Link>
        )}
      </div>
    </header>
  )
}