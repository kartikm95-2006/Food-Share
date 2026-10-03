# 🍱 FoodShare — Real-Time Community Food Rescue Platform
> **Web & Mobile Development (WMD) Laboratory Mini-Project**  
> Developed for Mumbai University / College Practical Curriculum • **CSE (AIML)**  
> **Student:** Kartik Mahindrakar  

---

## 🌟 Executive Summary

**FoodShare** is a full-stack, real-time web and mobile-responsive food redistribution platform. It bridges the critical gap between food donors (college canteens, hostels, restaurants, and event caterers) and local NGOs/volunteer networks (such as Roti Banks and shelter homes).

By establishing a synchronized digital pipeline, edible surplus meals are claimed, collected, and distributed to communities before expiry, directly mitigating landfill methane emissions and hunger.

---

## 🚀 Live Demo & Quick Start

The platform is pre-configured and running locally on your workstation.

### Running with a Single Command:
From the root directory (`WMD Project`):
```bash
npm run dev
```

Or run frontend and backend independently:

| Component | Directory | Command | URL |
|---|---|---|---|
| **Backend REST API** | `./server` | `npm start` | **http://localhost:5000** |
| **Frontend Web App** | `./client` | `npm run dev` | **http://localhost:5173** |

---

## 🎓 WMD Syllabus Mapping Matrix

FoodShare was engineered specifically to demonstrate core competencies from the **Web and Mobile Development (WMD)** syllabus:

