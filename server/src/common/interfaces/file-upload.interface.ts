export interface FileUploadOptions {
  maxFiles?: number;
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  destination?: string;
}

export interface FileUploadResult {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

export interface ImageUploadOptions extends FileUploadOptions {
  resize?: {
    width?: number;
    height?: number;
    quality?: number;
  };
  format?: 'webp' | 'jpeg' | 'png';
}
