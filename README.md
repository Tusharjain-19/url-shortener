# ✂️ SNIPLINK — High-Fidelity URL Archival & Analytics Suite

SNIPLINK is a professional-grade, obsidian-inspired URL management system built for precision, elegance, and deep analytics. Developed as a high-end alternative to generic link shorteners, it treats each link as a curated digital asset.

---

## 🚀 The Essence of SNIPLINK

**SNIPLINK** is more than just a shortener; it's a **Digital Asset Archive**. It takes your long, complex URLs and transforms them into branded, human-readable "Proxy Paths," while simultaneously tracking every interaction with surgical precision.

### 💡 How It Works (The Simple Version)
1. **The Input**: You provide a long URL (e.g., a complex Google Drive link).
2. **The Transformation**: SNIPLINK generates a unique, elegant slug (like `snip.ly/RE9RUB`).
3. **The Redirection**: When someone clicks this link, SNIPLINK instantly logs their metadata (anonymous click time) and redirects them to the destination.
4. **The Intelligence**: Every click feeds into your **Pulse Dashboard**, generating beautiful charts that tell you *exactly* when your links are performing.

---

## 📈 Archival Pulse — Advanced Analytics

SNIPLINK uses an internal engagement scoring engine to calculate the "Archival Health" of your links:

### 1. Retention Velocity ($V_r$)
Calculated as the rate of change of clicks over a rolling 7-day window.
$$V_r = \frac{\Delta C}{\Delta T}$$
*Simple terms: Is the link getting more popular over time?*

### 2. Engagement Density ($D_e$)
Measures click concentration relative to the asset's age.
$$D_e = \log_{10}(C_{total} + 1) / (\text{days since creation})$$
*Simple terms: Is the link "loud" and generating high impact for its age?*

---

## 🎨 Design Philosophy: "Obsidian Edition"

This suite is built with an editorial, premium aesthetic:
- **Typography**: Paired **Syne** (for impact) and **Sora** (for readability).
- **Glassmorphism**: High-transparency UI cards with backdrop blurring.
- **Pulse Filters**: Surgical time-range filters from 24H "Pulse" to 60-day archival trends.
- **Dynamic Synchronicity**: Seamless transitions between Dark (Obsidian) and Light themes.

---

## 🧱 The Metric Dictionary

| Metric | What it means in simple words |
| :--- | :--- |
| **Impressions** | Total number of times your link was successfully clicked. |
| **Pulse** | The "heartbeat" of your link—clicks tracked hour-by-hour for the last 24H. |
| **Proxy Path** | The new, short, and professional name of your link. |
| **Resource Path** | The original, long destination where your content lives. |

---

## 🛠️ Technical Architecture

| Stack | Technology |
| :--- | :--- |
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS + Lucide Icons |
| **Backend** | Supabase (PostgreSQL + Real-time Auth) |
| **Charting** | Recharts (High-Fidelity 4G Graphics) |
| **State** | React Context + TanStack Query |

---

## 👤 Lead Architect

Developed and maintained by **Tushar Jain**.

- **Portfolio**: [tusharjain.in](https://tusharjain.in)
- **Role**: Full-Stack Architect & UI Designer
- **Contact**: [jaint0910@gmail.com](mailto:jaint0910@gmail.com)

---

## 🔧 Deployment & Safety

1. Clone the repository.
2. `npm install`.
3. Configure your local `.env`. 
   > [!IMPORTANT]
   > Ensure you never share your private Supabase keys. A `.env.example` is provided for reference.
4. `npm run dev` to launch the Obsidian Suite.

---

&copy; 2026 SNIPLINK. Built for the modern web by **Tushar Jain**.
