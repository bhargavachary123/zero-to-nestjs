import {
  Controller, Post, Delete, Get, Body, Param, Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateCronDto } from './dto/create-cron.dto';
import { CreateIntervalDto } from './dto/create-interval.dto';
import { CreateTimeoutDto } from './dto/create-timeout.dto';
import { JobType } from './entities/tasks.entity';

@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) { }

  @Post('cron')
  async createCron(@Body() dto: CreateCronDto) {
    return this.tasksService.createCronJob(dto.name, dto.cronTime, dto.callbackType);
  }

  @Post('interval')
  async createInterval(@Body() dto: CreateIntervalDto) {
    return this.tasksService.createIntervalJob(dto.name, dto.milliseconds, dto.callbackType);
  }

  @Post('timeout')
  async createTimeout(@Body() dto: CreateTimeoutDto) {
    return this.tasksService.createTimeoutJob(dto.name, dto.milliseconds, dto.callbackType);
  }

  @Delete(':type/:name')
  async deleteJob(
    @Param('type') type: JobType,
    @Param('name') name: string,
  ) {
    return this.tasksService.deleteJob(name, type);
  }

  @Get()
  async getAllJobs() {
    return this.tasksService.getAllJobs();
  }

  @Get(':type/:name')
  async checkJobExists(
    @Param('type') type: JobType,
    @Param('name') name: string,
  ) {
    return this.tasksService.jobExists(name, type);
  }

  @Post(':type/:name/stop')
  async stopJob(
    @Param('type') type: JobType,
    @Param('name') name: string,
  ) {
    return this.tasksService.stopJob(name, type);
  }

  @Post(':type/:name/start')
  async startJob(
    @Param('type') type: JobType,
    @Param('name') name: string,
  ) {
    return this.tasksService.startJob(name, type);
  }
}