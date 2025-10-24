import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient, Db, ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/careerlyze";

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db("careerlyze");
  }
  return { client, db };
}

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
}

export interface ResumeAnalysis {
  _id?: ObjectId;
  userId: ObjectId;
  fileName: string;
  jobTitle: string;
  jobDescription: string;
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
  createdAt: Date;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: ObjectId): string {
  return jwt.sign({ userId: userId.toString() }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function createUser(
  email: string,
  password: string,
  name?: string
): Promise<User> {
  const { db } = await connectToDatabase();

  const hashedPassword = await hashPassword(password);
  const user: User = {
    email,
    password: hashedPassword,
    name,
    createdAt: new Date(),
  };

  const result = await db.collection("users").insertOne(user);
  return { ...user, _id: result.insertedId };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const { db } = await connectToDatabase();
  return (await db.collection("users").findOne({ email })) as User | null;
}

export async function findUserById(userId: string): Promise<User | null> {
  const { db } = await connectToDatabase();
  return (await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) })) as User | null;
}

export async function saveResumeAnalysis(
  userId: string,
  fileName: string,
  jobTitle: string,
  jobDescription: string,
  analysis: any
): Promise<ResumeAnalysis> {
  const { db } = await connectToDatabase();

  const resumeAnalysis: ResumeAnalysis = {
    userId: new ObjectId(userId),
    fileName,
    jobTitle,
    jobDescription,
    analysis,
    createdAt: new Date(),
  };

  const result = await db
    .collection("resume_analyses")
    .insertOne(resumeAnalysis);
  return { ...resumeAnalysis, _id: result.insertedId };
}

export async function getUserResumeAnalyses(
  userId: string,
  limit = 10,
  skip = 0
): Promise<ResumeAnalysis[]> {
  const { db } = await connectToDatabase();
  return (await db
    .collection("resume_analyses")
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .toArray()) as ResumeAnalysis[];
}

export async function getAllResumeAnalyses(
  limit = 10,
  skip = 0
): Promise<ResumeAnalysis[]> {
  const { db } = await connectToDatabase();
  return (await db
    .collection("resume_analyses")
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .toArray()) as ResumeAnalysis[];
}

export async function getAllUsers(limit = 10, skip = 0): Promise<User[]> {
  const { db } = await connectToDatabase();
  return (await db
    .collection("users")
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .toArray()) as User[];
}

export async function deleteResumeAnalysis(
  analysisId: string
): Promise<boolean> {
  const { db } = await connectToDatabase();
  const result = await db
    .collection("resume_analyses")
    .deleteOne({ _id: new ObjectId(analysisId) });
  return result.deletedCount > 0;
}
