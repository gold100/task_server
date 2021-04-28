import { Injectable } from '@nestjs/common';
import { Task } from '../Entities/Task';
import { ChangeStausDTO } from '../Entities/ChangeStausDTO';
import { ValidationObject } from '../Entities/ValidationObject';
import { TaskRepository } from '../DAL/task-repository.service';
import { TaskErrorMessage } from '../Entities/TaskErrorMessage';
import { TaskStatus } from '../Entities/TaskStatus';

@Injectable()
export class ValidationService {

  constructor(private taskRepo: TaskRepository) {
  }

  getStatusValidation(changeStatusDTO: ChangeStausDTO,
                      oldStatus: TaskStatus, validation: ValidationObject) {
    if (oldStatus == TaskStatus.Completed && changeStatusDTO.status == TaskStatus.Completed) {
      validation.setError(TaskErrorMessage.UPDATE_COMPLETED_TASK);
    } else if (oldStatus == TaskStatus.Open && changeStatusDTO.status == TaskStatus.Open) {
      validation.setError(TaskErrorMessage.UNDO_INCOMPLETE);
    }

    return validation;
  }

  getTaskExistValidation(task: Task,
                         validation: ValidationObject) {
    if (!task) {
      validation.setError(TaskErrorMessage.TASK_NOT_EXISTS);
    }
    return validation;
  }

  getTaskAlreadyExistValidation(task: Task,
                                validation: ValidationObject){
    if (task){
      validation.setError(TaskErrorMessage.SAME_NAME_ERROR);
    }

    return validation;
  }
}
