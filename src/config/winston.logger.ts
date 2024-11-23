import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    http: 4,
    verbose: 5,
    input: 6,
    silly: 7,
    data: 8,
    help: 9,
    prompt: 10,
    emerg: 11,
    alert: 12,
    crit: 13,
    notice: 14,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    http: 'magenta',
    verbose: 'cyan',
    input: 'grey',
    silly: 'magenta',
    data: 'white',
    help: 'cyan',
    prompt: 'grey',
    emerg: 'red',
    alert: 'yellow',
    crit: 'red',
    notice: 'blue',
  },
};

@Injectable()
export class WinstonLogger {
  private readonly logger: winston.Logger;

  constructor() {
    const logDir = path.join(process.cwd(), 'logs');

    this.logger = winston.createLogger(
      {
        level: 'notice', // Set log level according to usage
        levels: customLevels.levels,
        format: winston.format.combine(
          winston.format.ms(),
          winston.format.timestamp(),
          winston.format.colorize({ all: true, colors: customLevels.colors }),
          winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
          }),
        ),
        transports: [
          new winston.transports.DailyRotateFile({
            level: 'data',
            filename: 'rotate-%DATE%.log',
            dirname: logDir,
            format: winston.format.uncolorize(),
            zippedArchive: true,
            datePattern: 'YYYY-MM-DD',
            maxFiles: '20d',
            maxSize: '30m',
          })
        ],
      });
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console()
      )
    }
  }

  // for cli and npm levels
  error(message: string, trace?: string) {
    this.logger.error(trace ? `${message} - ${trace}` : message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  help(message: string) {
    this.logger.help(message);
  }

  data(message: string) {
    this.logger.data(message);
  }

  info(message: string) {
    this.logger.info(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  prompt(message: string) {
    this.logger.prompt(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }

  http(message: string) {
    this.logger.http(message);
  }

  silly(message: string) {
    this.logger.silly(message);
  }

  input(message: string) {
    this.logger.input(message);
  }

  // for syslog levels only
  alert(message: string) {
    this.logger.alert(message);
  }

  crit(message: string) {
    this.logger.crit(message);
  }

  notice(message: string) {
    this.logger.notice(message);
  }

  emerg(message: string) {
    this.logger.emerg(message);
  }
}