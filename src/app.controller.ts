// app.controller.ts
import { Controller, FileTypeValidator, Get, HttpStatus, Ip, Logger, MaxFileSizeValidator, ParseFilePipe, Post, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { WinstonLogger } from './config/winston.logger';
import { SkipAuthGuard } from './auth/skipauth.guard';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesValidationPipe } from './config/custom/multiple-files-validation.pipe';

@Controller()
export class AppController {
  private readonly winstonlogger = new WinstonLogger();
  constructor(
    private readonly appService: AppService
  ) { }

  @Get()
  @SkipAuthGuard()
  getHello(@Ip() Ip: string): string {
    this.winstonlogger.info(`GetHello call from Ip: ${Ip}`);
    return this.appService.getHello();
  }

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingle(
    @Req() req: any,
    @UploadedFile(
      new FilesValidationPipe({
        maxSize: 500 * 1024,
        allowedTypes: ['image/jpeg'],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.appService.uploadFile(file);
  }

  // ─── Multiple Files on One Field ────────────────────────────────────────────
  @Post('many')
  @UseInterceptors(FilesInterceptor('files', 5))  // up to 5 files under “photos”
  uploadMany(
    @Req() req: any,
    @UploadedFiles(
      new FilesValidationPipe({
        maxSize: 2 * 1024 * 1024,
        allowedTypes: ['image/png', 'image/jpeg'],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.appService.manyFiles(files);
  }

  // ─── Multiple Fields with Multiple Files ────────────────────────────────────
  @Post('mixed')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'documents', maxCount: 3 },
      { name: 'images', maxCount: 5 },
    ]),
  )
  uploadMixed(
    @Req() req: any,
    @UploadedFiles(
      new FilesValidationPipe({
        maxSize: 10 * 1024 * 1024,
        allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        requireFilesInEachField: true,
      }),
    )
    files: Record<string, Express.Multer.File[]>,
  ) {
    return this.appService.mixedFiles(files);
  }
}