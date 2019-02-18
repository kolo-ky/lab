import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TasksService} from '../tasks.service';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  public task;

  constructor(private route: ActivatedRoute, private tasksService: TasksService, private router: Router) {
    this.route.params.subscribe(param => {
      this.task = this.tasksService.findTask(parseInt(param.taskId, 10));
    });
  }

  backToTasks() {
    this.router.navigate(['']);
  }

  ngOnInit() {
  }

}
