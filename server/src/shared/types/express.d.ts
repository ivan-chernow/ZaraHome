declare namespace Express {
  interface Request {
    uploadErrors?: any[];
    uploadedFiles?: string[];
  }
}

