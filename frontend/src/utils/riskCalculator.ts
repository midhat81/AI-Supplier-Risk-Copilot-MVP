/**
 * MVP Risk Formula:
 * risk_score = (1 - supplier_reliability) * 0.4
 *            + (avg_delay / expected_days) * 0.6
 */
export function calculateRiskScore(
    supplierReliability: number,  // 0.0 – 1.0
    avgDelayDays: number,
    expectedDays: number
  ): number {
    const reliabilityFactor = (1 - supplierReliability) * 0.4
    const delayFactor       = (avgDelayDays / Math.max(expectedDays, 1)) * 0.6
    return Math.min(reliabilityFactor + delayFactor, 1.0)
  }
  
  export function getRiskLabel(score: number): 'low' | 'medium' | 'high' {
    if (score < 0.4) return 'low'
    if (score < 0.7) return 'medium'
    return 'high'
  }
  
  export function getRiskColor(score: number): string {
    const level = getRiskLabel(score)
    return { low: '#10b981', medium: '#f59e0b', high: '#ef4444' }[level]
  }