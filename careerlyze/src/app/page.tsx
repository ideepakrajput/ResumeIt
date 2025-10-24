"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Radar, Bar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Home() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    toast.loading("Analyzing your resume...", { id: "analysis" });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();
      setAnalysis(result);
      toast.success("Analysis completed successfully!", { id: "analysis" });

      // If user is logged in, redirect to dashboard
      if (user && result) {
        toast.success("Redirecting to dashboard...", { duration: 2000 });
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Analysis failed. Please try again.", { id: "analysis" });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (pdfData: string) => {
    const link = document.createElement("a");
    link.href = pdfData;
    link.download = "resume-analysis-report.pdf";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Careerlyze Logo"
                width={60}
                height={60}
                className="mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  <span className="text-blue-600">Career</span>
                  <span className="text-green-600">lyze</span>
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Job Success</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">
                    Welcome, {user.name || user.email}
                  </span>
                  <a
                    href="/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/admin"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm"
                  >
                    Admin
                  </a>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      setUser(null);
                      window.location.reload();
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </a>
                  <a
                    href="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Upload Form */}
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Resume Analysis
          </h2>

          <form action={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume File
              </label>
              <input
                type="file"
                name="resumeFile"
                accept=".pdf,.doc,.docx,.txt"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="jobTitle"
                placeholder="e.g., Software Engineer"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                name="jobDescription"
                rows={6}
                placeholder="Paste the job description here..."
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </form>
        </div>

        {/* Results Display */}
        {analysis && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Analysis Results
              </h2>

              {/* Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    ATS Score
                  </h3>
                  <p className="text-4xl font-bold text-blue-600">
                    {analysis.atsScore || 75}/100
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Applicant Tracking System
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Job Match
                  </h3>
                  <p className="text-4xl font-bold text-green-600">
                    {analysis.jobMatchPercentage || 70}%
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Compatibility Score
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Section Analysis
                  </h3>
                  <div className="h-64">
                    <Radar
                      data={analysis.charts?.radarChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            beginAtZero: true,
                            max: 100,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Score Comparison
                  </h3>
                  <div className="h-64">
                    <Bar
                      data={analysis.charts?.barChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Improvement Suggestions
                </h3>
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <ul className="space-y-3">
                    {(
                      analysis.improvementSuggestions || [
                        "Add more specific technical skills",
                        "Include quantifiable achievements",
                        "Optimize for ATS keywords",
                        "Improve formatting consistency",
                        "Add relevant certifications",
                      ]
                    ).map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Keywords */}
              {analysis.missingKeywords &&
                analysis.missingKeywords.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Missing Keywords
                    </h3>
                    <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingKeywords.map(
                          (keyword: string, index: number) => (
                            <span
                              key={index}
                              className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                            >
                              {keyword}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* Download Report */}
              <div className="text-center">
                <button
                  onClick={() => downloadPDF(analysis.pdfReport)}
                  className="bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 font-medium transition-colors"
                >
                  Download PDF Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
