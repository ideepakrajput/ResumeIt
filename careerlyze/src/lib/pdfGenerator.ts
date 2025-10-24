import jsPDF from "jspdf";

export async function generatePDFReport(
  analysis: any,
  charts: any
): Promise<string> {
  const pdf = new jsPDF();

  // Add title
  pdf.setFontSize(20);
  pdf.text("Resume Analysis Report", 20, 20);

  // Add ATS Score
  pdf.setFontSize(14);
  pdf.text(`ATS Score: ${analysis.atsScore || 75}/100`, 20, 40);

  // Add Job Match
  pdf.text(`Job Match: ${analysis.jobMatchPercentage || 70}%`, 20, 50);

  // Add section scores
  pdf.text("Section Scores:", 20, 70);
  pdf.text(`Summary: ${analysis.sectionScores?.summary || 80}/100`, 20, 80);
  pdf.text(
    `Experience: ${analysis.sectionScores?.experience || 75}/100`,
    20,
    90
  );
  pdf.text(`Skills: ${analysis.sectionScores?.skills || 70}/100`, 20, 100);
  pdf.text(
    `Education: ${analysis.sectionScores?.education || 85}/100`,
    20,
    110
  );

  // Add improvement suggestions
  pdf.text("Improvement Suggestions:", 20, 130);
  const suggestions = analysis.improvementSuggestions || [
    "Add more specific technical skills",
    "Include quantifiable achievements",
    "Optimize for ATS keywords",
    "Improve formatting consistency",
    "Add relevant certifications",
  ];

  suggestions.forEach((suggestion: string, index: number) => {
    pdf.text(`• ${suggestion}`, 20, 140 + index * 10);
  });

  // Add missing keywords
  if (analysis.missingKeywords && analysis.missingKeywords.length > 0) {
    pdf.text("Missing Keywords:", 20, 200);
    analysis.missingKeywords.forEach((keyword: string, index: number) => {
      pdf.text(`• ${keyword}`, 20, 210 + index * 10);
    });
  }

  return pdf.output("datauristring");
}
