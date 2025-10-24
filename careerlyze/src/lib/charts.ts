export function generateChartsData(analysis: any) {
  return {
    radarChart: {
      labels: ["Summary", "Experience", "Skills", "Education"],
      datasets: [
        {
          label: "Scores",
          data: [
            analysis.sectionScores?.summary || 80,
            analysis.sectionScores?.experience || 75,
            analysis.sectionScores?.skills || 70,
            analysis.sectionScores?.education || 85,
          ],
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
        },
      ],
    },
    barChart: {
      labels: ["ATS Score", "Job Match"],
      datasets: [
        {
          label: "Scores",
          data: [analysis.atsScore || 75, analysis.jobMatchPercentage || 70],
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(34, 197, 94, 0.8)",
          ],
          borderColor: ["rgba(59, 130, 246, 1)", "rgba(34, 197, 94, 1)"],
          borderWidth: 1,
        },
      ],
    },
  };
}
