import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TaskService } from './BL/TaskService';

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

  @Put('updateMetadata')
  async updateMetadata(@Body() data: any) {
    return this.taskService.updateMetadata(data.body);
  }

  @Put('changeStatus')
  async changeStatus(@Body() data: any) {
    return this.taskService.updateStatus(data.body);
  }

  @Post('deleteTask')
  async delete(@Body() data: any) {
    return this.taskService.deleteTask(data.body);
  }
}
