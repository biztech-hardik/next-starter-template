# 🌐 Next.js + Sanity CMS – Content Website

This is a modern, SEO-ready content website built using **Next.js (App Router)** and powered by **Sanity CMS** as the backend for dynamic content management.

---

## 🚀 Features

- ⚡ Built with **Next.js 15+** (App Router + Server Components)
- 🧩 Dynamic routing via `[slug]` – no need to manually create new page files
- 🎯 Content managed via **Sanity CMS** (headless API)
- 🛡 SEO-friendly with customizable metadata (`title`, `description`, `canonicalURL`, etc.)
- 🌍 Responsive and fast static generation (ISR or SSG)
- 🔒 Environment variable support for API keys
- ☁️ Easily deployable to **Cloudflare Pages**, **Vercel**, or other providers

---

## 🏗 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Shared layout
│   ├── page.tsx                # Home page (optional)
│   └── [slug]/                 # Dynamic content pages
│       ├── page.tsx
│       └── head.tsx            # SEO metadata
├── components/                 # Reusable UI components
├── lib/
│   └── sanity.ts               # Sanity API integration
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:macroscopic-ventures/website.git
cd your-repo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env.local` File

```env
STRAPI_API_TOKEN=your_sanity_token_here
```

> 🔐 Get your token from Sanity under **API Tokens**.

### 4. Run the Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🛠 Sanity CMS Setup

- Ensure Sanity is running (locally or hosted)
- Create a `Page` collection type with fields:
  - `title` (Text)
  - `slug` (UID)
  - `content` (Rich Text / Components)
  - `metaTitle`, `metaDescription`, `metaImage`, `canonicalURL`, etc.

---

## 🔄 Adding New Pages

New content pages are automatically fetched from Sanity using the `[slug]` route.  
**No front-end code changes are needed** to add new pages.

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## ☁️ Deployment (Cloudflare Pages / Vercel)

- Push to GitHub
- Connect repo in Cloudflare or Vercel dashboard
- Set environment variables
- Deploy!

---

## 🧑‍💻 Author

- **Your Name**
- `your.email@example.com`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).