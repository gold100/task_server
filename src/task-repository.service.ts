import { Injectable } from '@nestjs/common';
import { Task } from './Entities/Task';
import { TaskStatus } from './Entities/TaskStatus';

const loki = require('lokijs'),
  db = new loki('tasks.json');

@Injectable()
export class TaskRepository {
  tasks: any;
  constructor() {
    this.tasks = db.addCollection('tasks');
  }

  getTasks(){
    return this.tasks.data;
  }

  getCompletedTasks(){
    const view = this.tasks.addDynamicView('completedTasks');
    view.applyWhere(obj => obj.status == TaskStatus.Completed);
    return view.data();
  }

  addTask(name: string){
    const task = new Task(name);
    this.tasks.insert(task);
  }

  getTask(name): Task{
    return this.tasks.findOne({ 'name': name });
  }

  updateTask(task: Task){
    this.tasks.update(task);
  }

  deleteTask(task: Task){
    this.tasks.remove(task);
  }
}
