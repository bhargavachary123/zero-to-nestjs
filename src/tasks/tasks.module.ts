import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}