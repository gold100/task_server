import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChangeStausDTO } from './Entities/ChangeStausDTO';
import { ChangeMetaDataDTO } from './Entities/ChangeMetaDataDTO';
import { TaskService } from './TaskService';

@Controller('task')
export class TaskController {

  constructor(private taskService: TaskService) {
  }

  @Get('/')
  async getTasks() {
    return this.taskService.getTasks();
  }

  @Get('/completed')
  async getCompletedTasks() {
    return this.taskService.getCompletedTasks();
  }

  @Post('create')
  async addTask(@Body() data: any) {
    return this.taskService.addTask(data.body);
  }

  @Post('updateMetadata')
  async updateMetadata(@Body() data: any) {
    return this.taskService.updateMetadata(data.body);
  }

  @Post('changeStatus')
  async changeStatus(@Body() data: any) {
    return this.taskService.updateStatus(data.body);
  }

  @Delete(':name')
  async delete(@Param('name') name) {
    return this.taskService.deleteTask(name);
  }
}
