import { NextRequest, NextResponse } from "next/server";
import { analyzeResumeWithFile } from "@/lib/gemini";
import { saveUploadedFile } from "@/lib/fileUpload";
import { generateChartsData } from "@/lib/charts";
import { generatePDFReport } from "@/lib/pdfGenerator";
import { saveResumeAnalysis } from "@/lib/auth";
import {
  validateFile,
  validateJobTitle,
  validateJobDescription,
} from "@/lib/validation";
import { rateLimit, getClientIP } from "@/lib/rateLimit";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(clientIP, 5, 15 * 60 * 1000); // 5 requests per 15 minutes

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          resetTime: rateLimitResult.resetTime,
        },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const resumeFile = formData.get("resumeFile") as File;
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;

    if (!resumeFile || !jobTitle || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validation
    const fileValidation = validateFile(resumeFile);
    if (!fileValidation.isValid) {
      return NextResponse.json(
        { error: "Invalid file", details: fileValidation.errors },
        { status: 400 }
      );
    }

    const jobTitleValidation = validateJobTitle(jobTitle);
    if (!jobTitleValidation.isValid) {
      return NextResponse.json(
        { error: "Invalid job title", details: jobTitleValidation.errors },
        { status: 400 }
      );
    }

    const jobDescriptionValidation = validateJobDescription(jobDescription);
    if (!jobDescriptionValidation.isValid) {
      return NextResponse.json(
        {
          error: "Invalid job description",
          details: jobDescriptionValidation.errors,
        },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save uploaded file
    const { filePath, mimeType } = await saveUploadedFile(resumeFile);

    try {
      // Analyze resume with job requirements using direct file upload
      const analysis = await analyzeResumeWithFile(
        filePath,
        mimeType,
        jobTitle,
        jobDescription
      );

      // Generate charts data
      const chartsData = generateChartsData(analysis);

      // Generate PDF report
      const pdfReport = await generatePDFReport(analysis, chartsData);

      // Save analysis for logged-in users
      const userId = request.headers.get("x-user-id");
      if (userId) {
        try {
          await saveResumeAnalysis(
            userId,
            resumeFile.name,
            jobTitle,
            jobDescription,
            analysis
          );
        } catch (saveError) {
          console.error("Error saving analysis:", saveError);
          // Continue even if save fails
        }
      }

      return NextResponse.json({
        ...analysis,
        charts: chartsData,
        pdfReport: pdfReport,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
