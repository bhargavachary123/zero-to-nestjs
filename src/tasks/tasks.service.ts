import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobType, Tasks } from './entities/tasks.entity';

export const CALLBACKS: Record<string, (jobName: string) => void> = {
  logTime: (jobName) => console.log(`${jobName} ${new Date().toISOString()} Job ran!`),
  notifyAdmin: (jobName) => console.log(`${jobName} Notify admin: job executed!`),
  backupDatabase: (jobName) => console.log(`${jobName} Triggering database backup...`),
  clearTempCache: (jobName) => console.log(`${jobName} Clearing temp cache...`),
  // Add more callbacks as needed
};

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepo: Repository<Tasks>,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    await this.restoreJobs();
  }

  private getCallback(name:string, type: string): (() => void) | undefined {
    return () => CALLBACKS[type](name);
  }

  private async restoreJobs() {
    const jobs = await this.tasksRepo.find({ where: { active: true } });
    for (const job of jobs) {
      if (job.type === 'cron') {
        const cronJob = new CronJob(job.schedule, () => this.handleJobExecution(job.name));
        this.schedulerRegistry.addCronJob(job.name, cronJob);
        cronJob.start();
      } else if (job.type === 'interval') {
        const intervalId = setInterval(() => this.handleJobExecution(job.name), +job.schedule);
        this.schedulerRegistry.addInterval(job.name, intervalId);
      } else if (job.type === 'timeout') {
        const timeoutId = setTimeout(() => this.handleJobExecution(job.name), +job.schedule);
        this.schedulerRegistry.addTimeout(job.name, timeoutId);
      }
      this.logger.log(`Restored job "${job.name}" (${job.type})`);
    }
  }

  private async handleJobExecution(name: string) {
    const job = await this.tasksRepo.findOne({ where: { name } });
    if (!job) {
      this.logger.warn(`Unknown job execution requested: ${name}`);
      return;
    }
    const callback = this.getCallback(name,  job.callbackType);
    if (!callback) {
      this.logger.warn(`No callback found for job: ${job.callbackType}`);
      return;
    }
    try {
      callback();
    } catch (err) {
      this.logger.error(`Job "${name}" failed: ${err.message}`);
    }
  }

  async createCronJob(
    name: string,
    cronTime: string,
    callbackType: string,
  ): Promise<{ success: boolean; message: string }> {
    if (await this.tasksRepo.findOne({ where: { name } })) {
      return { success: false, message: `Job "${name}" already exists` };
    }
    const callback = this.getCallback(name, callbackType);
    if (!callback) {
      return { success: false, message: `Invalid callbackType: ${callbackType}` };
    }
    try {
      const cronJob = new CronJob(cronTime, () => this.handleJobExecution(name));
      console.log(`Creating cron job "${name}" with schedule: ${cronTime}`);
      this.schedulerRegistry.addCronJob(name, cronJob);
      cronJob.start();


      const newJob = this.tasksRepo.create({
        name,
        type: 'cron',
        schedule: cronTime,
        callbackType,
        active: true,
      });
      await this.tasksRepo.save(newJob);
      this.logger.log(`Created cron job "${name}"`);
      return { success: true, message: `Cron job "${name}" created` };
    } catch (err) {
      this.logger.error(`Create cron job failed: ${err.message}`);
      return { success: false, message: err.message };
    }
  }

  async createIntervalJob(
    name: string,
    milliseconds: number,
    callbackType: string,
  ): Promise<{ success: boolean; message: string }> {
    if (await this.tasksRepo.findOne({ where: { name } })) {
      return { success: false, message: `Job "${name}" already exists` };
    }
    const callback = this.getCallback(name, callbackType);
    if (!callback) {
      return { success: false, message: `Invalid callbackType: ${callbackType}` };
    }
    try {
      const intervalId = setInterval(() => this.handleJobExecution(name), milliseconds);
      this.schedulerRegistry.addInterval(name, intervalId);

      const newJob = this.tasksRepo.create({
        name,
        type: 'interval',
        schedule: milliseconds.toString(),
        callbackType,
        active: true,
      });
      await this.tasksRepo.save(newJob);
      this.logger.log(`Created interval job "${name}"`);
      return { success: true, message: `Interval job "${name}" created` };
    } catch (err) {
      this.logger.error(`Create interval job failed: ${err.message}`);
      return { success: false, message: err.message };
    }
  }

  async createTimeoutJob(
    name: string,
    milliseconds: number,
    callbackType: string,
  ): Promise<{ success: boolean; message: string }> {
    if (await this.tasksRepo.findOne({ where: { name } })) {
      return { success: false, message: `Job "${name}" already exists` };
    }
    const callback = this.getCallback(name, callbackType);
    if (!callback) {
      return { success: false, message: `Invalid callbackType: ${callbackType}` };
    }
    try {
      const timeoutId = setTimeout(() => this.handleJobExecution(name), milliseconds);
      this.schedulerRegistry.addTimeout(name, timeoutId);

      const newJob = this.tasksRepo.create({
        name,
        type: 'timeout',
        schedule: milliseconds.toString(),
        callbackType,
        active: true,
      });
      await this.tasksRepo.save(newJob);
      this.logger.log(`Created timeout job "${name}"`);
      return { success: true, message: `Timeout job "${name}" created` };
    } catch (err) {
      this.logger.error(`Create timeout job failed: ${err.message}`);
      return { success: false, message: err.message };
    }
  }

  async deleteJob(
    name: string,
    type: JobType,
  ): Promise<{ success: boolean; message: string }> {
    try {
      switch (type) {
        case 'cron':
          this.schedulerRegistry.deleteCronJob(name);
          break;
        case 'interval':
          this.schedulerRegistry.deleteInterval(name);
          break;
        case 'timeout':
          this.schedulerRegistry.deleteTimeout(name);
          break;
      }
      await this.tasksRepo.delete({ name });
      this.logger.log(`Deleted job "${name}" (${type})`);
      return { success: true, message: `Deleted` };
    } catch (err) {
      this.logger.error(`Delete job failed: ${err.message}`);
      return { success: false, message: err.message };
    }
  }

  async getAllJobs() {
    return {
      cron: this.schedulerRegistry.getCronJobs(),
      interval: this.schedulerRegistry.getIntervals(),
      timeout: this.schedulerRegistry.getTimeouts(),
    };
  }

  async jobExists(
    name: string,
    type: JobType,
  ): Promise<boolean> {
    return this.schedulerRegistry.doesExist(type, name);
  }

  async stopJob(
    name: string,
    type: JobType,
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (type === 'cron') {
        this.schedulerRegistry.getCronJob(name).stop();
      } else if (type === 'interval') {
        clearInterval(this.schedulerRegistry.getInterval(name));
      } else if (type === 'timeout') {
        clearTimeout(this.schedulerRegistry.getTimeout(name));
      }
      this.logger.log(`Stopped job "${name}" (${type})`);
      return { success: true, message: `Stopped` };
    } catch (err) {
      this.logger.error(`Stop job failed: ${err.message}`);
      return { success: false, message: err.message };
    }
  }

  async startJob(
    name: string,
    type: JobType,
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (type === 'cron') {
        this.schedulerRegistry.getCronJob(name).start();
        this.logger.log(`Started cron job "${name}"`);
        return { success: true, message: `Started` };
      }
      return { success: false, message: `${type} jobs cannot be restarted` };
    } catch (err) {
      this.logger.error(`Start job failed: ${err.message}`);
      return { success: false, message: err.message };
    }
  }
}