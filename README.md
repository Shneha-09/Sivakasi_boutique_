# 🌸 Sivakasi Boutique — Full-Stack eCommerce + AI Chatbot

Complete eCommerce platform with **AI Shopping Assistant "Priya"** powered by Claude AI.

---

## 🤖 AI Chatbot Setup (IMPORTANT)

The chatbot requires an **Anthropic API Key**.

### Get your API Key:
1. Go to https://console.anthropic.com
2. Sign up / Log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Add to backend .env:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

## ⚙️ Quick Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your MONGODB_URI and ANTHROPIC_API_KEY
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

---

## 🌐 URLs

| Page | URL |
|------|-----|
| Store | http://localhost:3000 |
| Admin | http://localhost:3000/admin |
| Backend API | http://localhost:5000/api |

**Admin Login:**
- Email: `admin@sivakaasiboutique.com`
- Password: `Admin@123`

---

## 🤖 Chatbot Features

- **AI-powered** by Claude (claude-sonnet-4-6)
- **Product-aware** — reads live product data from your MongoDB
- **Smart suggestions** — context-aware quick replies after each message
- **Quick starters** — one-tap common questions
- **Typing indicator** — animated dots while AI responds
- **Chat history** — remembers last 10 messages per session
- **Unread badge** — shows count when minimized
- **Mobile responsive** — works on all screen sizes
- Named **"Priya"** — warm, fashion-savvy persona
- Understands Tamil + English mixed queries

---

## 🎬 Hero Video

Place `hero-video.mp4` in `frontend/public/` for the video background.
Without it, a beautiful gradient shows automatically.

---

## 📁 Project Structure

```
sivakasi-boutique/
├── backend/
│   ├── models/          User, Product, Order
│   ├── routes/          auth, products, orders, users, dashboard, chatbot
│   ├── middleware/       JWT auth
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── pages/
    │   ├── index.js      Homepage with video hero
    │   ├── shop/         Product listing
    │   ├── product/      Product detail
    │   ├── cart/         Shopping cart
    │   ├── checkout/     Checkout (COD/UPI/Online)
    │   ├── account/      My orders
    │   ├── auth/         Login/Register
    │   └── admin/        Dashboard, Products, Orders, Users
    ├── components/
    │   ├── layout/       Navbar, Footer, StoreLayout
    │   ├── shop/         ProductCard, Chatbot ← AI CHATBOT
    │   └── admin/        AdminLayout
    └── lib/              API client, Zustand stores
```

---

## 🔑 Environment Variables

### backend/.env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sivakasi_boutique
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
ADMIN_EMAIL=admin@sivakaasiboutique.com
ADMIN_PASSWORD=Admin@123
FRONTEND_URL=http://localhost:3000
ANTHROPIC_API_KEY=sk-ant-your-key-here   ← REQUIRED FOR CHATBOT
```

### frontend/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_UPLOADS_URL=http://localhost:5000
```

---

Built with ❤️ for Sivakasi Boutique, Virudhunagar, Tamil Nadu
