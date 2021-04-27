import { Module } from '@nestjs/common';
import { TaskService } from './TaskService';
import { TaskController } from './TaskController';
import { TaskRepository } from './task-repository.service';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class AppModule {}
