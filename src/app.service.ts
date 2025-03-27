import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService:ConfigService){}
  getHello(): string {
    return `Application Name from Custom configurations: ${this.configService.get<string>('app.name')}`;  
  }
  uploadFile(file:Express.Multer.File): string {
    return `${file.originalname} File Uploaded Successfully`;
  }
}