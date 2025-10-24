1. **Build your MCA project — “Careerlyze”** (AI-Powered Resume Evaluation & Job Fit System) using **Next.js + Node.js + MongoDB + Gemini API **
2. **Create your project report in Markdown** (which you can later convert to `.docx` or `.pdf` for university submission).

# 🧠 Project Overview

### **Project Title:**

**Careerlyze – AI-Powered Resume Evaluation and Job Fit System**

### **Tagline:**

Smart AI assistant that evaluates resumes, provides ATS compatibility scores, and recommends improvements for better job shortlisting chances.

---

## 🎯 Objective

The goal of **Careerlyze** is to build a **web-based AI-driven platform** that automates resume analysis and job-fit evaluation using Natural Language Processing (NLP).

The system will:

- Extract and analyze resume text.
- Provide an **ATS score** and **section completeness score**.
- Recommend improvements (skills, structure, missing keywords).
- Compare resume content with a **job description** to estimate a **match percentage**.

This helps students, job seekers, and recruiters quickly understand resume quality and alignment.

---

# 🧩 Phase-wise Development Plan (MCA Report Style)

---

## **Phase 1: Identification Phase**

### **Problem Definition**

Manual resume review is time-consuming and subjective. Recruiters often filter candidates using ATS (Applicant Tracking Systems) that rely on keyword-based scoring, but most applicants don’t know how their resumes perform in such systems.

**Careerlyze** solves this by using AI to evaluate resumes, providing feedback and recommendations automatically.

---

### **Objectives**

1. Automate resume screening and scoring using AI.
2. Provide real-time, actionable suggestions for resume improvement.
3. Match resumes against job descriptions to predict job fit.
4. Build a scalable web app using the MERN/Next.js stack.

---

### **Scope**

- Users: Students, Job seekers, Recruiters.
- Platform: Web-based (Next.js) + optional mobile app (React Native).
- AI Used: Gemini API or OpenAI API for NLP analysis.
- Output: ATS score, job fit %, improvement points, and report.

---

### **Hardware & Software Requirements**

| Type                | Details                                        |
| ------------------- | ---------------------------------------------- |
| **Hardware**        | Intel i5 or higher / 8GB RAM / 40GB HDD        |
| **OS**              | Windows / macOS / Linux                        |
| **Frontend**        | Next.js (React framework)                      |
| **Backend**         | Node.js + Express                              |
| **Database**        | MongoDB                                        |
| **AI API**          | Gemini API / OpenAI API                        |
| **Version Control** | Git + GitHub                                   |
| **Deployment**      | Vercel (Frontend) / Render / Railway (Backend) |

---

## **Phase 2: Development Phase**

### **1. System Architecture**

```
User → Next.js Frontend → Node.js Backend → AI API → MongoDB
```

- **Frontend:** Handles user input (resume upload, job description).
- **Backend:** API routes for AI processing and data handling.
- **AI API:** Analyzes text and returns structured feedback.
- **Database:** Stores user data, resumes, scores, and suggestions.

---

### **2. Folder Structure (Next + Node)**

```
careerlyze/
├── frontend/
│   ├── components/
│   ├── pages/
│   │   ├── index.tsx          // Home page
│   │   ├── upload.tsx         // Resume upload form
│   │   ├── results.tsx        // Display results
│   ├── utils/
│   ├── services/api.ts        // Backend API integration
│   └── styles/
│
├── backend/
│   ├── app.js                 // Express server
│   ├── routes/
│   │   ├── resumeRoutes.js
│   ├── controllers/
│   │   ├── resumeController.js
│   ├── services/
│   │   ├── aiService.js       // Gemini/OpenAI integration
│   └── models/
│       ├── User.js
│       ├── Resume.js
│
└── database/
    └── connect.js             // MongoDB connection
```

---

### **3. Core Modules**

#### **Module 1 – Resume Upload & Parsing**

