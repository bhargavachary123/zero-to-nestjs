import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  createCronJob(name: string, cronTime: string, callback: () => void): { success: boolean; message: string } {
    try {
      const job = new CronJob(cronTime, callback);
      this.schedulerRegistry.addCronJob(name, job);
      job.start();
      this.logger.log(`Cron job "${name}" created and started`);
      return { success: true, message: `Cron job "${name}" created and started` };
    } catch (error) {
      this.logger.error(`Failed to create cron job "${name}": ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  createIntervalJob(name: string, milliseconds: number, callback: () => void): { success: boolean; message: string } {
    try {
      const interval = setInterval(callback, milliseconds);
      this.schedulerRegistry.addInterval(name, interval);
      this.logger.log(`Interval job "${name}" created and started`);
      return { success: true, message: `Interval job "${name}" created and started` };
    } catch (error) {
      this.logger.error(`Failed to create interval job "${name}": ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  createTimeoutJob(name: string, milliseconds: number, callback: () => void): { success: boolean; message: string } {
    try {
      const timeout = setTimeout(callback, milliseconds);
      this.schedulerRegistry.addTimeout(name, timeout);
      this.logger.log(`Timeout job "${name}" created and started`);
      return { success: true, message: `Timeout job "${name}" created and started` };
    } catch (error) {
      this.logger.error(`Failed to create timeout job "${name}": ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  deleteJob(name: string, type: 'cron' | 'interval' | 'timeout'): { success: boolean; message: string } {
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
      this.logger.log(`Job "${name}" of type "${type}" deleted successfully`);
      return { success: true, message: `Job "${name}" of type "${type}" deleted successfully` };
    } catch (error) {
      this.logger.error(`Failed to delete job "${name}": ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  getAllJobs() {
    return {
      cron: this.schedulerRegistry.getCronJobs(),
      interval: this.schedulerRegistry.getIntervals(),
      timeout: this.schedulerRegistry.getTimeouts(),
    };
  }

  jobExists(name: string, type: 'cron' | 'interval' | 'timeout'): boolean {
    try {
      return this.schedulerRegistry.doesExist(type, name);
    } catch (error) {
      this.logger.error(`Error checking job existence: ${error.message}`);
      return false;
    }
  }

  stopJob(name: string, type: 'cron' | 'interval' | 'timeout'): { success: boolean; message: string } {
    try {
      switch (type) {
        case 'cron':
          this.schedulerRegistry.getCronJob(name).stop();
          break;
        case 'interval':
          clearInterval(this.schedulerRegistry.getInterval(name));
          break;
        case 'timeout':
          clearTimeout(this.schedulerRegistry.getTimeout(name));
          break;
      }
      this.logger.log(`Job "${name}" of type "${type}" stopped successfully`);
      return { success: true, message: `Job "${name}" of type "${type}" stopped successfully` };
    } catch (error) {
      this.logger.error(`Failed to stop job "${name}": ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  startJob(name: string, type: 'cron' | 'interval' | 'timeout'): { success: boolean; message: string } {
    try {
      if (type === 'cron') {
        this.schedulerRegistry.getCronJob(name).start();
        this.logger.log(`Job "${name}" of type "cron" started successfully`);
        return { success: true, message: `Job "${name}" of type "cron" started successfully` };
      } else {
        const msg = `${capitalize(type)} jobs cannot be restarted. Please recreate the job.`;
        this.logger.warn(msg);
        return { success: false, message: msg };
      }
    } catch (error) {
      this.logger.error(`Failed to start job "${name}": ${error.message}`);
      return { success: false, message: error.message };
    }
  }
}