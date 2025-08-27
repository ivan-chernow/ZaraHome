import { FilesInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

type ImagesInterceptorOptions = {
  maxCount?: number;
  maxSizeMB?: number;
  allowedExt?: string[];
  allowedMime?: string[];
  fieldName?: string;
};

const defaultOptions: Required<ImagesInterceptorOptions> = {
  fieldName: 'images',
  maxCount: 10,
  maxSizeMB: 10,
  allowedExt: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  allowedMime: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

export const ImagesUploadInterceptor = (options: ImagesInterceptorOptions = {}) => {
  const {
    fieldName,
    maxCount,
    maxSizeMB,
    allowedExt,
    allowedMime,
  } = { ...defaultOptions, ...options };

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const extRegex = new RegExp(`\.(${allowedExt.join('|')})$`, 'i');

  return FilesInterceptor(fieldName, maxCount, {
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
      const extOk = extRegex.test(file.originalname || '');
      const mimeOk = allowedMime.includes(file.mimetype);
      if (!extOk || !mimeOk) {
        return cb(new BadRequestException('Разрешены только изображения (jpg, jpeg, png, gif, webp)'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: maxSizeBytes },
  });
};


