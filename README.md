# 🤖 AI Supplier Risk Copilot MVP

> An intelligent supply chain risk management system for SMEs in import/export. Track suppliers, monitor shipments, get AI-powered risk alerts, and watch live parcel updates in real-time.

![Version](https://img.shields.io/badge/version-0.3.0-6366f1)
![Frontend](https://img.shields.io/badge/frontend-Next.js%2014-black)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![AI](https://img.shields.io/badge/AI-Ollama%20Llama3-ff6b35)
![Database](https://img.shields.io/badge/database-SQLite%20%2F%20PostgreSQL-336791)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🔐 **JWT Auth** | Secure login/logout with bearer tokens | ✅ |
| 📊 **Risk Dashboard** | Visual stats, risk scores, alert banners | ✅ |
| 🏭 **Supplier Management** | Add, search, track supplier reliability | ✅ |
| 🚢 **Shipment Tracking** | CRUD shipments with auto risk calculation | ✅ |
| 📦 **Live Parcel Tracking** | AfterShip API — 1000+ carriers supported | ✅ |
| ⚡ **Real-Time Dashboard** | WebSocket live updates — no page refresh | ✅ |
| 🔔 **Webhook Integration** | AfterShip pushes status changes instantly | ✅ |
| 🤖 **AI Chat Copilot** | Ollama Llama3 with live supply chain context | ✅ |
| 📰 **Live News Feed** | Real supply chain disruption news via NewsAPI | ✅ |
| 🌤️ **Route Weather** | Live weather risk on trade routes | ✅ |
| 🌍 **Country Risk Index** | World Bank Logistics Performance Index | ✅ |
| 🐳 **Docker Ready** | One command deployment | ✅ |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 + TypeScript + Tailwind CSS |
| **Backend** | FastAPI (Python 3.11) |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Auth** | JWT (python-jose + passlib/bcrypt) |
| **AI** | Ollama (Llama3 / tinyllama) — runs locally |
| **Live Data** | NewsAPI + OpenWeatherMap + World Bank |
| **Tracking** | AfterShip API (1000+ carriers) |
| **Real-Time** | WebSocket + AfterShip Webhooks |
| **Tunnel** | ngrok / LocalTunnel for webhooks |
| **DevOps** | Docker + docker-compose |

---

## 📁 Project Structure

```
AI-Supplier-Risk-Copilot-MVP/
│
├── 📄 README.md
├── 📄 .gitignore
├── 📄 .env
├── 📄 docker-compose.yml
│
├── 📁 scripts/
│   └── 📄 seed_data.py              ← Seeds DB with sample data
│
├── 📁 backend/
│   ├── 📄 supplier_risk.db          ← SQLite database
│   ├── 📄 requirements.txt
│   ├── 📄 Dockerfile
│   ├── 📄 .env
│   │
│   └── 📁 app/
│       ├── 📄 main.py               ← FastAPI app + all routers
│       │
│       ├── 📁 models/
│       │   ├── 📄 user.py
│       │   ├── 📄 supplier.py
│       │   ├── 📄 shipment.py
│       │   └── 📄 risk_score.py
│       │
│       ├── 📁 routes/
│       │   ├── 📄 auth.py           ← /auth endpoints
│       │   ├── 📄 supplier.py       ← /suppliers endpoints
│       │   ├── 📄 shipment.py       ← /shipments endpoints
│       │   ├── 📄 risk.py           ← /risk endpoints
│       │   ├── 📄 ai_chat.py        ← /ai endpoints
│       │   ├── 📄 tracking.py       ← /tracking endpoints
│       │   └── 📄 webhook.py        ← /webhook + WebSocket
│       │
│       ├── 📁 services/
│       │   ├── 📄 risk_service.py       ← Risk formula
│       │   ├── 📄 ollama_service.py     ← Ollama AI integration
│       │   ├── 📄 data_fetcher.py       ← News + Weather + World Bank
│       │   ├── 📄 tracking_service.py   ← AfterShip API
│       │   └── 📄 websocket_manager.py  ← WebSocket connections
│       │
│       ├── 📁 schemas/
│       │   ├── 📄 user_schema.py
│       │   ├── 📄 supplier_schema.py
│       │   └── 📄 shipment_schema.py
│       │
│       └── 📁 utils/
│           ├── 📄 db.py             ← SQLite connection
│           └── 📄 auth.py           ← JWT helpers
│
├── 📁 frontend/
│   └── 📁 src/
│       ├── 📁 pages/
│       │   ├── 📄 index.tsx         ← Redirect
│       │   ├── 📄 login.tsx         ← Dark glassmorphism login
│       │   ├── 📄 dashboard.tsx     ← Risk overview
│       │   ├── 📄 suppliers.tsx     ← Supplier cards + add form
│       │   ├── 📄 shipments.tsx     ← Shipment table + filters
│       │   ├── 📄 tracking.tsx      ← AfterShip parcel tracking
│       │   ├── 📄 live.tsx          ← Real-time dark dashboard
│       │   └── 📄 chat.tsx          ← AI chat with live context
│       │
│       ├── 📁 components/
│       │   ├── 📄 Navbar.tsx        ← Sticky nav with all pages
│       │   ├── 📄 StatCard.tsx
│       │   ├── 📄 AlertBanner.tsx
│       │   └── 📄 ShipmentRow.tsx
│       │
│       ├── 📁 hooks/
│       │   ├── 📄 useChat.ts            ← AI chat state
│       │   ├── 📄 useLiveTracking.ts    ← WebSocket live tracking
│       │   ├── 📄 useFetchShipments.ts
│       │   └── 📄 useFetchRisk.ts
│       │
│       ├── 📁 context/
│       │   └── 📄 AuthContext.tsx
│       │
│       └── 📁 utils/
│           ├── 📄 api.ts            ← Axios with auto token
│           └── 📄 mockData.ts
│
└── 📁 ai/
    ├── 📄 train_model.py            ← Train RandomForest model
    ├── 📄 predict.py
    └── 📄 utils.py
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Ollama — https://ollama.com/download

---

### Step 1 — Clone
```bash
git clone https://github.com/midhat81/AI-Supplier-Risk-Copilot-MVP.git
cd AI-Supplier-Risk-Copilot-MVP
```

---

### Step 2 — Setup Backend
```bash
cd backend
pip install -r requirements.txt
```

---

### Step 3 — Configure Environment
Edit `backend/.env`:
```env
DATABASE_URL=sqlite:///./supplier_risk.db
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
NEWS_API_KEY=your-newsapi-key
WEATHER_API_KEY=your-openweather-key
AFTERSHIP_API_KEY=your-aftership-key
```

---

### Step 4 — Seed Database
```bash
cd backend
python ..\scripts\seed_data.py
```

---

### Step 5 — Install Ollama AI
```bash
# Download from https://ollama.com/download then run:
ollama pull tinyllama     # 270MB - works on any laptop
# OR for better quality:
ollama pull llama3:8b     # 4.7GB - needs 8GB+ RAM
```

---

### Step 6 — Run Everything

**Terminal 1 — Ollama:**
```bash
ollama serve
```

**Terminal 2 — Backend:**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Terminal 3 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 4 — Live Webhook Tunnel:**
```bash
npm install -g localtunnel
lt --port 8000
```

---

### Step 7 — Open App

| URL | Page |
|-----|------|
| `http://localhost:3000` | Main app |
| `http://localhost:3000/dashboard` | Risk dashboard |
| `http://localhost:3000/tracking` | Parcel tracking |
| `http://localhost:3000/live` | Live real-time dashboard |
| `http://localhost:3000/chat` | AI Chat copilot |
| `http://localhost:8000/docs` | API Swagger docs |

---

## 🔑 Demo Login

| Field | Value |
|-------|-------|
| Email | `admin@test.com` |
| Password | `password123` |

---

## 📡 API Reference

### Auth `/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login + get JWT |
| GET | `/auth/me` | Current user info |

### Suppliers `/suppliers`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/suppliers/` | List all suppliers |
| POST | `/suppliers/` | Create supplier |
| GET | `/suppliers/{id}` | Get one |
| PUT | `/suppliers/{id}` | Update |
| DELETE | `/suppliers/{id}` | Delete |

### Shipments `/shipments`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/shipments/` | List all |
| POST | `/shipments/` | Create + auto risk |
| PUT | `/shipments/{id}` | Update |
| DELETE | `/shipments/{id}` | Delete |

### Risk `/risk`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/risk/` | All risk scores |
| GET | `/risk/summary` | Risk stats |
| POST | `/risk/calculate/{id}` | Recalculate risk |

### AI Chat `/ai`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/chat` | Chat with Ollama AI |
| GET | `/ai/status` | Ollama status |
| GET | `/ai/news` | Live supply chain news |
| GET | `/ai/weather/{city}` | Live weather |
| GET | `/ai/context` | Full live context |

### Tracking `/tracking`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tracking/add` | Add tracking number |
| GET | `/tracking/all` | All parcels + summary |
| GET | `/tracking/summary` | Stats only |
| GET | `/tracking/{number}` | Single parcel details |
| DELETE | `/tracking/{number}` | Remove tracking |

### Webhook `/webhook`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhook/aftership` | Receive AfterShip push |
| WS | `/webhook/ws/tracking` | WebSocket live feed |

---

## 🧠 AI Risk Formula

```python
risk_score = (1 - supplier_reliability) * 0.4
           + (avg_delay_days / expected_days) * 0.6
```

| Score | Risk Level |
|-------|------------|
| 0.0 – 0.39 | 🟢 Low |
| 0.40 – 0.69 | 🟡 Medium |
| 0.70 – 1.0 | 🔴 High |

---

## 🤖 AI Copilot Models

| Model | RAM Needed | Quality |
|-------|-----------|---------|
| `tinyllama` | 500MB | ⭐⭐ |
| `phi3:mini` | 2.5GB | ⭐⭐⭐⭐ |
| `llama3.2:3b` | 4GB | ⭐⭐⭐⭐ |
| `llama3:8b` | 8GB | ⭐⭐⭐⭐⭐ |

---

## ⚡ Real-Time Flow

```
AfterShip detects update
        ↓
POST /webhook/aftership
        ↓
FastAPI broadcasts via WebSocket
        ↓
Frontend receives instantly
        ↓
⚡ Dashboard updates live
```

---

## 📅 Build Timeline

| Day | Feature | Status |
|-----|---------|--------|
| Day 1 | Market Validation | ✅ |
| Day 2 | Feature Definition + Wireframes | ✅ |
| Day 3 | Project Structure + Config | ✅ |
| Day 4 | DB Models + Risk Logic + AI Module | ✅ |
| Day 5 | Frontend Skeleton | ✅ |
| Day 6 | Backend API Routes | ✅ |
| Day 7 | Frontend-Backend Integration | ✅ |
| Day 8 | AfterShip Live Parcel Tracking | ✅ |
| Day 9 | WebSocket Real-Time Dashboard | ✅ |

---

## 🔮 Roadmap

- [ ] Train ML model with real shipment data
- [ ] Email/SMS alerts for high risk shipments
- [ ] Multi-tenant support
- [ ] Supplier performance history charts
- [ ] CSV import/export
- [ ] Mobile app (React Native)
- [ ] MarineTraffic vessel tracking
- [ ] Port congestion live alerts

---

## 👨‍💻 Author

**Muhammad Midhat**
- GitHub: [@midhat81](https://github.com/midhat81)
- Project: [AI-Supplier-Risk-Copilot-MVP](https://github.com/midhat81/AI-Supplier-Risk-Copilot-MVP)

---

## 📄 License

MIT License — free to use for your own purposes.

---

<div align="center">
  <p>Built with ❤️ using Next.js + FastAPI + Ollama AI + AfterShip + WebSocket</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>