import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

export class TasksService {
  private tasks = [
    {
      id: 1,
      title: 'Изучить тестовое задание',
      date: '14.02.2019',
      complete: true
    },
    {
      id: 2,
      title: 'Изучить Angular',
      date: '25.02.2019',
      complete: false
    },
    {
      id: 3,
      title: 'Написать тестовое задание',
      date: '19.02.2019',
      complete: false
    }
  ];
  private lastTaskId = 0;

  constructor() {
    this.setLastId();
  }

  // поиск задачи
  public findTask(taskId) {
    return this.tasks.find(item => item.id === taskId);
  }

  // изменение задачи
  public editTask(payload) {
    this.tasks = this.tasks.map(item => {
      if (item.id === payload.id) {
        item = {...payload};
      }
      return item;
    });
  }

  // геттер всех задач
  public getAll() {
    return this.tasks;
  }

  // добавляет задачу
  public addTask(payload) {
    this.tasks.push(payload);
  }

  // устанавливает последний id
  private setLastId() {
    this.tasks.forEach(item => {
      if (item.id > this.lastTaskId) {
        this.lastTaskId = item.id;
      }
    });
  }

  // получает новый id
  public getTaskId() {
    return this.lastTaskId = this.lastTaskId + 1;
  }

  // метод выполнения/не выполнения задачи
  public toPerformTask(taskId) {
    this.tasks = this.tasks.map(item => {
      if (item.id === taskId) {
        item.complete = !item.complete;
      }
      return item;
    });
  }

  // метод перемещения задач
  public sortTasks(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.tasks,
      event.previousIndex,
      event.currentIndex
    );
  }
}
