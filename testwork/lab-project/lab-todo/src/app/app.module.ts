import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TasksComponent } from './tasks/tasks.component';
import { FooterComponent } from './footer/footer.component';
import {TasksService} from './tasks.service';
import {ReactiveFormsModule} from '@angular/forms';
import { SingleTaskComponent } from './single-task/single-task.component';
import { ViewTaskComponent } from './view-task/view-task.component';

export const routes = [
  {
    path: '',
    component: TasksComponent
  },
  {
    path: 'task/edit/:taskId',
    component: SingleTaskComponent
  },
  {
    path: 'task/view/:taskId',
    component: ViewTaskComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TasksComponent,
    FooterComponent,
    SingleTaskComponent,
    ViewTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DragDropModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    TasksService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
