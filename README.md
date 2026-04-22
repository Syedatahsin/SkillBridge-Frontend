# 🎓 SkillBridge

> **Bridging the gap between knowledge and expertise.**

**SkillBridge** is a premium, full-stack education platform designed to bridge the gap between ambitious students and expert mentors. Whether you're looking to master a new skill or share your expertise, SkillBridge provides a seamless, AI-enhanced environment for personalized learning.

Built with a focus on speed, security, and a superior user experience, SkillBridge features instant booking, secure automated payments, and cutting-edge AI tools for automated quiz generation and lesson summarization.


---

## 📸 Showcase

<p align="center">
  <img src="https://kommodo.ai/i/1zRItg2jUprp8KXk177f" alt="SkillBridge Showcase" width="100%" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
</p>

<!-- 
### 📸 More Screenshots

| Home Dashboard | Session Booking | AI Quiz Generation |
| :---: | :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/400x250.png?text=Dashboard) | ![Booking Placeholder](https://via.placeholder.com/400x250.png?text=Session+Booking) | ![AI Quiz Placeholder](https://via.placeholder.com/400x250.png?text=AI+Quiz+Generator) |

| Tutor Profile | Admin Panel | Chatbot |
| :---: | :---: | :---: |
| ![Profile Placeholder](https://via.placeholder.com/400x250.png?text=Tutor+Profile) | ![Admin Placeholder](https://via.placeholder.com/400x250.png?text=Admin+Panel) | ![Chatbot Placeholder](https://via.placeholder.com/400x250.png?text=AI+Chatbot) |
-->

---

## ✨ Key Features

- **📅 1:1 Session Booking:** Instant, real-time booking based on teacher availability.
- **🤖 AI-Powered Chatbot:** 24/7 intelligent platform support and learning guidance.
- **💳 Stripe Integration:** Secure, one-click payments with automated booking confirmation.
- **🧠 AI Quiz Generator:** Automatically generates interactive assessments from session transcripts.
- **📝 AI Smart Notes:** Transforms live lessons into structured revision notes and summaries.
- **🔍 Advanced Discovery:** Multi-criteria search and smart filters to find your ideal mentor.
- **🛡️ Secure Role Access:** Specialized dashboards for Students, Teachers, and Administrators.
- **⭐ Verified Reviews:** A transparent rating system to ensure educational excellence.
- **🌙 Cinematic UI:** Beautiful Dark/Light mode support with premium Framer Motion animations.
- **📱 Fully Responsive:** Optimized for a flawless experience across all devices and screen sizes.
- **⚡ High Performance:** Blazing-fast load times using Next.js App Router and server-side optimizations.

---

## 🛠️ Built With

### Frontend
- **Next.js 15 (App Router)** - React framework for production.
- **TypeScript** - Type safety and improved developer experience.
- **Tailwind CSS** - Modern, utility-first styling.
- **shadcn/ui** - Reusable, accessible UI components.
- **Framer Motion** - Cinematic animations and transitions.

### Backend & Infrastructure
- **Node.js & Express** - Robust backend architecture.
- **Prisma ORM** - Modern database management and type-safe queries.
- **Better Auth** - Secure, scalable authentication solution.
- **Gemini AI** - Powering smart notes and quiz generation.
- **Stripe** - Industry-standard payment processing.

---

## 📚 What challenged me most

Building SkillBridge came with significant technical hurdles, primarily:
- Integrating complex AI APIs for real-time quiz and summary generation.
- Implementing robust Stripe payments with accurate webhooks to handle real-world transactions.
- Building a scalable application architecture to handle separate roles efficiently.
- Managing server and client components without compromising performance.

---

## ⏳ Currently Polishing

Even though the platform is functional, I am actively working on:
- **Making the product faster and smoother** ⚡
- **Adding a more complex role-based system** 👥
- **Improving the UI to feel cleaner and more intuitive** 🎨

---

## 🚀 How to Use It (Getting Started)

### Prerequisites

You will need the following installed:
- [Node.js](https://nodejs.org/en/) (v20+ recommended)
- The backend API repository set up and running on port `5000` (or linked via environment variables).

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <https://github.com/Syedatahsin/SkillBridge-Frontend>
   cd skillbridge-clean
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of your project and configure it. For example:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application in action.

---

## 💬 Feedback & Contributions

I’d genuinely love your feedback and suggestions for improvement! Whether it’s about the UI, features, user experience, or anything you think could make it better, please feel free to open an issue or reach out.

**Designed and Built with passion.**
