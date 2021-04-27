import { TaskStatus } from './TaskStatus';

export class Task{
  id: number;
  name: string;
  creationTime: Date;
  updateTime: Date;
  status: TaskStatus;


  constructor(name: string) {
    this.name = name;
    this.status = TaskStatus.Open;
    this.creationTime = new Date();
  }
}
