import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  tasks: Task[] = [];
  subs: Subscription | null = null;
  editingTask: number = -1;

  ngOnInit(): void {
    this.subs = this.taskService.filteredTasks$.subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  deleteTask(index: number) {
    this.taskService.deleteTask(index);
  }

  toggleTaskStatus(index: number) {
    this.taskService.toggleTaskStatus(index);
    return true;
  }

  editTask(index: number) {
    this.editingTask = index;
  }

  cancelEdit() {
    this.editingTask = -1;
  }

  saveTask(event: Event) {
    const inputRef = event.target as HTMLInputElement;
    const title = inputRef.value.trim();
    if (title !== '') {
      this.taskService.changeTaskTitle(this.editingTask, title);
    }

    this.editingTask = -1;
  }
}
