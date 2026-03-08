import Link from 'next/link'
import { useRouter } from 'next/router'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Suppliers', href: '/suppliers' },
  { label: 'Shipments', href: '/shipments' },
]

export default function Navbar() {
  const router = useRouter()

  return (
    <nav className="bg-primary-900 text-white px-6 py-4 flex items-center justify-between">
      <Link href="/dashboard" className="font-bold text-lg tracking-tight">
        🤖 RiskCopilot
      </Link>
      <div className="flex gap-6">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm transition-colors hover:text-primary-100 ${
              router.pathname === item.href
                ? 'text-white font-semibold'
                : 'text-primary-200'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <button className="text-sm text-primary-200 hover:text-white transition-colors">
        Logout
      </button>
    </nav>
  )
}