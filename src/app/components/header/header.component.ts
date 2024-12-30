import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private taskService = inject(TaskService);
  taskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  constructor() {}

  createTask() {
    const value = this.taskCtrl.value.trim();
    this.taskCtrl.setValue(value);

    if (this.taskCtrl.valid) {
      this.taskService.createTast(this.taskCtrl.value);
    }

    this.taskCtrl.setValue('');
  }

  cancelCreate() {
    this.taskCtrl.setValue('');
  }
}
