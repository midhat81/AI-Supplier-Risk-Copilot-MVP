import { useState, useEffect } from 'react'
import { riskAPI } from '../utils/api'

export interface RiskSummary {
  total:        number
  high_risk:    number
  medium_risk:  number
  low_risk:     number
  avg_score:    number
}

export interface RiskScore {
  id:            number
  risk_score:    number
  risk_label:    string
  calculated_on: string
  origin:        string
  destination:   string
  status:        string
  supplier_name: string
}

export function useFetchRisk(token: string | null) {
  const [risks,    setRisks]   = useState<RiskScore[]>([])
  const [summary,  setSummary] = useState<RiskSummary | null>(null)
  const [loading,  setLoading] = useState(false)
  const [error,    setError]   = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    Promise.all([riskAPI.getAll(), riskAPI.getSummary()])
      .then(([risksData, summaryData]) => {
        setRisks(risksData)
        setSummary(summaryData)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  return { risks, summary, loading, error }
}