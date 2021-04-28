import { Module } from '@nestjs/common';
import { TaskService } from './BL/TaskService';
import { TaskController } from './TaskController';
import { TaskRepository } from './DAL/task-repository.service';
import { ValidationService } from './BL/ValidationService';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [TaskService, ValidationService, TaskRepository],
})
export class AppModule {}
