import { 
  Controller, 
  Post, 
  Delete, 
  Get, 
  Body, 
  Param, 
  Logger, 
  BadRequestException 
} from '@nestjs/common';
import {
    Cron,
    CronExpression,
    Interval,
    Timeout,
} from '@nestjs/schedule';
import { TasksService } from './tasks.service';

const CALLBACKS: Record<string, () => void> = {
  logTime: () => console.log(`[${new Date().toISOString()}] Job ran!`),
  notifyAdmin: () => console.log('Notify admin: job executed!'),
  // Add more as needed
};

@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  // ─── Cron Jobs ─────────────────────────────────────────────────────────────

  /**  Runs every minute */
  @Cron(CronExpression.EVERY_MINUTE)
  handleEveryMinute() {
    this.logger.debug('Called every minute');
  }

  /**  Runs daily at 5:00 AM  */
  @Cron('0 5 * * *')
  handleDailyAtFive() {
    this.logger.log('Daily job at 5 AM');
  }

  // ─── Interval & Timeout ────────────────────────────────────────────────────

  /**  Runs every 10 seconds  */
  @Interval(10_000)
  handleInterval() {
    this.logger.debug('Called every 10 seconds');
  }

  /**  Runs once, 20 seconds after app start  */
  @Timeout(20_000)
  handleTimeout() {
    this.logger.debug('Called once after 20 seconds');
  }
  // ─── Dynamicschedule's ────────────────────────────────────────────────────
  @Post('cron')
  createCronJob(
    @Body() body: { name: string; cronTime: string; callbackType: string },
  ) {
    const callback = CALLBACKS[body.callbackType];
    if (!callback) {
      throw new BadRequestException('Invalid or unsupported callbackType');
    }
    return this.tasksService.createCronJob(body.name, body.cronTime, callback);
  }

  @Post('interval')
  createIntervalJob(
    @Body() body: { name: string; milliseconds: number; callbackType: string },
  ) {
    const callback = CALLBACKS[body.callbackType];
    if (!callback) {
      throw new BadRequestException('Invalid or unsupported callbackType');
    }
    return this.tasksService.createIntervalJob(body.name, body.milliseconds, callback);
  }

  @Post('timeout')
  createTimeoutJob(
    @Body() body: { name: string; milliseconds: number; callbackType: string },
  ) {
    const callback = CALLBACKS[body.callbackType];
    if (!callback) {
      throw new BadRequestException('Invalid or unsupported callbackType');
    }
    return this.tasksService.createTimeoutJob(body.name, body.milliseconds, callback);
  }

  @Delete(':type/:name')
  deleteJob(
    @Param('type') type: 'cron' | 'interval' | 'timeout',
    @Param('name') name: string,
  ) {
    return this.tasksService.deleteJob(name, type);
  }

  @Get()
  getAllJobs() {
    return this.tasksService.getAllJobs();
  }

  @Get(':type/:name')
  checkJobExists(
    @Param('type') type: 'cron' | 'interval' | 'timeout',
    @Param('name') name: string,
  ) {
    return this.tasksService.jobExists(name, type);
  }

  @Post(':type/:name/stop')
  stopJob(
    @Param('type') type: 'cron' | 'interval' | 'timeout',
    @Param('name') name: string,
  ) {
    return this.tasksService.stopJob(name, type);
  }

  @Post(':type/:name/start')
  startJob(
    @Param('type') type: 'cron' | 'interval' | 'timeout',
    @Param('name') name: string,
  ) {
    return this.tasksService.startJob(name, type);
  }
}