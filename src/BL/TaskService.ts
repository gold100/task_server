import { Injectable } from '@nestjs/common';
import { Task } from '../Entities/Task';
import { ChangeMetaDataDTO } from '../Entities/ChangeMetaDataDTO';
import { ChangeStausDTO } from '../Entities/ChangeStausDTO';
import { ValidationObject } from '../Entities/ValidationObject';
import { TaskRepository } from '../DAL/task-repository.service';
import { ValidationService } from './ValidationService';

@Injectable()
export class TaskService{
  constructor(private taskRepo: TaskRepository,
              private validationService: ValidationService) {
  }

  getTasks(): Task[]{
    return this.taskRepo.getTasks();
  }

  getCompletedTasks(): Task[]{
    return this.taskRepo.getCompletedTasks();
  }

  addTask(taskName: string): ValidationObject{
    const taskFromDb = this.taskRepo.getTask(taskName);
    const validation = this.validationService.getTaskAlreadyExistValidation(taskFromDb, new ValidationObject());
    if (validation.isValid){
      this.taskRepo.addTask(taskName);
    }
    return validation;
  }

  updateMetadata(changeMetaData: ChangeMetaDataDTO): ValidationObject {
    const task = this.taskRepo.getTask(changeMetaData.oldName);
    const taskValidation = this.validationService.getTaskExistValidation(task, new ValidationObject());
    if (taskValidation.isValid) {
      task.name = changeMetaData.newName;
      this.taskRepo.updateTask(task);
    }

    return taskValidation;
  }

  updateStatus(changeStatusDTO: ChangeStausDTO): ValidationObject {
    const task = this.taskRepo.getTask(changeStatusDTO.name);
    let taskValidation = this.validationService.getTaskExistValidation(task, new ValidationObject());
    if (taskValidation.isValid) {
      taskValidation = this.validationService.getStatusValidation(changeStatusDTO, task.status, taskValidation);
      if (taskValidation.isValid) {
        task.status = changeStatusDTO.status;
        this.taskRepo.updateTask(task);
      }
    }
    return taskValidation;
  }

  deleteTask(taskName: string): ValidationObject {
    const task = this.taskRepo.getTask(taskName);
    const taskValidation = this.validationService.getTaskExistValidation(task, new ValidationObject());
    if (taskValidation.isValid) {
      this.taskRepo.deleteTask(task);
    }

    return taskValidation;
  }
}
