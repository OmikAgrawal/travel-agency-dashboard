# ✈️ TravelPro: AI-Powered Travel Architect & Marketplace

TravelPro is a modern, full-stack web application that transforms traditional vacation discovery into an intelligent, automated experience. Built with a robust **Node.js/Express** backend and an interactive **React/Tailwind CSS** client, the platform leverages the **Google Gemini 3 Flash LLM Engine** to dynamically construct multi-day detailed itineraries, alongside integrated third-party media workflows via the **Unsplash API** to automate asset provisioning.

---

## 🚀 Core Architecture Features

* **Dual-Portal Role-Based Access Control (RBAC):** Gated environment using secure JSON Web Tokens (JWT) and Bcrypt cryptographic hashing. Secure table-level separation routes Admins to analytical management utilities and Standard Users directly to consumer marketplace flows.
* **Generative AI Itinerary Engine:** Integrates the Google Gemini 3 Flash API using precise structured response constraints to compile customized travel packages based on varying location criteria and distinct "vibes".
* **Automated Visual Asset Provisioning:** Interfaces dynamically with the Unsplash Developer API at package generation time, scraping top landscape landmarks matching target coordinates to keep performance values fast and protect vendor request thresholds.
* **Structured Document Database Storage:** Leverages advanced PostgreSQL storage attributes—specifically utilizing **JSONB structural components** for dynamic multi-day timeline storage arrays and **TEXT string arrays** for gallery visual layers.
* **Proactive Client Session Guards:** Implements base64 binary decoding strategies directly inside root component hooks on mount frames to clean up dead or expired authentication variables before cascading down to underlying resource endpoints.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI Client** | React.js, Tailwind CSS, Lucide Icons, Framer Motion, Axios |
| **Backend Core Engine** | Node.js, Express.js, JWT, Bcrypt |
| **Database System** | PostgreSQL (Relational Mapping, JSONB, Array Column Types) |
| **Third-Party APIs** | Google Gemini 3 Flash LLM API, Unsplash Photo Discovery API |

---

## 📦 System Installation & Local Setup

### 1. Prerequisites
Ensure you have the following installed locally on your machine:
* **Node.js** (v18.x or above)
* **PostgreSQL Engine** (Running instance)

### 2. Database Schema Setup
Log in to your local PostgreSQL terminal instance and create your underlying storage environment:

```sql
CREATE DATABASE travelpro;

-- Users Registry Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Accounts Registry Table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI-Generated Trips Packages Table
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price NUMERIC(10, 2),
    itinerary JSONB,          -- Stores dynamic day-by-day itineraries
    images TEXT[],           -- Stores multiple asset photo URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Centralized Customer Bookings Table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Confirmed',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, trip_id)  -- Prevents duplicate package bookings
);
