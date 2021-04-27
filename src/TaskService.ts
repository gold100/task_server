import { Injectable } from '@nestjs/common';
import { Task } from './Entities/Task';
import { ChangeMetaDataDTO } from './Entities/ChangeMetaDataDTO';
import { ChangeStausDTO } from './Entities/ChangeStausDTO';
import { ValidationObject } from './Entities/ValidationObject';
import { TaskRepository } from './task-repository.service';
import { TaskErrorMessage } from './Entities/TaskErrorMessage';
import { TaskStatus } from './Entities/TaskStatus';

@Injectable()
export class TaskService{

  constructor(private taskRepo: TaskRepository) {
  }

  getTasks(): Task[]{
    return this.taskRepo.getTasks();
  }

  getCompletedTasks(): Task[]{
    return this.taskRepo.getCompletedTasks();
  }

  addTask(taskName: string): ValidationObject{
    const validation = new ValidationObject();
    const taskFromDb = this.taskRepo.getTask(taskName);
    if (!taskFromDb){
      this.taskRepo.addTask(taskName);
    }else{
      validation.setError(TaskErrorMessage.SAME_NAME_ERROR);
    }

    return validation;
  }

  updateMetadata(changeMetaData: ChangeMetaDataDTO): ValidationObject {
    const validation = new ValidationObject();
    const taskFromDb = this.taskRepo.getTask(changeMetaData.oldName);
    if (!taskFromDb) {
      validation.setError(TaskErrorMessage.TASK_NOT_EXISTS);
    } else {
      taskFromDb.name = changeMetaData.newName;
      this.taskRepo.updateTask(taskFromDb);
    }

    return validation;
  }

  updateStatus(changeStatusDTO: ChangeStausDTO): ValidationObject{
    const validation = new ValidationObject();
    const taskFromDb = this.taskRepo.getTask(changeStatusDTO.name);
    if (!taskFromDb) {
      validation.setError(TaskErrorMessage.TASK_NOT_EXISTS);
    } else {
      if (taskFromDb.status == TaskStatus.Completed && changeStatusDTO.status == TaskStatus.Completed){
        validation.setError(TaskErrorMessage.UPDATE_COMPLETED_TASK);
      }else  if (taskFromDb.status == TaskStatus.Open && changeStatusDTO.status == TaskStatus.Open){
        validation.setError(TaskErrorMessage.UNDO_INCOMPLETE);
      }else{
        taskFromDb.status = changeStatusDTO.status;
        this.taskRepo.updateTask(taskFromDb);
      }
    }
    return validation;
  }

  deleteTask(taskName: string): ValidationObject{
    const validation = new ValidationObject();
    const taskFromDb = this.taskRepo.getTask(taskName);
    if (!taskFromDb) {
      validation.setError(TaskErrorMessage.TASK_NOT_EXISTS);
    } else {
      this.taskRepo.deleteTask(taskFromDb);
    }
    return validation;
  }
}