| WMD Syllabus Topic | Implementation in FoodShare | File Reference |
|---|---|---|
| **Frontend (React)** | React 19 functional components, reusable widgets, custom hooks | [`client/src/App.jsx`](file:///c:/Users/Kartik%20Mahindrakar/Desktop/WMD%20Project/client/src/App.jsx) |
| **State Management** | Context API (`AuthContext`) managing user roles, session tokens, and theme | [`client/src/context/AuthContext.jsx`](file:///c:/Users/Kartik%20Mahindrakar/Desktop/WMD%20Project/client/src/context/AuthContext.jsx) |
| **Styling & Responsive UI** | Custom Vanilla CSS design system, Glassmorphism, CSS variables, mobile-first | [`client/src/index.css`](file:///c:/Users/Kartik%20Mahindrakar/Desktop/WMD%20Project/client/src/index.css) |
| **Client-Server & REST APIs** | Express server exposing RESTful CRUD endpoints (`/api/donations`, `/api/claims`) | [`server/index.js`](file:///c:/Users/Kartik%20Mahindrakar/Desktop/WMD%20Project/server/index.js) |
| **Database & Persistence** | Relational SQLite database (`better-sqlite3`) with foreign keys & transaction locks | [`server/db.js`](file:///c:/Users/Kartik%20Mahindrakar/Desktop/WMD%20Project/server/db.js) |
| **Authentication & RBAC** | JWT (JSON Web Tokens) with 3 distinct roles: **Donor**, **NGO**, **Admin** | [`server/middleware/auth.js`](file:///c:/Users/Kartik%20Mahindrakar/Desktop/WMD%20Project/server/middleware/auth.js) |
| **Cross-Platform / Mobile** | Interactive **Smartphone Bezel Simulator Mode** showcasing mobile app layout | [`client/src/components/QuickDemoBar.jsx`](file:///c:/Users/Kartik%20Mahindrakar/Desktop/WMD%20Project/client/src/components/QuickDemoBar.jsx) |
| **Smart Feature (CSE AIML)** | Live expiry urgency classifier that alerts when food has &lt; 2 hours remaining | [`client/src/components/ExpiryTimer.jsx`](file:///c:/Users/Kartik%20Mahindrakar/Desktop/WMD%20Project/client/src/components/ExpiryTimer.jsx) |

---

## 🏗️ Architecture & Data Flow

```text
               ┌────────────────────────────────────────────────────────┐
               │              CLIENT (React 19 + Vite)                  │
               │  • Home Landing & Live Impact Counter                  │
               │  • Explore / Search / Category Filter Engine           │
               │  • Donor Dashboard (Post Food, Live Pickup Tracker)    │
               │  • NGO Dashboard (1-Click Claim, Status Pipeline)      │
               │  • Admin Portal (Database Overrides, Audit Logs)       │
               │  • Simulated Mobile Frame / Full Desktop View Switcher │
               └───────────────────────────┬────────────────────────────┘
                                           │
                              HTTP / REST JSON (JWT Auth)
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │              BACKEND (Node.js + Express)               │
               │  • /api/auth (Login, Register, Role Verification)      │
               │  • /api/donations (Browse, Filter, CRUD operations)    │
               │  • /api/claims (Claim batch, State transitions)        │
               │  • /api/stats (Impact counters, Admin audit logs)      │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                      SQL Queries
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │            DATABASE (SQLite3: foodshare.db)            │
               │  • users (id, name, email, role, organization)         │
               │  • donations (id, donor_id, food_name, qty, status)    │
               │  • claims (id, donation_id, ngo_id, pickup_time)       │
               │  • activity_logs (audit trail of all state changes)    │
               └────────────────────────────────────────────────────────┘
```

---

## 🔄 The Food Rescue Lifecycle (State Machine)

Every batch of food moves through a deterministic status pipeline:

```text
  [AVAILABLE] ──────────► [CLAIMED] ──────────► [PICKED UP] ──────────► [COMPLETED]
Donor posts surplus     NGO locks batch        Volunteer collects     Food distributed;
with expiry window      & dispatches van       food from donor        impact counters update!
```

---

## ⚡ 1-Click Viva Demo Accounts

A dedicated **Viva Demo Controller** bar is embedded at the top of the app:

| Role | Account Name | Email | Password | Primary Actions |
|---|---|---|---|---|
| **Donor** | Kartik Mahindrakar | `kartik@foodshare.org` | `donor123` | Post surplus food, set expiry window, track pickup |
| **Donor** | APSIT Central Canteen | `canteen@apsit.edu.in` | `canteen123` | Post bulk breakfast/lunch leftovers |
| **NGO** | Helping Hands Foundation | `ngo@helpinghands.org` | `ngo123` | Browse nearby food, claim batch, advance to picked up |
| **NGO** | Roti Bank Volunteers | `rotibank@thane.org` | `roti123` | Claim bakery and dinner packs, complete distribution |
| **Admin** | Faculty / Council Admin | `admin@foodshare.org` | `admin123` | Inspect SQLite tables, override statuses, audit logs |

---

## 🎯 Step-by-Step Viva Presentation Script

When presenting to your professors or external examiner, follow this 5-minute story:

1. **Introduction & Mission:**
   > *"Good morning professors. My WMD project is **FoodShare**, a real-time web platform designed to eliminate surplus food waste and connect canteens with local NGOs across Thane."*

2. **Demonstrate Donor Flow:**
   - Click **"Kartik (donor)"** on the top controller bar.
   - Click **"+ Donate Food"**.
   - Enter *"Fresh Vegetable Dum Biryani"*, quantity *25 meals*, choose the *"⏱️ 45 mins (Urgent demo)"* expiry preset.
   - Click **"Publish Donation 🚀"**. Notice the live card appear immediately with a blinking **"Expiring Soon"** badge.

3. **Demonstrate NGO Discovery & Claiming:**
   - Click **"Helping Hands (ngo)"** on the top controller bar.
   - Switch to **"Find Food"** tab. The Biryani batch is immediately visible.
   - Click **"Claim Food"** ➔ Click **"Confirm Claim 🤝"**.
   - Notice status changes instantly from **AVAILABLE** ➔ **CLAIMED**.

4. **Demonstrate Pickup & Distribution:**
   - In the NGO Portal, click **"Mark Picked Up 🚚"** (status changes to **PICKED UP**).
   - Once handed over to the community, click **"Mark Delivered 🎉"** (status changes to **COMPLETED**).
   - Go to the **Impact** tab: show how the *Meals Rescued*, *Kg of Food Saved*, and *CO2e Greenhouse Emissions Averted* update dynamically!

5. **Demonstrate Admin & SQLite Database Oversight:**
   - Click **"Faculty (admin)"** on the top bar.
   - Show the **Admin Dashboard**: display the full database records, user directory, and the real-time activity log showing the exact timestamps of the donation and claim.
   - Toggle the **"Mobile Frame"** button on the top controller to prove mobile app responsiveness and layout adaptation!

---

## ❓ Common Viva Questions & Answers

**Q1: Why did you use Node.js Express and SQLite instead of Firebase?**  
> *"Node.js and Express allow us to build standard REST API endpoints, custom middleware for JWT authentication, and relational SQLite persistence with ACID transactions. It demonstrates the complete Client-Server paradigm required by the WMD syllabus without relying on black-box cloud services."*

**Q2: How is real-time status updated across users?**  
> *"When an NGO claims a donation, the backend executes an atomic SQLite transaction updating both the `claims` and `donations` records, and writes an entry to `activity_logs`. The client application refetches state and transitions the lifecycle tracker instantly."*

**Q3: What makes this relevant to CSE (AIML)?**  
> *"We implemented a dynamic urgency algorithm that monitors expiration windows. If a batch is within 120 minutes of expiry, the system flags it as urgent, increases its priority in search ranking, and alerts active volunteers to prevent waste."*

**Q4: How does the application ensure mobile responsiveness?**  
> *"The frontend uses a modern CSS token system with responsive flexbox and grid units (`clamp()`, `minmax()`), media queries, and touch-friendly interactive targets. You can inspect it directly using the 'Mobile Frame' toggle to see it formatted inside a smartphone viewport."*

---

## 📁 Repository Structure

```
WMD Project/
├── client/                     # Frontend (React 19 + Vite)
│   ├── src/
│   │   ├── components/         # Reusable widgets (Navbar, Badges, Modals, Timers)
│   │   ├── context/            # AuthContext & Session management
│   │   ├── pages/              # Home, Explore, Donor, NGO, Admin, Impact, Auth
│   │   ├── api.js              # Fetch wrapper connecting to backend
│   │   ├── index.css           # Vanilla CSS design tokens & animations
│   │   └── App.jsx             # Main router and modal coordinator
│   └── vite.config.js          # Vite config with API proxy
├── server/                     # Backend (Node.js + Express)
│   ├── routes/                 # auth.js, donations.js, claims.js, stats.js
│   ├── middleware/             # auth.js (JWT verification & Role guard)
│   ├── db.js                   # SQLite database setup & seed data
│   ├── foodshare.db            # SQLite database file
│   └── index.js                # Express app entrypoint (Port 5000)
└── package.json                # Root orchestration script
```

---
*Created for Kartik Mahindrakar • A.P. Shah Institute of Technology • WMD Laboratory*
