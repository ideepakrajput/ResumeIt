"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Analysis {
  _id: string;
  fileName: string;
  jobTitle: string;
  analysis: {
    atsScore: number;
    jobMatchPercentage: number;
    sectionScores: {
      summary: number;
      experience: number;
      skills: number;
      education: number;
    };
    missingKeywords: string[];
    improvementSuggestions: string[];
    overallAssessment: string;
  };
  createdAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    fetchAnalyses();
  }, [router]);

  const fetchAnalyses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/analyses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyses(data.analyses);
      }
    } catch (error) {
      console.error("Error fetching analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const downloadPDF = (pdfData: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = pdfData;
    link.download = `${fileName}-analysis-report.pdf`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Careerlyze Logo"
                width={40}
                height={40}
                className="mr-3"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="text-blue-600">Career</span>
                  <span className="text-green-600">lyze</span>
                </h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Analyses */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Analyses
              </h2>
              {analyses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No analyses yet. <br />
                  <a href="/" className="text-blue-600 hover:text-blue-500">
                    Start your first analysis
                  </a>
                </p>
              ) : (
                <div className="space-y-3">
                  {analyses.slice(0, 5).map((analysis) => (
                    <div
                      key={analysis._id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedAnalysis(analysis)}
                    >
                      <div className="font-medium text-sm">
                        {analysis.jobTitle}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-blue-600">
                        ATS: {analysis.analysis.atsScore}/100
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Analysis Details */}
          <div className="lg:col-span-2">
            {selectedAnalysis ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedAnalysis.jobTitle}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        selectedAnalysis.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      downloadPDF(
                        "data:application/pdf;base64,",
                        selectedAnalysis.fileName
                      )
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                  >
                    Download PDF
                  </button>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      ATS Score
                    </h3>
                    <p className="text-4xl font-bold text-blue-600">
                      {selectedAnalysis.analysis.atsScore}/100
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
                      {selectedAnalysis.analysis.jobMatchPercentage}%
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Compatibility Score
                    </p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Section Analysis
                    </h3>
                    <div className="h-64">
                      <Radar
                        data={{
                          labels: [
                            "Summary",
                            "Experience",
                            "Skills",
                            "Education",
                          ],
                          datasets: [
                            {
                              label: "Scores",
                              data: [
                                selectedAnalysis.analysis.sectionScores.summary,
                                selectedAnalysis.analysis.sectionScores
                                  .experience,
                                selectedAnalysis.analysis.sectionScores.skills,
                                selectedAnalysis.analysis.sectionScores
                                  .education,
                              ],
                              backgroundColor: "rgba(59, 130, 246, 0.2)",
                              borderColor: "rgba(59, 130, 246, 1)",
                              borderWidth: 2,
                            },
                          ],
                        }}
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
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Score Comparison
                    </h3>
                    <div className="h-64">
                      <Bar
                        data={{
                          labels: ["ATS Score", "Job Match"],
                          datasets: [
                            {
                              label: "Scores",
                              data: [
                                selectedAnalysis.analysis.atsScore,
                                selectedAnalysis.analysis.jobMatchPercentage,
                              ],
                              backgroundColor: [
                                "rgba(59, 130, 246, 0.8)",
                                "rgba(34, 197, 94, 0.8)",
                              ],
                              borderColor: [
                                "rgba(59, 130, 246, 1)",
                                "rgba(34, 197, 94, 1)",
                              ],
                              borderWidth: 1,
                            },
                          ],
                        }}
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
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Improvement Suggestions
                  </h3>
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <ul className="space-y-3">
                      {selectedAnalysis.analysis.improvementSuggestions.map(
                        (suggestion: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-600 mr-2">•</span>
                            <span className="text-gray-700">{suggestion}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Missing Keywords */}
                {selectedAnalysis.analysis.missingKeywords &&
                  selectedAnalysis.analysis.missingKeywords.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Missing Keywords
                      </h3>
                      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                        <div className="flex flex-wrap gap-2">
                          {selectedAnalysis.analysis.missingKeywords.map(
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
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Select an Analysis
                </h2>
                <p className="text-gray-600 mb-6">
                  Choose an analysis from the sidebar to view detailed results.
                </p>
                <a
                  href="/"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-block"
                >
                  Start New Analysis
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
