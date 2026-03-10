import { useState, useEffect } from 'react'
import { shipmentAPI } from '../utils/api'

export interface Shipment {
  id:            number
  supplier_id:   number
  origin:        string
  destination:   string
  date_sent:     string
  date_expected: string
  status:        string
}

export function useFetchShipments(token: string | null) {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    shipmentAPI.getAll()
      .then(data => setShipments(data))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false))
  }, [token])

  return { shipments, loading, error, setShipments }
}