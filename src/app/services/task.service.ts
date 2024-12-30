import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private filterSubject = new BehaviorSubject<string>('');
  private filteredTasksSubject = new BehaviorSubject<Task[]>([]);
  private filterValues = ['all', 'completed', 'pending'];
  tasks$ = this.tasksSubject.asObservable();
  filter$ = this.filterSubject.asObservable();
  filteredTasks$ = this.filteredTasksSubject.asObservable();

  constructor() {
    const storage = localStorage.getItem('mydayapp-angular');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasksSubject.next(tasks);
      this.filteredTasksSubject.next(tasks);
    }
    this.trackTasks();
  }

  trackTasks() {
    this.tasks$.subscribe((tasks) => {
      const tasksString = JSON.stringify(tasks);
      localStorage.setItem('mydayapp-angular', tasksString);

      this.updateFilteredTasks();
    });
  }

  private updateFilteredTasks() {
    let tasks = this.tasksSubject.value;
    switch (this.filterSubject.value) {
      case 'completed':
        tasks = tasks.filter((task) => task.completed);
        break;
      case 'pending':
        tasks = tasks.filter((task) => !task.completed);
        break;
    }
    this.filteredTasksSubject.next(tasks);
  }

  setFilter(value: string) {
    console.log('changing filter');
    if (this.filterValues.indexOf(value) < 0) {
      value = 'all';
    }
    this.filterSubject.next(value);
    this.updateFilteredTasks();
  }

  createTast(value: string) {
    const newTask: Task = {
      id: Date.now(),
      title: value,
      completed: false,
    };
    this.tasksSubject.next([...this.tasksSubject.value, newTask]);
  }

  deleteTask(index: number) {
    this.tasksSubject.next(
      this.tasksSubject.value.filter((_, position) => position !== index)
    );
  }

  toggleTaskStatus(index: number) {
    this.tasksSubject.next(
      this.tasksSubject.value.map((task, position, _) => {
        if (position === index) {
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  }

  changeTaskTitle(index: number, title: string) {
    this.tasksSubject.next(
      this.tasksSubject.value.map((task, position) => {
        if (index === position) {
          return {
            ...task,
            title: title,
          };
        }
        return task;
      })
    );
  }

  clearCompleted() {
    this.tasksSubject.next(
      this.tasksSubject.value.filter((task) => !task.completed)
    );
  }
}
