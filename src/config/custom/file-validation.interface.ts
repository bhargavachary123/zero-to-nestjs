import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';

export interface FileValidationOptions {
  /** Maximum allowed file size in bytes (default: 1 MB) */
  maxSize?: number;
  /** Allowed MIME types (default: ['application/pdf']) */
  allowedTypes?: string[];
  /** Require at least one file per field? (default: true) */
  requireFilesInEachField?: boolean;
  /** Custom storage path (for future use) */
  store?: string;
}