- Upload PDF/DOCX.
- Extract text using libraries (e.g., `pdf-parse`, `mammoth`).
- Send to backend for analysis.

#### **Module 2 – AI Resume Evaluation**

- AI analyzes extracted text using a prompt like:

  ```
  Analyze this resume text and give:
  - ATS score out of 100
  - Key missing skills
  - Grammar or structure issues
  - Summary of overall impression
  ```

- Parse AI response into structured JSON and store in MongoDB.

#### **Module 3 – Job Fit Comparison**

- User provides job description.
- AI compares resume vs job description and gives match percentage:

  ```
  Compare resume vs job description.
  Output match percentage and missing keywords.
  ```

#### **Module 4 – Improvement Suggestions**

- AI provides personalized tips to improve ATS score:

  - Add missing technical skills.
  - Reorder sections.
  - Improve summary and action verbs.

#### **Module 5 – Result Visualization**

- Display AI results in charts (e.g., bar or radar chart using Chart.js).
- Include overall score, section scores, and recommendations.

#### **Module 6 – Report Generation**

- Generate downloadable report (PDF) summarizing all feedback.
- Include charts and text sections.

---

### **4. Technology Stack**

- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **AI API:** Gemini API / OpenAI API
- **File Parsing:** pdf-parse, mammoth
- **Visualization:** Chart.js / Recharts
- **Auth (optional):** JWT or Clerk Auth

---

### **5. SDLC Phases**

| Phase                    | Description                                  |
| ------------------------ | -------------------------------------------- |
| **Requirement Analysis** | Identify system functions, tools, and goals. |
| **Design**               | Architecture, UI/UX, and data flow diagrams. |
| **Implementation**       | Develop modules and integrate APIs.          |
| **Testing**              | Functional and AI response testing.          |
| **Deployment**           | Host on Vercel + Render.                     |
| **Maintenance**          | Monitor and enhance AI feedback accuracy.    |

---

## **Phase 3: Project Report**

### **Abstract**

> Careerlyze is an AI-driven platform designed to evaluate resumes intelligently and provide ATS-based scoring and improvement recommendations. Using the MERN stack and NLP capabilities of AI APIs, Careerlyze assists job seekers in optimizing their resumes to align with industry requirements.

### **Introduction**

- Context: AI in recruitment and HR tech.
- Problem: Manual resume screening inefficiency.
- Solution: Automated AI-powered analysis.

### **Design**

- DFDs, UML diagrams (System Overview, Data Flow, Entity Relationship).

### **Implementation**

- Frontend: Next.js pages and components.
- Backend: REST API routes in Express.
- AI Integration: Calls to AI model using `fetch` or `axios`.
- Database: User & resume schema in MongoDB.

### **Testing**

- Upload multiple resumes, validate parsing, compare outputs.
- Validate AI responses for completeness and relevance.

### **Application Screens**

1. Homepage (upload section)
2. Resume analysis result page
3. Job match page
4. Report generation

### **Conclusion**

Careerlyze bridges the gap between AI and job readiness by providing intelligent resume analytics. Future enhancements include integration with LinkedIn and real-time skill recommendation systems.

### **Bibliography**

- Gemini AI API Documentation
- Next.js & MongoDB Developer Docs
- Research papers on NLP in HR tech

---

# 🧾 Expected Output (Features Recap)

| Feature                  | Description                         |
| ------------------------ | ----------------------------------- |
| Resume Upload            | PDF/DOCX parsing                    |
| AI Resume Scoring        | ATS score + overall quality score   |
| Job Description Matching | Fit percentage and missing keywords |
| Suggestions              | AI-powered improvement feedback     |
| Dashboard                | Graphs & charts showing progress    |
| Report                   | PDF summary export                  |

---

# 📦 Deliverables

1. Source Code (Frontend + Backend + DB)
2. Live Deployed App (e.g., Vercel + Render link)
3. Project Report (this Markdown → PDF)
