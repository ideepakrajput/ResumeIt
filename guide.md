# 🚀 Build Your MCA Project — "Careerlyze" (AI-Powered Resume Evaluation & Job Fit System)

**Create a simple Next.js app with a single API endpoint that handles everything!**

---

# 🧠 Project Overview

### **Project Title:**

**Careerlyze – AI-Powered Resume Evaluation and Job Fit System**

### **Tagline:**

Smart AI assistant that evaluates resumes, provides ATS compatibility scores, and recommends improvements for better job shortlisting chances.

---

## 🎯 Objective

Build a **Next.js web application** with a **single API endpoint** that takes a resume file, job title, and job description, then returns comprehensive analysis including:

1. **ATS Score Analysis** - Resume quality scoring (0-100)
2. **Job Match Analysis** - Resume vs job description comparison
3. **Improvement Suggestions** - Personalized tips to boost ATS score
4. **Visual Charts** - Interactive charts showing scores and recommendations
5. **PDF Report** - Downloadable comprehensive report

---

# 🛠️ Application Architecture

## **Authentication System**

- **User Registration/Login** with email and password
- **JWT tokens** for session management
- **Protected routes** for authenticated users
- **User-specific resume storage** in MongoDB

## **API Endpoints**

### **1. Auth Endpoints:**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### **2. Resume Analysis Endpoint:**

- `POST /api/analyze-resume` - Upload resume file + job details → Complete analysis

### **3. Admin Endpoints:**

- `GET /api/admin/resumes` - Get all resume analyses (paginated)
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/resume/:id` - Delete specific analysis

## **File Upload Approach**

Using **multer** for file handling like your existing server:

- Upload resume file to `/uploads` directory
- Parse file content using Gemini API
- Store analysis results in MongoDB with user association

## **Database Schema**

```json
{
  "users": {
    "email": "user@example.com",
    "password": "hashed_password",
    "createdAt": "timestamp"
  },
  "resume_analyses": {
    "userId": "user_id",
    "fileName": "resume.pdf",
    "jobTitle": "Software Engineer",
    "jobDescription": "Job description...",
    "analysis": {
      "atsScore": 85,
      "jobMatchPercentage": 78,
      "sectionScores": {...},
      "missingKeywords": [...],
      "improvementSuggestions": [...]
    },
    "createdAt": "timestamp"
  }
}
```

---

# 🧩 Implementation Plan

## **Phase 1: Project Setup**

### **1. Create Next.js App**

```bash
npx create-next-app@latest careerlyze --typescript --tailwind --eslint --app
cd careerlyze
```

### **2. Install Dependencies**

```bash
npm install @google/generative-ai multer jspdf html2canvas chart.js react-chartjs-2
npm install @tanstack/react-query axios jsonwebtoken bcryptjs
npm install @types/multer @types/jsonwebtoken @types/bcryptjs
```

### **3. Environment Setup**

Create `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_URL=http://localhost:3000
```

---

## **Phase 2: Core API Implementation**

### **Single API Route: `app/api/analyze-resume/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const resumeFile = formData.get("resumeFile") as File;
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;

    // Convert file to text (implement file parsing)
    const resumeText = await parseResumeFile(resumeFile);

    // Single comprehensive AI prompt
    const prompt = `
    Analyze this resume and provide comprehensive feedback:

    RESUME:
    ${resumeText}

    JOB TITLE: ${jobTitle}
    JOB DESCRIPTION: ${jobDescription}

    Please provide a JSON response with:
    1. ATS Score (0-100)
    2. Job Match Percentage (0-100)
    3. Section Scores (summary, experience, skills, education)
    4. Missing Keywords from job description
    5. 5 Improvement Suggestions
    6. Overall Assessment

    Format as valid JSON only.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text());

    // Generate charts data
    const chartsData = generateChartsData(analysis);

    // Generate PDF report
    const pdfReport = await generatePDFReport(analysis, chartsData);

    return NextResponse.json({
      ...analysis,
      charts: chartsData,
      pdfReport: pdfReport,
    });
  } catch (error) {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
```

---

## **Phase 3: Frontend Implementation**

### **Main Page: `app/page.tsx`**

```typescript
"use client";
import { useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function Home() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Upload Form */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Careerlyze</h1>

        <form
          action={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Resume File
            </label>
            <input
              type="file"
              name="resumeFile"
              accept=".pdf,.doc,.docx"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Job Description
            </label>
            <textarea
              name="jobDescription"
              rows={6}
              required
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </form>

        {/* Results Display */}
        {analysis && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>

              {/* Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold">ATS Score</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {analysis.atsScore}/100
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold">Job Match</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {analysis.jobMatchPercentage}%
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Section Analysis</h3>
                <div className="h-64">
                  <Radar data={analysis.charts.radarChart} />
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  Improvement Suggestions
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {analysis.improvementSuggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Download Report */}
              <button
                onClick={() => downloadPDF(analysis.pdfReport)}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Download PDF Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## **Phase 4: Helper Functions**

### **File Parsing: `lib/fileParser.ts`**

```typescript
export async function parseResumeFile(file: File): Promise<string> {
  // Implement PDF/DOC parsing logic
  // For now, return placeholder
  return "Parsed resume text...";
}
```

### **Charts Generation: `lib/charts.ts`**

```typescript
export function generateChartsData(analysis: any) {
  return {
    radarChart: {
      labels: ["Summary", "Experience", "Skills", "Education"],
      datasets: [
        {
          label: "Scores",
          data: [
            analysis.sectionScores.summary,
            analysis.sectionScores.experience,
            analysis.sectionScores.skills,
            analysis.sectionScores.education,
          ],
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
        },
      ],
    },
  };
}
```

### **PDF Generation: `lib/pdfGenerator.ts`**

```typescript
import jsPDF from "jspdf";

