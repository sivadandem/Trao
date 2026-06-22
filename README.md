# Trao AI Travel Planner

<div align="center">

![Trao Banner](https://img.shields.io/badge/Trao-AI%20Travel%20Planner-6366f1?style=for-the-badge&logo=airplane&logoColor=white)

**An AI-powered, multi-user travel planning platform built with Next.js, Express, MongoDB, and Google Gemini 2.5 Flash**

[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![Backend](https://img.shields.io/badge/Backend-Express.js-339933?style=flat-square&logo=nodedotjs)](https://expressjs.com)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Authentication & Authorization](#authentication--authorization)
- [AI Integration](#ai-integration)
- [Creative Features](#creative-features)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Folder Structure](#folder-structure)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

---

## 🌍 Overview

**Trao** is a full-stack, AI-powered travel planning application that enables multi-user trip generation, management, and editing. Users can sign up, create personalized travel itineraries using Google Gemini 2.5 Flash, manage packing lists, view hotel recommendations, and assess trip risks — all in a beautiful, responsive interface.

---

## ✨ Features

### Core Features
- 🔐 **Secure Authentication** — JWT-based register/login with bcrypt password hashing
- 🌐 **Multi-user Data Isolation** — Every user sees only their own trips
- 🤖 **AI Itinerary Generation** — Day-by-day plans powered by Gemini 2.5 Flash
- 💰 **Budget Estimation** — Flights, accommodation, food, activities, transport
- 🏨 **Hotel Recommendations** — Budget, mid-range, and premium options
- ✏️ **Editable Itinerary** — Add, edit, remove activities, or regenerate specific days
- 🔍 **Trip Search & Filter** — Find trips by destination and budget tier

### Creative Features
- 🧳 **Weather-Aware Packing Assistant** — Smart, categorized packing checklist with persistent completion state
- ⚠️ **Trip Risk Score** — AI-generated risk assessment with weather, crowd, budget, and travel difficulty scores

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), JavaScript, Tailwind CSS |
| **State Management** | Context API, React Hook Form, Zod |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Authentication** | JWT, bcryptjs |
| **AI** | Google Gemini 2.5 Flash |
| **Security** | Helmet, CORS, Rate Limiting |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Render |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT (Browser)                   │
│              Next.js App Router (Vercel)             │
└─────────────────────┬───────────────────────────────┘
                      │ HTTPS (Axios)
┌─────────────────────▼───────────────────────────────┐
│               REST API (Render)                       │
│         Express.js + Helmet + CORS + JWT              │
│                                                       │
│  /api/auth/*    →  Auth Controller                    │
│  /api/trips/*   →  Trip Controller                    │
│                        │                             │
│            ┌───────────▼──────────┐                  │
│            │   Gemini AI Service  │                  │
│            │  Google Gemini Flash │                  │
│            └──────────────────────┘                  │
└─────────────────────┬───────────────────────────────┘
                      │ Mongoose ODM
┌─────────────────────▼───────────────────────────────┐
│              MongoDB Atlas (Cloud)                    │
│          Users Collection + Trips Collection         │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Installation

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- MongoDB Atlas account
- Google AI Studio API Key

### Clone the Repository
```bash
git clone https://github.com/yourusername/trao.git
cd trao
```

### Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in your environment variables
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env.local
# Fill in your environment variables
npm install
npm run dev
```

---

## 🔧 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/trao
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🔐 Authentication & Authorization

### Authentication Flow
1. User registers with email + password
2. Password is hashed with bcrypt (12 salt rounds)
3. JWT token returned on register/login (7-day expiry)
4. Token stored in localStorage
5. All protected requests send `Authorization: Bearer <token>`

### Authorization
- Every trip is linked to `userId` (ObjectId)
- All trip queries filter by `userId = req.user._id`
- Users cannot read, modify, or delete other users' trips
- Unauthorized: `401`, Forbidden access patterns: `404` (not revealing existence)

---

## 🤖 AI Integration

Trao uses **Google Gemini 2.5 Flash** for:

1. **Trip Itinerary Generation** (`POST /api/trips/generate`)
   - Day-by-day activities with title, description, cost, time
   - Budget breakdown (flights, accommodation, food, activities, transport)
   - Hotel recommendations (budget, mid-range, premium)
   - Packing checklist categorized by type
   - Risk assessment with scores

2. **Day Regeneration** (`PATCH /api/trips/:id/regenerate-day`)
   - Only regenerates the specified day
   - Accepts custom instructions (e.g., "more outdoor activities")
   - Leaves all other days unchanged

### Error Handling
- JSON extraction from malformed responses
- Markdown code block stripping
- Raw JSON object detection
- Graceful fallback with descriptive error

---

## 🎒 Creative Features

### Feature 1: Weather-Aware Packing Assistant
- AI generates categorized packing list based on destination, duration, and interests
- Categories: Documents, Clothing, Electronics, Medicine, Activity Equipment, Weather Essentials
- Users can check/uncheck items — state persisted in MongoDB
- Add custom items and remove existing ones

### Feature 2: Trip Risk Score
- AI generates risk scores (0–100) for:
  - Weather Risk
  - Travel Difficulty
  - Crowd Level
  - Budget Risk
  - Overall Risk Score
- Includes explanation text and 3 travel tips

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login + get JWT | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/auth/forgot-password` | Request password reset token | ❌ |
| POST | `/api/auth/reset-password` | Reset password using token | ❌ |

### Trips
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/trips` | List user trips (search, filter, paginate) | ✅ |
| GET | `/api/trips/:id` | Get trip details | ✅ |
| POST | `/api/trips/generate` | Generate AI trip | ✅ |
| DELETE | `/api/trips/:id` | Delete trip | ✅ |
| PATCH | `/api/trips/:id/add-activity` | Add activity to day | ✅ |
| PATCH | `/api/trips/:id/remove-activity` | Remove activity | ✅ |
| PATCH | `/api/trips/:id/edit-activity` | Edit activity | ✅ |
| PATCH | `/api/trips/:id/regenerate-day` | AI regenerate day | ✅ |
| POST | `/api/trips/:id/packing-list` | Add packing item | ✅ |
| PATCH | `/api/trips/:id/packing-list` | Toggle item complete | ✅ |
| DELETE | `/api/trips/:id/packing-list/:itemId` | Remove packing item | ✅ |

---

## 🚢 Deployment

### Backend → Render
1. Push `backend/` to GitHub
2. Create new **Web Service** on [Render](https://render.com)
3. Connect your repo, set root to `backend/`
4. Build command: `npm install`
5. Start command: `node src/server.js`
6. Add all environment variables from `.env.example`

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set root directory to `frontend/`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com`
5. Deploy!

---

## 📁 Folder Structure

```
Trao/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, env validation
│   │   ├── controllers/     # Auth, Trip controllers
│   │   ├── middleware/      # Auth, error, rate limit, validate
│   │   ├── models/          # User, Trip schemas
│   │   ├── routes/          # Auth, Trip routes
│   │   ├── services/        # Gemini AI service
│   │   ├── utils/           # Response helpers, JWT util
│   │   └── server.js        # Express app entry point
│   ├── .env.example
│   ├── .env
│   ├── render.yaml
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── page.js          # Landing page
│   │   ├── login/page.js    # Login
│   │   ├── register/page.js # Register
│   │   ├── dashboard/page.js
│   │   ├── trips/page.js
│   │   └── trips/[id]/page.js
│   ├── components/          # Reusable UI components
│   ├── context/             # Auth + Trip context
│   ├── services/            # API service layer (Axios)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Zod schemas, utilities
│   ├── .env.local
│   └── package.json
└── docs/
    ├── PROJECT_WORKFLOW.md
    └── IMPLEMENTATION_REPORT.md
```

---

## 🔮 Future Improvements

- [ ] Real-time collaboration with WebSockets
- [ ] Google Maps integration for visual itinerary
- [ ] PDF export of itinerary


---

