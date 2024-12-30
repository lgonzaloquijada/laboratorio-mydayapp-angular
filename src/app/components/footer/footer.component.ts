import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, OnDestroy {
  private taskService = inject(TaskService);

  tasks: Task[] = [];
  subs: Subscription[] = [];
  pendingTasks: number = 0;
  filter: string = '';

  ngOnInit(): void {
    this.subs.push(
      this.taskService.filteredTasks$.subscribe((tasks) => {
        this.tasks = tasks;
        this.pendingTasks = tasks.reduce(
          (count, task) => (task.completed ? count : ++count),
          0
        );
      })
    );

    this.subs.push(
      this.taskService.filter$.subscribe((filter) => {
        this.filter = filter;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  clearCompleted() {
    this.taskService.clearCompleted();
  }
}
