# Rio Al Fandi — Portfolio Website

Website portofolio fullstack dengan gaya terminal/scramble, single-page scroll, dan panel admin.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Google OAuth
- **Email**: Resend API
- **Font**: JetBrains Mono

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd portfolio
npm install
```

### 2. Setup Supabase

1. Buka [supabase.com](https://supabase.com) dan buat project baru
2. Masuk ke **SQL Editor**
3. Copy seluruh isi file `supabase-schema.sql` dan jalankan
4. Pergi ke **Project Settings → API** dan copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Setup Google OAuth di Supabase

1. Di Supabase dashboard → **Authentication → Providers → Google**
2. Enable Google provider
3. Buka [Google Cloud Console](https://console.cloud.google.com)
4. Buat OAuth 2.0 credentials
5. Tambahkan authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
6. Copy Client ID dan Secret ke Supabase

### 4. Setup Environment Variables

```bash
cp .env.local.example .env.local
```

Isi `.env.local` dengan nilai yang sudah didapat:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
RESEND_API_KEY=re_M1KGQfTs_N24PrRPZbf3gnZzjTYdRWmuT
CONTACT_EMAIL=riiooalfandi@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 📁 Struktur Halaman

### Publik (Single Scroll Page)
| Section | ID | Keterangan |
|---------|-----|-----------|
| Landing | `#home` | Nama, intro, 3D flip photo card |
| Projects | `#projects` | Infinite 3D carousel |
| About | `#about` | System logs, circuit diagram, contact |

### Admin (Private)
| URL | Fungsi |
|-----|--------|
| `/admin/login` | Google OAuth login |
| `/admin` | Dashboard & stats |
| `/admin/projects` | CRUD projects |
| `/admin/inbox` | Baca pesan masuk |
| `/admin/profile` | Edit profil & about |

---

## 🗄 Database Schema

### Tabel `profile`
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `full_name` | VARCHAR | Nama lengkap |
| `short_intro` | TEXT | Tagline di landing |
| `photo_front_url` | VARCHAR | URL foto profil |
| `photo_back_metadata` | JSONB | Data kartu belakang (status, role, dll) |

### Tabel `projects`
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `title` | VARCHAR | Judul project |
| `slug` | VARCHAR | URL-friendly slug |
| `overview` | TEXT | Ringkasan (di kartu carousel) |
| `problem_statement` | TEXT | Masalah yang diselesaikan |
| `tech_stack` | JSONB | Array tools |
| `architecture_image` | VARCHAR | URL diagram arsitektur |
| `technical_challenge` | TEXT | Tantangan teknis |
| `key_metrics` | JSONB | Array angka keberhasilan |
| `repo_url` | VARCHAR | Link GitHub |
| `demo_url` | VARCHAR | Link live demo |
| `is_featured` | BOOLEAN | Muncul di paling atas |
| `priority_order` | INT | Urutan di carousel |

### Tabel `about_contact`
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `about_logs` | JSONB | Timeline karir |
| `tech_circuits` | JSONB | Skills & koneksi tools |
| `github_url` | VARCHAR | Link GitHub |
| `linkedin_url` | VARCHAR | Link LinkedIn |
| `resume_url` | VARCHAR | Link CV PDF |
| `contact_email` | VARCHAR | Email kontak |

### Tabel `messages`
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `sender_name` | VARCHAR | Nama pengirim |
| `sender_email` | VARCHAR | Email pengirim |
| `subject` | VARCHAR | Subjek pesan |
| `message` | TEXT | Isi pesan |
| `is_read` | BOOLEAN | Status baca |

---

## 🎨 Fitur Visual

- **Binary Wave Background** — Animasi karakter 0/1 bergelombang menggunakan Canvas
- **Water Ripple** — Efek gelombang air saat klik (seperti air disentuh)
- **Custom Cursor** — Kursor blok putih dengan mix-blend-mode
- **Scramble Text** — Teks teracak saat hover/load
- **3D Flip Card** — Foto berputar 180° saat hover
- **Infinite 3D Carousel** — Project cards dengan efek silinder
- **CLI Contact Form** — Pop-up seperti terminal untuk kirim pesan
- **Project Modal** — Detail project lengkap di pop-up window

---

## 🚢 Deployment (Vercel) 

```bash
# Push ke GitHub dulu, lalu:
# 1. Import project di vercel.com
# 2. Tambahkan semua environment variables
# 3. Deploy!
```

Setelah deploy, update `NEXT_PUBLIC_APP_URL` ke URL Vercel kamu.

---

## 📧 Email Setup

Resend API key sudah dikonfigurasi. Semua pesan dari form contact akan:
1. Tersimpan di tabel `messages` di Supabase
2. Dikirim ke `riiooalfandi@gmail.com`

> **Note**: Dengan free tier Resend, email dikirim dari `onboarding@resend.dev`. 
> Untuk custom domain sender, verifikasi domain di dashboard Resend.
