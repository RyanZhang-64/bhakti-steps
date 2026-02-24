# Bhakti Steps App

Bhakti Steps is a mobile-first mentorship and spiritual progress tracking platform for ISKCON London devotees. It connects **Admins**, **Mentors**, and **Mentees** in a structured, invite-only environment.

This repository contains the frontend application built with **Expo (React Native)**. The backend is powered by **Supabase** (PostgreSQL, Auth, Storage, and Edge Functions) without requiring a custom application server.

---

## 🛠 Tech Stack Overview

| Layer | Technology |
|---|---|
| **Frontend** | Expo (React Native) — iOS 14+ and Android 10+ |
| **Backend & Database** | Supabase (PostgreSQL with Row Level Security) |
| **Authentication** | Supabase Auth (Email/password, Invite Links, JWT role claims) |
| **Push Notifications** | Expo Notifications + Supabase Edge Functions |

---

## 📂 Project Structure

This project follows a feature-centric structure using **Expo Router**:

```
src/
├── app/          # Application screens & routing (e.g. (mentor)/dashboard, (mentee)/sadhana)
├── components/   # Reusable UI elements (ui/, forms/, cards/)
├── lib/          # Core configurations (e.g. Supabase client initialization)
├── services/     # Database queries and API calls separated from UI components
├── types/        # TypeScript interfaces mirroring the database schema
├── constants/    # Static data and theme configurations
└── utils/        # Helper functions (date formatting, streak calculations)
```

---

## 🚀 Getting Started

### 1. Prerequisites & Accounts

Ensure you have the following installed and set up:

- **Node.js** (v18+) and npm/yarn
- **Expo Account**: Create a free account at [expo.dev](https://expo.dev) and install the **Expo Go** app on your physical testing device
- **Supabase Account**: Access to the project's Supabase dashboard or a local instance running via the Supabase CLI

---

### 2. Backend Setup (Supabase Dashboard)

Before running the database scripts, configure the following in your Supabase project settings:

- **Enable Data API**: Ensure the Data API is enabled to allow the Expo app to communicate directly with the database
- **Enable Automatic RLS**: Turn this on to ensure all new tables default to being secure
- **Disable Open Sign-ups**: Go to *Authentication > Providers > Email* and turn off "Allow new users to sign up" to enforce the invite-only requirement

---

### 3. Database Schema & Security (SQL)

Run the following script in your **Supabase SQL Editor** to generate the schema and enforce Row Level Security (RLS):

<details>
<summary><b>Click to expand SQL Setup Script</b></summary>

```sql
-- 1. Create Reference Tables
CREATE TABLE spiritual_masters (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL UNIQUE, active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE departments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL UNIQUE, active BOOLEAN DEFAULT true, sort_order INT DEFAULT 0, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE course_categories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL UNIQUE, active BOOLEAN DEFAULT true, sort_order INT DEFAULT 0, created_at TIMESTAMPTZ DEFAULT now());

-- 2. Create Core Tables
CREATE TABLE users (id UUID PRIMARY KEY REFERENCES auth.users, email TEXT UNIQUE NOT NULL, role TEXT CHECK (role IN ('admin', 'mentor', 'mentee')), full_name TEXT, initiated_name TEXT, phone TEXT, dob DATE, address TEXT, home_temple TEXT, is_initiated BOOLEAN, initiation_year INT, japa_target INT, avatar_url TEXT, spiritual_master_id UUID REFERENCES spiritual_masters(id), created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE batches (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), mentor_id UUID REFERENCES users(id), name TEXT NOT NULL, schedule TEXT, location TEXT, status TEXT CHECK (status IN ('pending_approval', 'active', 'inactive')), created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE batch_memberships (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), batch_id UUID REFERENCES batches(id), mentee_id UUID REFERENCES users(id), joined_at TIMESTAMPTZ DEFAULT now(), left_at TIMESTAMPTZ, updated_at TIMESTAMPTZ DEFAULT now());

-- 3. Create Tracking Tables
CREATE TABLE sadhana_logs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id), date DATE NOT NULL, rounds INT, mangala_arati BOOLEAN, japa_session BOOLEAN, guru_puja BOOLEAN, bg_class BOOLEAN, tulasi_puja BOOLEAN, evening_kirtana BOOLEAN, mood TEXT, notes TEXT, score INT, created_at TIMESTAMPTZ DEFAULT now(), UNIQUE (user_id, date));
CREATE TABLE prabhupada_books (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, category TEXT, published_year INT, active BOOLEAN DEFAULT true);
CREATE TABLE sadhana_book_readings (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), sadhana_log_id UUID REFERENCES sadhana_logs(id) ON DELETE CASCADE, book_id UUID REFERENCES prabhupada_books(id), duration_minutes INT CHECK (duration_minutes > 0), created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE service_logs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id), date DATE NOT NULL, department_id UUID REFERENCES departments(id), description TEXT, duration_hours NUMERIC, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE push_tokens (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) NOT NULL, token TEXT NOT NULL, platform TEXT CHECK (platform IN ('android', 'ios')) NOT NULL, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now());

-- 4. Enforce Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sadhana_logs ENABLE ROW LEVEL SECURITY;

-- User Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Mentors can view their mentees" ON users FOR SELECT USING (EXISTS (SELECT 1 FROM batch_memberships bm JOIN batches b ON bm.batch_id = b.id WHERE bm.mentee_id = users.id AND b.mentor_id = auth.uid()));
CREATE POLICY "Admins have full access" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Sadhana Log Policies
CREATE POLICY "Users can manage own sadhana" ON sadhana_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Mentors can view mentees sadhana" ON sadhana_logs FOR SELECT USING (EXISTS (SELECT 1 FROM batch_memberships bm JOIN batches b ON bm.batch_id = b.id WHERE bm.mentee_id = sadhana_logs.user_id AND b.mentor_id = auth.uid()));
CREATE POLICY "Admins can view all sadhana" ON sadhana_logs FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
```

</details>

---

### 4. Frontend Setup

**Clone the repository:**

```bash
git clone <repository-url>
cd bhakti-steps
```

**Install dependencies** (including Supabase and AsyncStorage for session persistence):

```bash
npm install
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
```

**Environment Variables:**

Copy the `.env.example` file, rename it to `.env`, and populate it with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Supabase Client Initialization:**

Ensure `src/lib/supabase.ts` is configured to use AsyncStorage to maintain sessions across app restarts:

```typescript
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

### 5. Running the App

Start the Expo development server:

```bash
npx expo start
```

Scan the QR code shown in the terminal using the **Expo Go** app on your physical device.

---

## 🔒 Authentication Flow Notes

This app has **no open sign-up screen**. To test locally, you must:

1. Create a user in the **Supabase Auth dashboard**
2. Assign them a role in the `users` table
3. Log in with email/password
