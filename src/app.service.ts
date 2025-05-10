// app.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService:ConfigService){}
  getHello(): string {
    return `Application Name from Custom configurations: ${this.configService.get<string>('app.name')}`;  
  }
  uploadFile(file:Express.Multer.File): string {
    return 'File Uploaded Successfully';
  }

  manyFiles(files:Express.Multer.File[]): string {
    return 'Files Uploaded Successfully';
  }
  mixedFiles(files:Record<string, Express.Multer.File[]>): string {
    return 'Files Uploaded Successfully';
  }
}