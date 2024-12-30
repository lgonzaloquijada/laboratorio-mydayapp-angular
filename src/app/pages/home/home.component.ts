import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  subs: Subscription[] = [];

  tasks: Task[] = [];
  filter: string = '';

  constructor() {}

  ngOnInit(): void {
    this.subs.push(
      this.taskService.tasks$.subscribe((tasks) => {
        this.tasks = tasks;
      })
    );

    this.subs.push(
      this.route.params.subscribe((params) => {
        this.filter = params['filter'];
        this.taskService.setFilter(this.filter);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
