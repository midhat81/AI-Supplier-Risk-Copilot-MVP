import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../utils/api'

export interface LiveParcel {
  tracking_number:   string
  carrier:           string
  carrier_name:      string
  status:            string
  status_emoji:      string
  status_color:      string
  risk_level:        string
  origin:            string
  destination:       string
  expected_delivery: string | null
  last_update:       string
  last_location:     string
  last_message?:     string
  isNew?:            boolean  // highlight newly updated parcels
}

export interface TrackingSummary {
  total:      number
  delivered:  number
  in_transit: number
  delayed:    number
  pending:    number
  high_risk:  number
}

export function useLiveTracking() {
  const [parcels,    setParcels]    = useState<LiveParcel[]>([])
  const [summary,    setSummary]    = useState<TrackingSummary | null>(null)
  const [connected,  setConnected]  = useState(false)
  const [loading,    setLoading]    = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  const wsRef       = useRef<WebSocket | null>(null)
  const pingRef     = useRef<NodeJS.Timeout | null>(null)
  const reconnectRef = useRef<NodeJS.Timeout | null>(null)

  // ── Load Initial Data ───────────────────────
  const loadParcels = useCallback(async () => {
    try {
      const res = await api.get('/tracking/all')
      setParcels(res.data.trackings || [])
      setSummary(res.data.summary   || null)
    } catch (err) {
      console.error('Failed to load parcels:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Handle Live Update ──────────────────────
  const handleLiveUpdate = useCallback((update: any) => {
    console.log('📦 Live update received:', update)
    setLastUpdate(new Date().toLocaleTimeString())

    // Update parcels list with new status
    setParcels(prev => {
      const exists = prev.find(
        p => p.tracking_number === update.tracking_number
      )

      if (exists) {
        // Update existing parcel
        return prev.map(p =>
          p.tracking_number === update.tracking_number
            ? {
                ...p,
                status:        update.status,
                status_emoji:  update.status_emoji,
                status_color:  update.status_color,
                risk_level:    update.risk_level,
                last_location: update.last_location,
                last_message:  update.last_message,
                last_update:   update.last_update,
                isNew:         true,  // highlight it
              }
            : { ...p, isNew: false }
        )
      } else {
        // Add new parcel to top of list
        return [{ ...update, isNew: true }, ...prev]
      }
    })

    // Update summary counts
    setSummary(prev => {
      if (!prev) return prev
      // Recalculate summary after update
      return { ...prev }
    })

    // Remove highlight after 3 seconds
    setTimeout(() => {
      setParcels(prev =>
        prev.map(p =>
          p.tracking_number === update.tracking_number
            ? { ...p, isNew: false }
            : p
        )
      )
    }, 3000)

    // Reload full data to sync
    loadParcels()
  }, [loadParcels])

  // ── Connect WebSocket ───────────────────────
  const connectWebSocket = useCallback(() => {
    try {
      const token = localStorage.getItem('token')
      const ws    = new WebSocket(`ws://localhost:8000/webhook/ws/tracking`)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('🔌 WebSocket connected!')
        setConnected(true)

        // Ping every 30s to keep alive
        pingRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'PING' }))
          }
        }, 30000)
      }

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          console.log('📡 WS message:', msg.type)

          if (msg.type === 'TRACKING_UPDATE') {
            handleLiveUpdate(msg)
          }
          if (msg.type === 'CONNECTED') {
            console.log('✅ Live tracking active!')
          }
        } catch (err) {
          console.error('WS parse error:', err)
        }
      }

      ws.onerror = (err) => {
        console.error('WebSocket error:', err)
        setConnected(false)
      }

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected, reconnecting in 3s...')
        setConnected(false)

        // Clear ping interval
        if (pingRef.current) clearInterval(pingRef.current)

        // Auto reconnect after 3 seconds
        reconnectRef.current = setTimeout(() => {
          console.log('🔄 Reconnecting WebSocket...')
          connectWebSocket()
        }, 3000)
      }
    } catch (err) {
      console.error('WebSocket setup error:', err)
      setConnected(false)
    }
  }, [handleLiveUpdate])

  // ── Lifecycle ───────────────────────────────
  useEffect(() => {
    loadParcels()
    connectWebSocket()

    return () => {
      // Cleanup on unmount
      if (wsRef.current)    wsRef.current.close()
      if (pingRef.current)  clearInterval(pingRef.current)
      if (reconnectRef.current) clearTimeout(reconnectRef.current)
    }
  }, [])

  return {
    parcels,
    summary,
    connected,
    loading,
    lastUpdate,
    refresh: loadParcels,
  }
}