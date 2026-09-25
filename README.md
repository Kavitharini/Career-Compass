# 🧭 Career Compass — AI-Powered Career Guidance & Skill Development Platform

[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20%2F%207.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

> **Navigate Your Career With Confidence.**  
> Discover the right career path, identify skill gaps, optimize your resume with ATS scoring, and execute a structured step-by-step roadmap to achieve your dream role.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Application Workflow](#-application-workflow)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [AI Engine & Fallback Architecture](#-ai-engine--fallback-architecture)
- [UI & Theme Support](#-ui--theme-support)
- [Contributing & License](#-license)

---

## 🌟 Overview

**Career Compass** is a full-stack, AI-native career guidance and upskilling platform engineered specifically for college students, fresh graduates, and early-career professionals. 

Job seekers often struggle with:
1. Identifying which technology career paths match their true strengths.
2. Knowing the exact delta between their academic knowledge and enterprise market expectations.
3. Overcoming Applicant Tracking System (ATS) rejection filters due to weak resume phrasing and missing keywords.
4. Finding a structured, actionable step-by-step roadmap to close skill gaps.

Career Compass bridges this gap by combining the intelligence of **Google Gemini 3.8 Flash** with persistent student profiling, rigorous skill comparison engines, and interactive resume diagnostic tools.

---

## 🚀 Key Features

### 1. 🎯 AI Career Recommendations
- Analyzes candidate background (education, degree, experience level, technical skills, soft skills, and interests).
- Evaluates tech, data, cloud, software engineering, AI/ML, security, and devops disciplines.
- **Strict Compatibility Filter**: Recommends **all viable career paths with a compatibility score > 50%**, dynamically sorted by alignment score.
- Detailed career cards featuring salary projections, industry demand, matching vs. missing competencies, and typical day-to-day responsibilities.
- **One-Click Target Role Selection**: Instantly sets your active career objective and synchronizes downstream roadmaps and resume scoring.

### 2. 🔍 Real-Time Skill Gap Analysis
- Deep comparative audit comparing the user's current skill profile against the enterprise requirements for their target role.
- Skills partitioned into three clear categories:
  - 🟢 **Already Strong**: Verified competencies matching or exceeding role requirements.
  - 🟡 **Needs Improvement**: Fundamental knowledge present, but requires enterprise-depth practice.
  - 🔴 **Missing**: Essential technologies required for entry that the user has not yet learned.
- Overall **Readiness Score** indicating career preparedness.

### 3. 🗺️ 5-Phase Interactive Learning Roadmap
- Automatically generates a 5-phase progressive curriculum:
  1. **Phase 1: Foundations** — Core programming, database paradigms, and fundamentals.
  2. **Phase 2: Intermediate Skills** — Frameworks, data pipelines, distributed systems, and tooling.
  3. **Phase 3: Advanced Skills** — Cloud infrastructure, workflow orchestration, and CI/CD.
  4. **Phase 4: Capstone Projects** — Portfolio-grade, real-world applications with suggested architecture.
  5. **Phase 5: Technical Interview Prep** — System design, live whiteboard challenges, and STAR behavioral methods.
- **Interactive Progress Tracking**: Check off completed learning units with instant progress recalculation persisted to your profile.

### 4. 📄 AI Resume Analyzer & ATS Score Evaluator
- Upload your resume (PDF file) or paste raw resume text.
- Generates a simulated **ATS Compatibility Score (0–100)**:
  - If no resume has been uploaded yet, the dashboard explicitly shows **"Resume not uploaded"** with an invitation to analyze your credentials.
- In-depth diagnostic report:
  - **ATS Keyword Analysis**: Detected keywords, critical missing keywords for the target role, and repetitive words.
  - **Strengths & Weaknesses**: Structural formatting, section separation, and content density review.
  - **Before & After Bullet Rewrites**: Real examples demonstrating how to transform passive bullets (e.g., *"Worked on database"*) into quantifiable XYZ-impact statements (e.g., *"Designed normalized PostgreSQL schemas and indexed key query paths, reducing API response times by 40%"*).
  - **Resume Skill Gap**: Pinpoints exact technical skills missing from the resume and advises where to showcase them.

### 5. 🎓 Curated Certification & Course Directory
- Categorized learning resources and industry-recognized certifications (AWS, Google Cloud, Meta, Microsoft, freeCodeCamp, Coursera).
- Filter by skill tag, difficulty level (Beginner, Intermediate, Advanced), and duration.
- Direct links to authoritative documentation and learning tracks.

### 6. 🤖 Context-Aware AI Career Assistant
- Real-time conversational AI mentor grounded in your personal data.
- Aware of your active target role, verified skills, identified skill gaps, and latest resume ATS report.
- Provides personalized coaching, interview question simulations, and portfolio project suggestions.

### 7. 🌓 Dark / Light Mode & Modern SaaS Aesthetic
- Built with a fluid, accessible UI using Tailwind CSS v4.
- One-click toggle between dark and light themes with preference persistence.
- Responsive across mobile, tablet, and desktop viewports.

---

## 🔄 Application Workflow

```text
       ┌───────────────────────────────┐
       │         Landing Page          │
       │   (Hero, Features, Showcase)  │
       └──────────────┬────────────────┘
                      ▼
       ┌───────────────────────────────┐
       │   Authentication & Sign Up    │
       │   (Register / Login / Demo)   │
       └──────────────┬────────────────┘
                      ▼
       ┌───────────────────────────────┐
       │     Profile Setup Wizard      │
       │ (Fresh Selection: Skills,     │
       │  Education, Target Interests) │
       └──────────────┬────────────────┘
                      ▼
       ┌───────────────────────────────┐
       │   AI Career Recommendations   │
       │    (All Roles with Score > 50%)│
       └──────────────┬────────────────┘
                      ▼
       ┌───────────────────────────────┐
       │      Select Target Role       │
       └──────────────┬────────────────┘
                      ▼
         ┌────────────┴────────────┐
         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│  Skill Gap Audit │      │ Resume Analyzer  │
│  & 5-Phase Plan  │      │ & ATS Score      │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         └────────────┬────────────┘
                      ▼
       ┌───────────────────────────────┐
       │     Personalized Dashboard    │
       │  (Metrics, Roadmap Tracking,  │
       │   Resume Status, Launchpad)   │
       └──────────────┬────────────────┘
                      ▼
       ┌───────────────────────────────┐
       │   AI Career Assistant Chat    │
       │  (Context-Aware 1-on-1 Mentor)│
       └───────────────────────────────┘
```

---

## 💻 Tech Stack

### Frontend
- **React 19** (`react`, `react-dom`) — Latest React version with optimized client-side rendering.
- **TypeScript** — End-to-end type safety for all user, role, and analysis schemas.
- **Vite 8** — Ultra-fast frontend development and production bundling.
- **Tailwind CSS v4** — High-performance utility CSS engine with native CSS variables and dark mode support.
- **Lucide React** — Modern, consistent icon set.
- **Motion** — Smooth animations and modal transitions.

### Backend
- **Node.js & Express 4** — Lightweight, robust API server.
- **tsx** — Direct execution of TypeScript on the backend without manual compilation steps.
- **Vite Middlewares** — Seamless full-stack single-port development experience (port 3000).
- **JSON File-Based Store (`/data/db.json`)** — Fast local data persistence for accounts, sessions, and analysis results.

### AI Integration
- **`@google/genai` (v2.4.0)** — Modern Google Gen AI TypeScript SDK.
- **Gemini 3.8 Flash** (`gemini-3.8-flash`) — Ultra-low latency, high reasoning intelligence for profile evaluation, ATS parsing, and conversational mentoring.
- **Zero-Failure Fallback System** — Comprehensive built-in curated intelligence algorithms that guarantee uninterrupted platform performance even when offline or before configuring an API key.

---

## 📁 Project Architecture

```text
career-compass/
├── data/
│   └── db.json                   # Local data store (users, sessions, roadmaps)
├── public/                       # Static public assets
├── src/
│   ├── components/
│   │   ├── assistant/            # AI Career Assistant chat interface
│   │   │   └── CareerAssistantPage.tsx
│   │   ├── auth/                 # Login & Registration modal
│   │   │   └── AuthModal.tsx
│   │   ├── careers/              # Career recommendations & role details
│   │   │   ├── CareerRecommendationsPage.tsx
│   │   │   └── JobRoleDetailPage.tsx
│   │   ├── certifications/       # Course catalog & external certifications
│   │   │   └── CertificationsPage.tsx
│   │   ├── common/               # Reusable UI primitives (MetricCard, LoadingState, etc.)
│   │   │   ├── Badge.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── dashboard/            # Core student dashboard & launchpad
│   │   │   └── DashboardPage.tsx
│   │   ├── landing/              # Public landing page with features showcase
│   │   │   └── LandingPage.tsx
│   │   ├── layout/               # Header navbar, theme switch, & sidebar navigation
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── profile/              # User profile & onboarding wizard
│   │   │   ├── ProfilePage.tsx
│   │   │   └── ProfileSetupWizard.tsx
│   │   ├── resume/               # Resume upload, ATS scoring & rewrite engine
│   │   │   └── ResumeAnalyzerPage.tsx
│   │   ├── roadmap/              # 5-phase career upskilling roadmap
│   │   │   └── LearningRoadmapPage.tsx
│   │   └── skills/               # Skill gap breakdown & comparison matrices
│   │       └── SkillGapPage.tsx
│   ├── context/
│   │   ├── AuthContext.tsx       # Authentication & user state management
│   │   └── ThemeContext.tsx      # Dark / Light mode provider & persistence
│   ├── types/
│   │   ├── career.ts             # Domain models (JobRole, SkillGap, ResumeAnalysis, User)
│   │   └── index.ts
│   ├── App.tsx                   # Main route switch & application shell
│   ├── index.css                 # Tailwind CSS v4 entry point
│   └── main.tsx                  # React DOM mount point
├── .env.example                  # Environment configuration template
├── metadata.json                 # AI Studio applet specifications
├── package.json                  # Dependencies and execution scripts
├── server.ts                     # Express server, Vite middleware & Gemini AI endpoints
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite build and plugin configuration
```

---

## 📡 API Reference

All requests requiring authentication accept the standard `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Auth Required |
|:-------|:---------|:------------|:-------------:|
| `POST` | `/api/auth/register` | Create a new user account with clean initial state | No |
| `POST` | `/api/auth/login` | Log in with email and password | No |
| `POST` | `/api/auth/demo-login` | 1-Click instant demo login for exploration | No |
| `GET`  | `/api/auth/me` | Fetch active authenticated user profile | Yes |
| `POST` | `/api/auth/logout` | Invalidate current user session | Yes |
| `POST` | `/api/user/profile` | Update profile attributes, skills, and interests | Yes |
| `POST` | `/api/user/target-role` | Update the user's chosen target job role | Yes |
| `POST` | `/api/user/roadmap-progress` | Toggle completion status of a roadmap task | Yes |
| `POST` | `/api/ai/recommend-careers` | Compute matching career roles with score > 50% | Optional |
| `POST` | `/api/ai/skill-gap` | Compare current skills against target role demands | Optional |
| `POST` | `/api/ai/analyze-resume` | Evaluate resume text/PDF, compute ATS score & rewrites | Optional |
| `POST` | `/api/ai/assistant` | Conversational mentoring grounded in user data | Optional |
| `GET`  | `/api/sample-resumes` | Retrieve preloaded sample resumes for instant testing | No |
| `GET`  | `/api/learning-resources` | Retrieve curated external courses and documentation | No |

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **bun** / **yarn**

### Installation

1. **Clone or open the repository:**
   ```bash
   git clone <repository-url>
   cd career-compass
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and provide your Google Gemini API key:

```env
# GEMINI_API_KEY: Required for live Google Gemini AI calls
GEMINI_API_KEY="your-gemini-api-key-here"

# PORT: Server listening port (default: 3000)
PORT=3000
```

> **Note**: If `GEMINI_API_KEY` is not provided, the platform automatically utilizes its built-in curated algorithms to deliver realistic, high-fidelity career recommendations, skill gap metrics, and ATS evaluations without throwing runtime errors.

### Running the Application

To run the unified full-stack development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

### Production Build

To build the client assets for production:

```bash
npm run build
```

To run the production server:

```bash
npm start
```

---

## 🧠 AI Engine & Fallback Architecture

Career Compass is designed with enterprise-grade resilience:

1. **System Prompt Discipline**: Gemini prompts are strictly structured with JSON schemas to enforce valid data serialization, realistic salary bands, and actionable XYZ bullet rewriting.
2. **Score Filtering Guarantee**: The recommendation engine filters all roles to guarantee that only careers with compatibility scores strictly greater than 50% (`score > 50`) are presented to the candidate.
3. **Graceful Degradation**: If network interruptions or API rate limits occur, the server immediately falls back to high-grade algorithmic generators based on recognized industry taxonomies, ensuring the user experience is never broken.
4. **Transparent Disclaimers**: In compliance with responsible AI design, match scores and ATS scores are clearly labeled as AI-generated compatibility estimates to maintain user trust.

---

## 🎨 UI & Theme Support

- **Dark & Light Mode**: Seamlessly toggled via the moon/sun icon in the top navigation bar. Theme preference is automatically stored in `localStorage`.
- **Adaptive Metrics**: Metric cards dynamically adjust their typography and layout when displaying longer status strings such as `"Resume not uploaded"`.
- **Accessibility**: High-contrast color palettes, readable font sizing, and keyboard-navigable controls throughout all views.

---

## 📄 License

This project is licensed under the **Apache-2.0 License**.

---

<p align="center">
  Built with ❤️ for aspiring engineers, students, and lifelong learners.  
  <b>Career Compass — Chart your course, bridge your gaps, achieve your dream role.</b>
</p>
