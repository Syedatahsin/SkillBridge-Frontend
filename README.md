# 🌟 SkillBridge

> **Bridging the gap between knowledge and expertise.** <br>
> SkillBridge is a premium, high-performance platform connecting passionate students with professional mentors and educators for seamless 1-on-1 online learning.

![SkillBridge Banner](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop)

---

## 🚀 Overview

SkillBridge is built with a modern, scalable web architecture designed to deliver an unparalleled user experience. It features robust role-based access control, real-time scheduling mechanisms, secure payments, and interactive data visualization—all wrapped in a sleek, glassmorphic UI powered by cutting-edge animations.

### ✨ Key Features

- **🛡️ Tri-Role Architecture**: Dedicated, secure environments for **Students**, **Teachers**, and **Admins**.
- **📅 Smart Booking Engine**: Conflict-free session reservations with real-time slot locking, ensuring no double bookings.
- **📊 Interactive Analytics Dashboards**: Visual data representations using Recharts tracking revenue, class momentum, and demographic engagement.
- **💬 Verified Review System**: Authentic feedback and global rating aggregations calculated purely from confirmed sessions.
- **🎨 State-of-the-Art Aesthetic**: Deep Tailwind CSS integration featuring fluid container layouts, vibrant dark/light modes, and Framer Motion micro-animations.
- **🔒 Role-Based Access Control (RBAC)**: Secure access gating using `better-auth` combined with strict backend and frontend middleware.

---

## 🛠️ Technology Stack

**SkillBridge Frontend** uses the latest, most performant frameworks available in the React ecosystem:

- **Framework**: [Next.js 16 (App Router + Turbopack)](https://nextjs.org/)
- **Core Library**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charting Engine**: [Recharts](https://recharts.org/)
- **Authentication**: [Better-Auth](https://github.com/better-auth/better-auth)
- **Forms & Validation**: TanStack Form & Zod
- **Icons**: Lucide React & React Icons

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── (dashboard)/        # Protected application layers
│   │   ├── admin/          # Global management & analytics override
│   │   ├── student/        # Learning and reservation hub
│   │   ├── teacher/        # Schedule management & revenue tracking
│   │   └── (public)/       # Open catalog: Find Tutors, About, Contact
│   ├── login/              # Authentication flows
│   └── globals.css         # Global tailwind imports & design tokens
├── components/
│   ├── ui/                 # Reusable Shadcn base primitives
│   ├── sessionglasscard/   # High-fidelity dashboard layouts 
│   ├── TutorClient/        # Unified Mentor profile representations
│   └── DashboardOverview/  # Complex charting & metric components
└── lib/
    ├── auth-client.ts      # Better-Auth integration
    └── utils.ts            # Tailwind merging & shared utilities
```

---

## 🎯 Role Capabilities

### 🧑‍🎓 Students
- Browse the public directory of verified, professional Tutors.
- Instantly verify availability and reserve calendar slots.
- Manage upcoming classes with embedded meeting links.
- Submit verified reviews and rate learning experiences.

### 👨‍🏫 Teachers
- Manage calendar availabilities using intuitive scheduling interfaces.
- Approve, review, and mark finalized classes as "Completed".
- Monitor lifetime earnings and visualize momentum via the Revenue chart.
- Showcase a dynamic public profile highlighting expertise, pricing, and authentic testimonials.

### 👨‍💻 Administrators
- Oversee total platform analytics (Global user demographic splits).
- Promote standout educators with the "Featured" profile flag.
- Enforce community guidelines via active moderation tools (Ban/Unban users).

---

## ⚙️ Local Development

### Prerequisites
- Node.js (v20+ recommended)
- The accompanying Backend API Repository running locally on port `5000` (or linked via Vercel).

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd skillbridge-clean
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🤝 Contributing
Features and updates are implemented using a strict component-first methodology. Ensure that any new UI elements align with the global dark-mode design system and Tailwind styling conventions before submitting improvements.

## 📄 License
Designed and Developed by **Syeda Anika Tahsin**. All rights reserved.
