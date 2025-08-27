import { FilesInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

type ImagesInterceptorOptions = {
  maxCount?: number;
  maxSizeMB?: number;
  allowedExt?: string[];
  allowedMime?: string[];
  fieldName?: string;
  generateUniqueNames?: boolean;
};

const defaultOptions: Required<ImagesInterceptorOptions> = {
  fieldName: 'images',
  maxCount: 10,
  maxSizeMB: 10,
  allowedExt: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  allowedMime: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  generateUniqueNames: true,
};

// Функция для генерации уникального имени файла
const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomId = uuidv4().replace(/-/g, '').substring(0, 8);
  const hash = crypto.createHash('md5').update(`${originalName}${timestamp}${randomId}`).digest('hex').substring(0, 8);
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  
  return `${timestamp}-${randomId}-${hash}.${ext}`;
};

// Функция для валидации MIME типов
const validateMimeType = (mimetype: string, allowedMime: string[]): boolean => {
  return allowedMime.includes(mimetype);
};

// Функция для валидации расширений файлов
const validateFileExtension = (filename: string, allowedExt: string[]): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? allowedExt.includes(ext) : false;
};

// Функция для валидации размера файла
const validateFileSize = (size: number, maxSizeBytes: number): boolean => {
  return size <= maxSizeBytes;
};

export const ImagesUploadInterceptor = (options: ImagesInterceptorOptions = {}) => {
  const {
    fieldName,
    maxCount,
    maxSizeMB,
    allowedExt,
    allowedMime,
    generateUniqueNames,
  } = { ...defaultOptions, ...options };

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  return FilesInterceptor(fieldName, maxCount, {
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
      // Проверяем наличие файла
      if (!file) {
        return cb(new BadRequestException('Файл не предоставлен'), false);
      }

      // Проверяем оригинальное имя файла
      if (!file.originalname) {
        return cb(new BadRequestException('Некорректное имя файла'), false);
      }

      // Проверяем MIME тип
      if (!validateMimeType(file.mimetype, allowedMime)) {
        return cb(
          new BadRequestException(
            `Неподдерживаемый тип файла. Разрешены только: ${allowedExt.join(', ')}`
          ),
          false
        );
      }

      // Проверяем расширение файла
      if (!validateFileExtension(file.originalname, allowedExt)) {
        return cb(
          new BadRequestException(
            `Неподдерживаемое расширение файла. Разрешены только: ${allowedExt.join(', ')}`
          ),
          false
        );
      }

      // Генерируем уникальное имя файла если требуется
      if (generateUniqueNames) {
        file.originalname = generateUniqueFileName(file.originalname);
      }

      cb(null, true);
    },
    limits: { 
      fileSize: maxSizeBytes,
      files: maxCount,
    },
  });
};

// Дополнительная функция для валидации загруженных файлов
export const validateUploadedFiles = (files: Express.Multer.File[], options: ImagesInterceptorOptions = {}) => {
  const {
    maxCount = 10,
    maxSizeMB = 10,
    allowedExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  } = options;

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // Проверяем количество файлов
  if (!files || files.length === 0) {
    throw new BadRequestException('Необходимо загрузить хотя бы один файл');
  }

  if (files.length > maxCount) {
    throw new BadRequestException(`Максимальное количество файлов: ${maxCount}`);
  }

  // Проверяем каждый файл
  files.forEach((file, index) => {
    // Проверяем размер файла
    if (file.size > maxSizeBytes) {
      throw new BadRequestException(
        `Файл "${file.originalname}" слишком большой. Максимальный размер: ${maxSizeMB}MB`
      );
    }

    // Проверяем MIME тип
    if (!validateMimeType(file.mimetype, allowedMime)) {
      throw new BadRequestException(
        `Файл "${file.originalname}" имеет неподдерживаемый тип. Разрешены только: ${allowedExt.join(', ')}`
      );
    }

    // Проверяем расширение
    if (!validateFileExtension(file.originalname, allowedExt)) {
      throw new BadRequestException(
        `Файл "${file.originalname}" имеет неподдерживаемое расширение. Разрешены только: ${allowedExt.join(', ')}`
      );
    }

    // Проверяем, что файл не пустой
    if (file.size === 0) {
      throw new BadRequestException(`Файл "${file.originalname}" пустой`);
    }
  });

  return files;
};


