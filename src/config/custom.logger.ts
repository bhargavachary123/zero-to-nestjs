import { LoggerService, Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class CustomLogger extends ConsoleLogger implements LoggerService {
  constructor(context?: string) {
    super();
    this.setLogLevels(['warn', 'error', 'debug']);
    this.setContext(context);
  }

  log(message: string) {
    // Add custom log formatting or logic
    super.log(message);
  }

  error(message: string) {
    // Add custom error handling
    super.error(message)
  }

  warn(message: string) {
    // Add custom warning handling
    super.warn(message);
  }

  debug(message: string) {
    // Add custom debug handling
    super.debug(message);
  }

  verbose(message: string) {
    // Add custom verbose handling
    super.verbose(message);
  }
}