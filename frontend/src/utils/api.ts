import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ── Axios instance ────────────────────────────
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Auto attach token ─────────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Auth ──────────────────────────────────────
export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    return res.data
  },
  register: async (email: string, full_name: string, password: string) => {
    const res = await api.post('/auth/register', { email, full_name, password })
    return res.data
  },
  me: async () => {
    const res = await api.get('/auth/me')
    return res.data
  }
}

// ── Suppliers ─────────────────────────────────
export const supplierAPI = {
  getAll: async () => {
    const res = await api.get('/suppliers/')
    return res.data
  },
  getOne: async (id: number) => {
    const res = await api.get(`/suppliers/${id}`)
    return res.data
  },
  create: async (data: {
    name: string
    contact_info: string
    reliability_score: number
  }) => {
    const res = await api.post('/suppliers/', data)
    return res.data
  },
  update: async (id: number, data: any) => {
    const res = await api.put(`/suppliers/${id}`, data)
    return res.data
  },
  delete: async (id: number) => {
    await api.delete(`/suppliers/${id}`)
  }
}

// ── Shipments ─────────────────────────────────
export const shipmentAPI = {
  getAll: async () => {
    const res = await api.get('/shipments/')
    return res.data
  },
  getOne: async (id: number) => {
    const res = await api.get(`/shipments/${id}`)
    return res.data
  },
  create: async (data: {
    supplier_id: number
    origin: string
    destination: string
    date_sent: string
    date_expected: string
    status: string
  }) => {
    const res = await api.post('/shipments/', data)
    return res.data
  },
  update: async (id: number, data: any) => {
    const res = await api.put(`/shipments/${id}`, data)
    return res.data
  },
  delete: async (id: number) => {
    await api.delete(`/shipments/${id}`)
  }
}

// ── Risk ──────────────────────────────────────
export const riskAPI = {
  getAll: async () => {
    const res = await api.get('/risk/')
    return res.data
  },
  getSummary: async () => {
    const res = await api.get('/risk/summary')
    return res.data
  },
  getByShipment: async (shipmentId: number) => {
    const res = await api.get(`/risk/${shipmentId}`)
    return res.data
  },
  recalculate: async (shipmentId: number) => {
    const res = await api.post(`/risk/calculate/${shipmentId}`)
    return res.data
  }
}

export default api