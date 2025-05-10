import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import type { Express } from 'express';
import { FileValidationOptions } from './file-validation.interface';

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  private readonly options: Required<FileValidationOptions>;

  constructor(options: FileValidationOptions = {}) {
    this.options = {
      maxSize: options.maxSize ?? 1 * 1024 * 1024,
      allowedTypes: options.allowedTypes ?? ['application/pdf'],
      requireFilesInEachField: options.requireFilesInEachField ?? true,
      store: options.store ?? '/upload',
    };
  }

  transform(
    value: Express.Multer.File | Express.Multer.File[] | Record<string, Express.Multer.File[]>,
    metadata: ArgumentMetadata,
  ): any {

    if (!value) {
      throw new BadRequestException('No files uploaded');
    }

    // 1️⃣ Single-file
    if (this.isSingleFile(value)) {
      this.validateSingleFile(value);
      return value;
    }

    // 2️⃣ Array of files for one field (FilesInterceptor)
    if (Array.isArray(value)) {
      if (this.options.requireFilesInEachField && value.length === 0) {
        throw new BadRequestException(`At least one file is required`);
      }
      // validate each as a single file
      value.forEach((file) => {
        if (!this.isSingleFile(file)) {
          throw new BadRequestException('Invalid file in array');
        }
        this.validateSingleFile(file);
      });
      return value;
    }

    // 3️⃣ Multiple fields (FileFieldsInterceptor)
    if (this.isMultipleFilesMap(value)) {
      // require each field to have at least one file?
      if (this.options.requireFilesInEachField) {
        for (const [field, arr] of Object.entries(value)) {
          if (!Array.isArray(arr) || arr.length === 0) {
            throw new BadRequestException(`Field "${field}" requires at least one file`);
          }
        }
      }
      // validate all
      for (const arr of Object.values(value)) {
        arr.forEach(file => this.validateSingleFile(file, arr));
      }
      return value;
    }

    throw new BadRequestException('Invalid file upload format');
  }

  private isSingleFile(value: any): value is Express.Multer.File {
    return (
      value &&
      typeof value === 'object' &&
      'fieldname' in value &&
      'originalname' in value &&
      'mimetype' in value &&
      'size' in value
    );
  }

  private isMultipleFilesMap(
    value: any,
  ): value is Record<string, Express.Multer.File[]> {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.values(value).every(
        arr => Array.isArray(arr) && arr.every(f => this.isSingleFile(f)),
      )
    );
  }

  private validateSingleFile(
    file: Express.Multer.File,
    _arr?: Express.Multer.File[],
  ) {
    const { maxSize, allowedTypes } = this.options;

    // choose KB vs MB
    let limitLabel: string;
    if (maxSize < 1024 * 1024) {
      const kb = Math.round(maxSize / 1024);
      limitLabel = `${kb} KB`;
    } else {
      const mb = Math.round((maxSize / 1024 / 1024) * 10) / 10;
      limitLabel = `${mb} MB`;
    }

    if (file.size > maxSize) {
      throw new BadRequestException(
        `"${file.originalname}" exceeds ${limitLabel}`,
      );
    }

    if (!allowedTypes.includes(file.mimetype)) {
      const types = allowedTypes.map(t => this.getTypeName(t)).join(', ');
      throw new BadRequestException(
        `"${file.originalname}" must be one of: ${types}`,
      );
    }
  }

  private getTypeName(mime: string): string {
    const map: Record<string, string> = {
      'application/pdf': 'PDF',
      'image/jpeg': 'JPEG',
      'image/png': 'PNG',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'DOCX',
    };
    return map[mime] || mime;
  }
}