export async function generatePDFReport(
  analysis: any,
  charts: any
): Promise<string> {
  const pdf = new jsPDF();

  // Add content to PDF
  pdf.text("Resume Analysis Report", 20, 20);
  pdf.text(`ATS Score: ${analysis.atsScore}/100`, 20, 40);
  pdf.text(`Job Match: ${analysis.jobMatchPercentage}%`, 20, 50);

  // Add more content...

  return pdf.output("datauristring");
}
```

---

## **Phase 5: Authentication Implementation**

### **Auth Context: `contexts/AuthContext.tsx`**

```typescript
// Create authentication context for user management
// Handle login, logout, and user state
// JWT token management
// Protected route logic
```

### **Auth API Routes:**

- `app/api/auth/register/route.ts` - User registration
- `app/api/auth/login/route.ts` - User login
- `app/api/auth/logout/route.ts` - User logout

### **Middleware: `middleware.ts`**

```typescript
// JWT token verification
// Protected route protection
// Admin route access control
```

---

## **Phase 6: Admin Dashboard**

### **Admin Layout: `app/admin/layout.tsx`**

```typescript
// Admin dashboard layout
// Navigation sidebar
// User authentication check
// Admin role verification
```

### **Admin Pages:**

- `app/admin/page.tsx` - Dashboard overview
- `app/admin/resumes/page.tsx` - All resume analyses table
- `app/admin/users/page.tsx` - User management table

### **TanStack Query Setup: `lib/queryClient.ts`**

```typescript
// Configure TanStack Query client
// API endpoints configuration
// Pagination setup
// Error handling
```

### **Admin API Routes:**

- `app/api/admin/resumes/route.ts` - Get paginated resume analyses
- `app/api/admin/users/route.ts` - Get all users
- `app/api/admin/resume/[id]/route.ts` - Delete specific analysis

### **Data Tables with Pagination:**

```typescript
// TanStack Table implementation
// Server-side pagination
// Search and filtering
// Export functionality
```

---

## **Phase 7: File Upload Integration**

### **File Upload Handler: `lib/uploadHandler.ts`**

```typescript
// Multer configuration for file uploads
// File validation (PDF, DOC, DOCX)
// File storage in /uploads directory
// File parsing for Gemini API
```

### **Updated Resume Analysis API:**

```typescript
// Integrate file upload with existing analysis
// User association with analysis results
// File cleanup after processing
// Error handling for file operations
```

---

# 🎯 Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API
- **Charts:** Chart.js + react-chartjs-2
- **PDF:** jsPDF
- **File Upload:** Multer
- **Database:** MongoDB Atlas
- **Authentication:** JWT + bcryptjs
- **State Management:** TanStack Query
- **HTTP Client:** Axios
- **Data Tables:** TanStack Table
- **File Parsing:** Custom implementation or libraries

---

# 📋 Development Checklist

## **Core Setup**

- [ ] Set up Next.js project
- [ ] Install all dependencies
- [ ] Configure MongoDB connection
- [ ] Set up environment variables

## **Authentication**

- [ ] Create user registration API
- [ ] Create user login API
- [ ] Implement JWT middleware
- [ ] Create AuthContext
- [ ] Build login/register forms

## **File Upload & Analysis**

- [ ] Set up multer for file uploads
- [ ] Create `/uploads` directory
- [ ] Implement file parsing
- [ ] Integrate Gemini AI with file upload
- [ ] Update resume analysis API

## **Frontend**

- [ ] Create protected dashboard
- [ ] Build resume upload form
- [ ] Add charts visualization
- [ ] Implement PDF generation
- [ ] Add user-specific analysis history

## **Admin Dashboard**

- [ ] Create admin layout
- [ ] Set up TanStack Query
- [ ] Build admin API routes
- [ ] Create paginated data tables
- [ ] Add search and filtering
- [ ] Implement admin authentication

## **Testing & Deployment**

- [ ] Test with sample resumes
- [ ] Test authentication flow
- [ ] Test admin functionality
- [ ] Deploy to Vercel

---

# 🚀 Quick Start Command

```bash
# Create the project
npx create-next-app@latest careerlyze --typescript --tailwind --eslint --app

# Navigate to project
cd careerlyze

# Install dependencies
npm install @google/generative-ai multer jspdf html2canvas chart.js react-chartjs-2
npm install @tanstack/react-query axios jsonwebtoken bcryptjs
npm install @types/multer @types/jsonwebtoken @types/bcryptjs

# Create environment file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
echo "MONGODB_URI=your_mongodb_connection_string" >> .env.local
echo "JWT_SECRET=your_jwt_secret_key" >> .env.local
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local

# Start development server
npm run dev
```

This approach gives you a **single, powerful API endpoint** that handles all resume analysis functionality in one request!
