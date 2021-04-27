import { Injectable } from '@nestjs/common';
import { Task } from '../Entities/Task';
import { ChangeMetaDataDTO } from '../Entities/ChangeMetaDataDTO';
import { ChangeStausDTO } from '../Entities/ChangeStausDTO';
import { ValidationObject } from '../Entities/ValidationObject';
import { TaskRepository } from '../DAL/task-repository.service';
import { TaskErrorMessage } from '../Entities/TaskErrorMessage';
import { TaskStatus } from '../Entities/TaskStatus';

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
    let validation = new ValidationObject();
    const taskValidation = this.getTaskValidation(changeMetaData.oldName, validation);
    validation = taskValidation.validation;
    if (validation.isValid) {
      taskValidation.taskFromDb.name = changeMetaData.newName;
      this.taskRepo.updateTask(taskValidation.taskFromDb);
    }

    return validation;
  }

  updateStatus(changeStatusDTO: ChangeStausDTO): ValidationObject {
    let validation = new ValidationObject();
    const taskValidation = this.getTaskValidation(changeStatusDTO.name, validation);
    validation = taskValidation.validation;
    if (validation.isValid) {
      if (taskValidation.taskFromDb.status == TaskStatus.Completed && changeStatusDTO.status == TaskStatus.Completed) {
        validation.setError(TaskErrorMessage.UPDATE_COMPLETED_TASK);
      } else if (taskValidation.taskFromDb.status == TaskStatus.Open && changeStatusDTO.status == TaskStatus.Open) {
        validation.setError(TaskErrorMessage.UNDO_INCOMPLETE);
      } else {
        taskValidation.taskFromDb.status = changeStatusDTO.status;
        this.taskRepo.updateTask(taskValidation.taskFromDb);
      }
    }
    return validation;
  }

  deleteTask(taskName: string): ValidationObject{
    let validation = new ValidationObject();
    const taskValidation = this.getTaskValidation(taskName, validation);
    validation = taskValidation.validation;
    if (validation.isValid){
      this.taskRepo.deleteTask(taskValidation.taskFromDb);
    }

    return validation;
  }

  private getTaskValidation(taskName: string,
                    validation: ValidationObject){
    const taskFromDb = this.taskRepo.getTask(taskName);
    if (!taskFromDb) {
      validation.setError(TaskErrorMessage.TASK_NOT_EXISTS);
    }

    return { taskFromDb, validation };
  }
}
