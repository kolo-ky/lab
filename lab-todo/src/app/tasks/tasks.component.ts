import { Component, OnInit } from '@angular/core';
import {TasksService} from '../tasks.service';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  public tasks;
  private deadLineDays = 3;
  private newTaskClass = 'task-list__item';
  private completeTaskClass = 'task-list__item--complete';
  private deadlineTaskClass = 'task-list__item--deadline';

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.tasks = this.tasksService.getAll();
  }

  taskDate(task) {
    const dateArr = task.date.split('.');
    return new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
  }

  currentDate() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + this.deadLineDays);
    return currentDate;
  }

  isSameOrAfter(task) {
    return this.currentDate() >= this.taskDate(task);
  }

  getTaskComponent(task): string {
    if (task.complete) {
      return `${this.newTaskClass} ${this.completeTaskClass}`;
    } else {
      if (this.isSameOrAfter(task)) {
        return `${this.newTaskClass} ${this.deadlineTaskClass}`;
      } else {
        return this.newTaskClass;
      }
    }
  }

  dropped(event: CdkDragDrop<string[]>) {
    this.tasksService.sortTasks(event);
  }

  onClickTask(event, taskId) {
    event.stopPropagation();
    this.tasksService.toPerformTask(taskId);
  }

}
