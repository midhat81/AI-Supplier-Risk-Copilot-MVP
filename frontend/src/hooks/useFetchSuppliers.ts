import { useState, useEffect } from 'react'
import axios from 'axios'

export interface Supplier {
  id: number
  name: string
  contact_info: string
  reliability_score: number
}

export function useFetchSuppliers(token: string | null) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/suppliers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setSuppliers(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  return { suppliers, loading, error }
}