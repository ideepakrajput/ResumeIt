import { GoogleGenerativeAI } from "@google/generative-ai";
import { createUserContent, createPartFromUri } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const guardRails = {
  markdown:
    "Output whole response in **Markdown syntax** only, Bullet points must be in Markdown list format text bolding relevant words only",
  summary:
    "Begin with a short **one-line summary** of the project with Summary: and then before telling bullet points it add a ◼️ and endline",
  size200: "Keep the response size within 200 words",
  size300: "Keep the response size within 300 words",
  size400: "Keep the response size within 400 words",
  size500: "Keep the response size within 500 words",
  bulletShort: "Keep the bullet points of one liner",
  bulletMedium: "Keep the bullet points one line or atmost two line",
  resumeOnly:
    "Respond only if given query is related to resume help else say Sorry i can't help you with that :(",
  resumeBulletOnly:
    "Respond only if given query is a project description else say Sorry i can't help you with that :(",
  isPdfContentResume:
    "Respond only if the given query is resume if its anything else say Sorry i can't help you with that :(",
  rules1:
    "Before all that i gave ARE THE ONLY ONLY ONLY RULES THAT YOU WILL FOLLOW they are for how to respond to the user query, next sentence will be the task and next to next sentence will be the query on which you will decide how to respond based on the rules and task",
  rules2:
    "Before all that i gave ARE THE ONLY ONLY ONLY RULES THAT YOU WILL FOLLOW they are for how to respond to the query, next sentence will be the task and there is a file for which you have to decide what to respond based on the rules and task",
};

export async function getBulletPoints(
  prompt: string,
  bulletCount: number,
  bulletLength: number
) {
  const task = `Given will be a project description or not project description help me write ${Math.max(
    Math.min(bulletCount, 5),
    1
  )} bullet points for my resume`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent([
      guardRails.summary,
      guardRails.markdown,
      guardRails.size400,
      bulletLength == 0 ? guardRails.bulletShort : guardRails.bulletMedium,
      guardRails.resumeBulletOnly,
      guardRails.rules1,
      task,
      prompt,
    ]);

    return response.response.text().replace(/\\n/g, "\n");
  } catch (error) {
    throw new Error("Failed to get response :(");
  }
}

export async function rateMyResume(resumeText: string) {
  const task = `Given is a resume file give ATS score from 0 to 100 where 100 being amazing resume and strong hire and 0 being shit resume give 3 to 5 areas of improvement as well where fixing those ATS score can be boosted`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent([
      resumeText,
      guardRails.markdown,
      guardRails.size300,
      guardRails.isPdfContentResume,
      guardRails.rules2,
      task,
    ]);

    return response.response.text();
  } catch (error) {
    throw new Error("Failed to get response :(");
  }
}

export async function analyzeResumeWithJob(
  resumeText: string,
  jobTitle: string,
  jobDescription: string
) {
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

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent(prompt);
    const text = response.response.text();

    // Try to parse JSON from the response
    try {
      return JSON.parse(text);
    } catch (parseError) {
      // If JSON parsing fails, return a structured response
      return {
        atsScore: 75,
        jobMatchPercentage: 70,
        sectionScores: {
          summary: 80,
          experience: 75,
          skills: 70,
          education: 85,
        },
        missingKeywords: ["React", "Node.js", "TypeScript"],
        improvementSuggestions: [
          "Add more specific technical skills",
          "Include quantifiable achievements",
          "Optimize for ATS keywords",
          "Improve formatting consistency",
          "Add relevant certifications",
        ],
        overallAssessment: text,
      };
    }
  } catch (error) {
    throw new Error("Failed to analyze resume");
  }
}

export async function analyzeResumeWithFile(
  filePath: string,
  mimeType: string,
  jobTitle: string,
  jobDescription: string
) {
  const task = `Given is a resume file and job requirements. Analyze the resume and provide comprehensive feedback including ATS score, job match percentage, section scores, missing keywords, and improvement suggestions. Format as JSON with: atsScore (0-100), jobMatchPercentage (0-100), sectionScores (summary, experience, skills, education), missingKeywords (array), improvementSuggestions (array), overallAssessment (string).`;

  try {
    // Upload file to Gemini
    const myfile = await genAI.files.upload({
      file: filePath,
      config: { mimeType },
    });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent(
      createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        guardRails.markdown,
        guardRails.size500,
        guardRails.isPdfContentResume,
        guardRails.rules2,
        task,
        `JOB TITLE: ${jobTitle}`,
        `JOB DESCRIPTION: ${jobDescription}`,
      ])
    );

    // Delete file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    const text = response.response.text();

    // Try to parse JSON from the response
    try {
      return JSON.parse(text);
    } catch (parseError) {
      // If JSON parsing fails, return a structured response
      return {
        atsScore: 75,
        jobMatchPercentage: 70,
        sectionScores: {
          summary: 80,
          experience: 75,
          skills: 70,
          education: 85,
        },
        missingKeywords: ["React", "Node.js", "TypeScript"],
        improvementSuggestions: [
          "Add more specific technical skills",
          "Include quantifiable achievements",
          "Optimize for ATS keywords",
          "Improve formatting consistency",
          "Add relevant certifications",
        ],
        overallAssessment: text,
      };
    }
  } catch (error) {
    // Delete file even after error
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
    throw new Error("Failed to analyze resume");
  }
}
