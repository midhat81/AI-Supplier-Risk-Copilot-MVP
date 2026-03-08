import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const { token } = useAuth()
  const router    = useRouter()

  useEffect(() => {
    router.replace(token ? '/dashboard' : '/login')
  }, [token, router])

  return null
}