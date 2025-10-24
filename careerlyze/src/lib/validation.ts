export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateFile(file: File): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    errors.push("File must be a PDF, DOC, DOCX, or TXT file");
  }

  if (file.size > maxSize) {
    errors.push("File size must be less than 10MB");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateJobTitle(jobTitle: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!jobTitle.trim()) {
    errors.push("Job title is required");
  }

  if (jobTitle.length < 2) {
    errors.push("Job title must be at least 2 characters long");
  }

  if (jobTitle.length > 100) {
    errors.push("Job title must be less than 100 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateJobDescription(jobDescription: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!jobDescription.trim()) {
    errors.push("Job description is required");
  }

  if (jobDescription.length < 10) {
    errors.push("Job description must be at least 10 characters long");
  }

  if (jobDescription.length > 5000) {
    errors.push("Job description must be less than 5000 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
