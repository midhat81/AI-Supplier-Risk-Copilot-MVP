# 🤖 AI Supplier Risk Copilot MVP

> An intelligent supply chain risk management system for SMEs in import/export. Track suppliers, monitor shipments, and get AI-powered predictive risk alerts — all in one dashboard.

![Version](https://img.shields.io/badge/version-0.1.0-6366f1)
![Frontend](https://img.shields.io/badge/frontend-Next.js%2014-black)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![Database](https://img.shields.io/badge/database-SQLite%20%2F%20PostgreSQL-336791)
![License](https://img.shields.io/badge/license-MIT-green)

---

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 + TypeScript + Tailwind CSS |
| **Backend** | FastAPI (Python 3.11) |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Auth** | JWT (python-jose + passlib/bcrypt) |
| **AI Module** | scikit-learn (RandomForest risk model) |
| **DevOps** | Docker + docker-compose |

---

## 📁 Project Structure

```
ai-supplier-risk-copilot/
│
├── frontend/                        # Next.js frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Navigation bar
│   │   │   ├── SupplierCard.tsx     # Supplier reliability card
│   │   │   ├── RiskIndicator.tsx    # Circular risk score widget
│   │   │   ├── StatCard.tsx         # Dashboard stat card
│   │   │   ├── AlertBanner.tsx      # High risk alert banner
│   │   │   └── ShipmentRow.tsx      # Shipment table row
│   │   ├── pages/
│   │   │   ├── _app.tsx             # App wrapper + AuthProvider
│   │   │   ├── index.tsx            # Redirect to login/dashboard
│   │   │   ├── login.tsx            # Login page (glassmorphism UI)
│   │   │   ├── dashboard.tsx        # Main dashboard
│   │   │   ├── suppliers.tsx        # Suppliers list + add form
│   │   │   └── shipments.tsx        # Shipments table + filters
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Global auth state
│   │   ├── hooks/
│   │   │   ├── useFetchSuppliers.ts # Suppliers API hook
│   │   │   ├── useFetchShipments.ts # Shipments API hook
│   │   │   └── useFetchRisk.ts      # Risk scores API hook
│   │   └── utils/
│   │       ├── api.ts               # Axios API client
│   │       ├── riskCalculator.ts    # MVP risk formula
│   │       └── mockData.ts          # Sample data for dev
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── package.json
│
├── backend/                         # FastAPI backend
│   ├── app/
│   │   ├── main.py                  # App entry point + CORS
│   │   ├── models/
│   │   │   ├── user.py              # User DB model
│   │   │   ├── supplier.py          # Supplier DB model
│   │   │   ├── shipment.py          # Shipment DB model
│   │   │   └── risk_score.py        # RiskScore DB model
│   │   ├── routes/
│   │   │   ├── auth.py              # /auth endpoints
│   │   │   ├── supplier.py          # /suppliers endpoints
│   │   │   ├── shipment.py          # /shipments endpoints
│   │   │   └── risk.py              # /risk endpoints
│   │   ├── services/
│   │   │   └── risk_service.py      # Risk calculation logic
│   │   ├── schemas/
│   │   │   ├── user_schema.py       # User Pydantic schemas
│   │   │   ├── supplier_schema.py   # Supplier Pydantic schemas
│   │   │   └── shipment_schema.py   # Shipment Pydantic schemas
│   │   └── utils/
│   │       ├── db.py                # Database connection
│   │       └── auth.py              # JWT + password utils
│   ├── Dockerfile
│   └── requirements.txt
│
├── ai/                              # AI / ML risk module
│   ├── train_model.py               # Train RandomForest model
│   ├── predict.py                   # Predict risk score
│   └── utils.py                     # Helper functions
│
├── scripts/
│   └── seed_data.py                 # Seed DB with sample data
│
├── docker-compose.yml
├── .env
└── README.md
```

---

## 🚀 Quick Start

### Option A — Local Development (Recommended)

**1. Clone the repository:**
```bash
git clone https://github.com/midhat81/AI-Supplier-Risk-Copilot-MVP.git
cd AI-Supplier-Risk-Copilot-MVP
```

**2. Setup Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**3. Run Backend:**
```bash
uvicorn app.main:app --reload --port 8000
```

**4. Seed Database:**
```bash
cd ..
python scripts/seed_data.py
```

**5. Setup Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**6. Open in browser:**
- 🌐 Frontend: http://localhost:3000
- 📖 API Docs: http://localhost:8000/docs

---

### Option B — Docker (Production)

```bash
# Copy env file
cp .env.example .env

# Start all services
docker-compose up --build
```

---

## 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| Email | `admin@test.com` |
| Password | `password123` |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login + get JWT token |
| GET | `/auth/me` | Get current user |

### Suppliers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/suppliers/` | List all suppliers |
| POST | `/suppliers/` | Create supplier |
| GET | `/suppliers/{id}` | Get supplier |
| PUT | `/suppliers/{id}` | Update supplier |
| DELETE | `/suppliers/{id}` | Delete supplier |

### Shipments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/shipments/` | List all shipments |
| POST | `/shipments/` | Create shipment |
| GET | `/shipments/{id}` | Get shipment |
| PUT | `/shipments/{id}` | Update shipment |
| DELETE | `/shipments/{id}` | Delete shipment |

### Risk
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/risk/` | All risk scores |
| GET | `/risk/summary` | Risk summary stats |
| GET | `/risk/{shipment_id}` | Risk for shipment |
| POST | `/risk/calculate/{id}` | Recalculate risk |

---

## 🧠 AI Risk Formula (MVP)

```python
risk_score = (1 - supplier_reliability) * 0.4
           + (avg_delay_days / expected_days) * 0.6
```

| Score Range | Risk Level | Color |
|-------------|------------|-------|
| 0.0 – 0.39 | 🟢 Low | Green |
| 0.40 – 0.69 | 🟡 Medium | Yellow |
| 0.70 – 1.0 | 🔴 High | Red |

> **Next step:** Replace formula with trained `RandomForestRegressor` model from `ai/train_model.py`

---

## 🗄️ Database Schema

### Users
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| email | String | Unique email |
| full_name | String | Full name |
| hashed_password | String | Bcrypt hash |
| role | String | admin / user |
| is_active | Boolean | Account status |

### Suppliers
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| name | String | Supplier name |
| contact_info | String | Contact email |
| reliability_score | Float | 0.0 – 1.0 |

### Shipments
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| supplier_id | Integer | FK → suppliers |
| origin | String | Origin city |
| destination | String | Destination city |
| date_sent | Date | Sent date |
| date_expected | Date | Expected arrival |
| status | String | in_transit / delivered / delayed |

### RiskScores
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| shipment_id | Integer | FK → shipments |
| risk_score | Float | 0.0 – 1.0 |
| calculated_on | DateTime | Calculation time |

---

## 📅 Build Timeline

| Day | Task | Status |
|-----|------|--------|
| Day 1 | Market Validation | ✅ Done |
| Day 2 | Feature Definition + Wireframes | ✅ Done |
| Day 3 | Project Architecture + Folder Structure | ✅ Done |
| Day 4 | Database Schema + Risk Logic | ✅ Done |
| Day 5 | Frontend Skeleton | ✅ Done |
| Day 6 | Backend API Routes | ✅ Done |
| Day 7 | Full Integration | ✅ Done |

---

## ✨ Features

- ✅ **JWT Authentication** — Secure login/logout
- ✅ **Supplier Management** — Add, view, search suppliers
- ✅ **Shipment Tracking** — Track origin → destination
- ✅ **AI Risk Scoring** — Automatic risk calculation
- ✅ **High Risk Alerts** — Banner alerts for dangerous shipments
- ✅ **Risk Dashboard** — Visual stats and summaries
- ✅ **Filter by Status** — in_transit / delivered / delayed
- ✅ **Responsive UI** — Works on desktop and mobile
- ✅ **REST API** — Full Swagger docs at `/docs`
- ✅ **Docker Ready** — One command deployment

---

## 🔮 Roadmap (Post-MVP)

- [ ] Train ML model with real shipment data
- [ ] Email/SMS alerts for high risk shipments
- [ ] Multi-tenant (multiple companies)
- [ ] Supplier performance history charts
- [ ] CSV import/export for shipments
- [ ] Mobile app (React Native)
- [ ] Integration with shipping APIs (DHL, FedEx)

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Muhammad Midhat**
- GitHub: [@midhat81](https://github.com/midhat81)
- Project: [AI-Supplier-Risk-Copilot-MVP](https://github.com/midhat81/AI-Supplier-Risk-Copilot-MVP)

---

## 📄 License

MIT License — feel free to use this project for your own purposes.

---

<div align="center">
  <p>Built with ❤️ using Next.js + FastAPI + AI</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>