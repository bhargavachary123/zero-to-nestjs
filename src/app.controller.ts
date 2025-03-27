import { Controller, FileTypeValidator, Get, HttpStatus, Ip, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { WinstonLogger } from './config/winston.logger';
import { SkipAuthGuard } from './auth/skipauth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('upload-file')
  @SkipAuthGuard()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      validators: [
        new MaxFileSizeValidator({ maxSize: 10000000 }), // 10 mb
        new FileTypeValidator({ fileType: 'application/pdf' }),
      ],
    }))
    file: Express.Multer.File
  ): string {
    return this.appService.uploadFile(file);
  }
}