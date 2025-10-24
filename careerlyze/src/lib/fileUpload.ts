import { writeFile, unlink } from "fs/promises";
import { join } from "path";

export async function saveUploadedFile(
  file: File
): Promise<{ filePath: string; mimeType: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create uploads directory if it doesn't exist
  const uploadsDir = join(process.cwd(), "uploads");

  // Generate unique filename using timestamp and random number
  const timestamp = Date.now();
  const randomNum = Math.random().toString(36).substring(2, 15);
  const filename = `${timestamp}-${randomNum}-${file.name}`;
  const filePath = join(uploadsDir, filename);

  // Write file to disk
  await writeFile(filePath, buffer);

  return {
    filePath,
    mimeType: file.type,
  };
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await unlink(filePath);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}
