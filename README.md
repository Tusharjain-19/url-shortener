# ✂️ SNIPLINK — High-Fidelity URL Archival

SNIPLINK is a professional-grade, obsidian-inspired URL management system built for precision, elegance, and deep analytics. Developed as a high-end alternative to generic link shorteners, it treats each link as a curated digital asset.

---

## 🚀 Key Features

- **Obsidian Aesthetic**: Deep-space dark mode with primary glassmorphism and editorial typography (Syne/Sora).
- **Infinite Archiving**: Manage thousands of links with advanced archival controls.
- **Traffic Intelligence**: Real-time engagement tracking with visual analytics (Area, Line, and Pie charts).
- **Custom Proxy Paths**: Curate your digital presence with human-readable custom slugs.
- **Secure Vault**: Integrated Supabase authentication with password visibility toggles.
- **Dynamic Theming**: Instant Dark/Light mode synchronization via `next-themes`.

---

## 📈 Analytics Intelligence (The "Maths")

SNIPLINK uses an internal engagement scoring engine to calculate the "Archival Health" of your links:

### 1. Retention Velocity ($V_r$)
Calculated as the rate of change of clicks over a rolling 7-day window.
$$V_r = \frac{\Delta C}{\Delta T}$$
*Where $C$ is clicks and $T$ is time in days.*

### 2. Engagement Density ($D_e$)
Measures click concentration relative to the asset's age.
$$D_e = \log_{10}(C_{total} + 1) / (\text{days since creation})$$

---

## 🧱 Technical Architecture

| Stack | Technology |
| :--- | :--- |
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS + Lucide Icons |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **Charting** | Recharts (High-Fidelity) |
| **State** | React Context + TanStack Query |

---

## 👤 Architect Details

Developed and maintained by **Tushar Jain**.

- **Portfolio**: [tusharjain.in](https://tusharjain.in)
- **Vision**: To build software that is as beautiful as it is functional.
- **Role**: Full-Stack Architect & UI Designer

---

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sniplink.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

---

&copy; 2026 SNIPLINK. Built for the modern web.
