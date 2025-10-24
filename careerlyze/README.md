# Careerlyze - AI-Powered Resume Evaluation & Job Fit System

**Smart AI assistant that evaluates resumes, provides ATS compatibility scores, and recommends improvements for better job shortlisting chances.**

## 🚀 Features

### Core Features

- **ATS Score Analysis** - Resume quality scoring (0-100)
- **Job Match Analysis** - Resume vs job description comparison
- **Improvement Suggestions** - Personalized tips to boost ATS score
- **Visual Charts** - Interactive charts showing scores and recommendations
- **PDF Report** - Downloadable comprehensive report
- **AI-Powered Analysis** - Uses Google Gemini AI for intelligent resume evaluation

### User Management

- **User Authentication** - Secure login/register system
- **User Dashboard** - Personal analysis history
- **Session Management** - JWT-based authentication
- **Profile Management** - User account settings

### Admin Features

- **Admin Dashboard** - Complete system overview
- **User Management** - View and manage all users
- **Analysis Management** - View and delete analyses
- **Analytics** - System usage statistics

### Production Features

- **Rate Limiting** - Prevents abuse (5 requests per 15 minutes)
- **Input Validation** - Comprehensive form validation
- **File Upload Security** - Secure file handling
- **Error Handling** - Graceful error management
- **Toast Notifications** - User-friendly feedback
- **Loading States** - Smooth user experience
- **Responsive Design** - Works on all devices

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API
- **Charts:** Chart.js + react-chartjs-2
- **PDF:** jsPDF
- **Language:** TypeScript

## 📋 Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the root directory with:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎯 How to Use

1. **Upload Resume** - Upload your resume file (PDF, DOC, DOCX, or TXT)
2. **Enter Job Details** - Provide the job title and job description
3. **Get Analysis** - Receive comprehensive analysis including:
   - ATS Score (0-100)
   - Job Match Percentage
   - Section-wise scores
   - Improvement suggestions
   - Missing keywords
   - Visual charts
4. **Download Report** - Get a detailed PDF report

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze-resume/
│   │       └── route.ts          # Main API endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── lib/
│   ├── gemini.ts                 # Gemini AI integration
│   ├── fileParser.ts             # File parsing utilities
│   ├── charts.ts                 # Chart data generation
│   └── pdfGenerator.ts           # PDF report generation
└── public/
    └── logo.png                  # Careerlyze logo
```

## 🔧 API Endpoints

### POST `/api/analyze-resume`

Analyzes a resume against job requirements.

**Request:**

- `resumeFile` (File) - Resume file to analyze
- `jobTitle` (string) - Target job title
- `jobDescription` (string) - Job description

**Response:**

```json
{
  "atsScore": 85,
  "jobMatchPercentage": 78,
  "sectionScores": {
    "summary": 80,
    "experience": 75,
    "skills": 70,
    "education": 85
  },
  "missingKeywords": ["React", "Node.js"],
  "improvementSuggestions": ["Add more technical skills", "..."],
  "charts": { ... },
  "pdfReport": "data:application/pdf;base64,..."
}
```

## 🎨 UI Features

- **Modern Design** - Clean, professional interface
- **Responsive Layout** - Works on desktop and mobile
- **Interactive Charts** - Radar and bar charts for data visualization
- **Real-time Analysis** - Instant feedback on resume quality
- **Download Reports** - Generate and download PDF reports

## 🚀 Deployment

The application is ready for deployment on Vercel, Netlify, or any other Next.js hosting platform.

```bash
npm run build
npm start
```

## 📝 License

This project is created for educational purposes as part of MCA coursework.

---

**Careerlyze** - Empowering job seekers with AI-driven resume optimization! 🚀
