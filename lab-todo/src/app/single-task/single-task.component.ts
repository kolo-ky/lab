import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TasksService} from '../tasks.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-single-task',
  templateUrl: './single-task.component.html',
  styleUrls: ['./single-task.component.css']
})
export class SingleTaskComponent implements OnInit {
  public task;

  constructor(private route: ActivatedRoute, private tasksService: TasksService, private router: Router) {
    this.route.params.subscribe(param => {
      this.task = this.tasksService.findTask(parseInt(param.taskId, 10));
    });
  }

  public editForm: FormGroup = new FormGroup({
    title: new FormControl(),
    date: new FormControl()
  });

  editTask() {
    this.task.title = this.editForm.value.title ? this.editForm.value.title : this.task.title;
    this.task.date = this.editForm.value.date ? this.editForm.value.date : this.task.date;
    this.tasksService.editTask(this.task);
    this.backToTasks();
  }

  backToTasks() {
    this.router.navigate(['']);
  }

  ngOnInit() {
  }

}
