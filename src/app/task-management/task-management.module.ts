import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskManagementRoutingModule } from './task-management-routing.module';
import { TaskComponent } from './task/task.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TaskComponent],
  imports: [
    CommonModule,
    TaskManagementRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class TaskManagementModule {}
