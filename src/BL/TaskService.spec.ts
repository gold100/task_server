import { TaskService } from './TaskService';
import { Test } from '@nestjs/testing';
import { TaskRepository } from '../DAL/task-repository.service';
import { ChangeStausDTO } from '../Entities/ChangeStausDTO';
import { TaskStatus } from '../Entities/TaskStatus';
import { ChangeMetaDataDTO } from '../Entities/ChangeMetaDataDTO';

describe('The Task Service', () => {
  let authenticationService: TaskService;
  let taskService: TaskService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskService,
        TaskRepository
      ],
    })
      .compile();
    taskService = await module.get(TaskService);
  })
  describe('Tasks actions', async () => {
    it('should create a task', async () => {
      await taskService.addTask('eat');
      const tasks = await taskService.getTasks();
      expect(tasks.length).toBe(1);
    })
    it('should delete task', async () => {
      await taskService.addTask('eat');
      const tasks = await taskService.getTasks();
      expect(tasks.length).toBe(1);
      await taskService.deleteTask('eat')
      expect(tasks.length).toBe(0);
    })
    it('should create only one task', async () => {
      await taskService.addTask('eat');
      await taskService.addTask('eat');
      const tasks = await taskService.getTasks();
      expect(tasks.length).toBe(1);
    })
    it('should complete task', async () => {
      await taskService.addTask('eat');
      const dto = new ChangeStausDTO();
      dto.name = 'eat';
      dto.status = TaskStatus.Completed;
      await taskService.updateStatus(dto);
      const tasks = await taskService.getTasks();
      expect(tasks[0].status).toBe(TaskStatus.Completed);
    })
    it('should not complete task again', async () => {
      await taskService.addTask('eat');
      const dto = new ChangeStausDTO();
      dto.name = 'eat';
      dto.status = TaskStatus.Completed;
      await taskService.updateStatus(dto);
      const validation = await taskService.updateStatus(dto);
      expect(validation.isValid).toBe(false);
    })
    it('should undo task', async () => {
      await taskService.addTask('eat');
      const dto = new ChangeStausDTO();
      dto.name = 'eat';
      dto.status = TaskStatus.Open;
      await taskService.updateStatus(dto);
      const tasks = await taskService.getTasks();
      expect(tasks[0].status).toBe(TaskStatus.Open);
    })
    it('should not undo task again', async () => {
      await taskService.addTask('eat');
      const dto = new ChangeStausDTO();
      dto.name = 'eat';
      dto.status = TaskStatus.Open;
      await taskService.updateStatus(dto);
      const validation = await taskService.updateStatus(dto);
      expect(validation.isValid).toBe(false);
    })
    it('should update meta data', async () => {
      await taskService.addTask('eat');
      const dto = new ChangeMetaDataDTO();
      dto.oldName = 'eat';
      dto.newName = 'drink';
      await taskService.updateMetadata(dto);
      const tasks = await taskService.getTasks();
      expect(tasks[0].name).toBe('drink');
    })
  })
});
