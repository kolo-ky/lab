import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {TasksService} from '../tasks.service';
import {Router, Event, NavigationStart} from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  private routeName = 'task';
  public showComponent = true;

  constructor(private tasksService: TasksService, private router: Router) {
    this.router.events.subscribe((event: Event) => {
    if (event instanceof NavigationStart) {
        this.showComponent = !event.url.includes(this.routeName);
      }
    });
  }

  public form: FormGroup = new FormGroup({
    title: new FormControl(),
    date: new FormControl()
  });

  addTask() {
    const id = this.tasksService.getTaskId();
    this.tasksService.addTask({...this.form.value, complete: false, id});
    this.form.reset();
  }

  ngOnInit() {
  }

}
