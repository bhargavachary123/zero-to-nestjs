import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from './entities/tasks.entity';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Tasks])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}