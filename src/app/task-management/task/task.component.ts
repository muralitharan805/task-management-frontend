import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../app.service';
import { ComponentType } from '@angular/cdk/portal';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
export interface ITask {
  _id: string;
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'startDate',
    'endDate',
    'status',
    'action',
  ];
  taskList = new MatTableDataSource<ITask>([]);
  @ViewChild(MatTable) table!: MatTable<ITask>;
  taskForm: FormGroup;
  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private appService: AppService
  ) {
    this.taskForm = formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  private apiUrl = environment.apiUrl;
  @ViewChild('taskFormDialog')
  taskFormDialog!: ComponentType<any>;

  @ViewChild('conforDialog')
  conforDialog!: ComponentType<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getTaskData();
    this.taskList.paginator = this.paginator;
    this.taskList.sort = this.sort;
  }
  totalTasks = 0;
  pageSize = 10;
  currentPage = 1;
  taskStatus = [
    {
      id: 'ToDo',
      name: 'ToDo',
    },
    {
      id: 'Pending',
      name: 'Pending',
    },
    {
      id: 'Completed',
      name: 'Completed',
    },
  ];
  private getTaskData() {
    this.httpClient
      .get(`${this.apiUrl}/task`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
      .subscribe((response: any) => {
        if (response.data !== undefined) {
          console.log('response.data ', response.data);

          this.taskList.data = response.data.list.map(
            (data: any, index: any) => {
              const taskList: ITask = {
                _id: data._id,
                id: index + 1,
                name: data.name ?? null,
                description: data.description ?? null,
                startDate: data.startDate ?? null,
                endDate: data.endDate ?? null,
                status: data.status ?? null,
              };
              return taskList;
            }
          );
          this.totalTasks = response.data.total;
        } else {
          this.taskList.data = [];
        }

        console.log('taskList ', this.taskList);
        // this.table.renderRows();
      });
  }

  isUpdate = false;
  storeUpdateTask!: ITask;
  saveTask() {
    if (this.taskForm.invalid) {
      return;
    }
    console.log('ddd');

    if (!this.isUpdate) {
      this.httpClient
        .post(
          `${this.apiUrl}/task`,
          {
            name: this.taskForm.value.name,
            description: this.taskForm.value.description,
            startDate: this.taskForm.value.startDate,
            endDate: this.taskForm.value.endDate,
            status: this.taskForm.value.status,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
          }
        )
        .subscribe((response: any) => {
          if (response.data !== undefined) {
            this.getTaskData();
            this.taskForm.reset();
            this.appService.closeDialog();
          }
        });
    } else {
      this.updateTask(this.storeUpdateTask);
      this.isUpdate = false;
    }
  }

  openTaskDialog() {
    this.appService.openDialog(this.taskFormDialog);
  }

  editTask(task: ITask) {
    this.isUpdate = true;
    console.log('task ', task);
    this.taskForm.patchValue({
      name: task.name,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      status: task.status,
    });
    this.storeUpdateTask = task;
    this.appService.openDialog(this.taskFormDialog);
  }

  private updateTask(task: ITask) {
    this.httpClient
      .patch(
        `${this.apiUrl}/task/${task._id}`,
        {
          name: this.taskForm.value.name,
          description: this.taskForm.value.description,
          startDate: this.taskForm.value.startDate,
          endDate: this.taskForm.value.endDate,
          status: this.taskForm.value.status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      )
      .subscribe((response: any) => {
        if (response.data !== undefined) {
          this.getTaskData();
          this.taskForm.reset();
          this.appService.closeDialog();
        }
      });
  }

  deleteTask(task: ITask) {
    this.appService
      .openDialog(this.conforDialog)
      .afterClosed()
      .subscribe((data) => {
        console.log(data);
        if (data) {
          this.httpClient
            .delete(`${this.apiUrl}/task/${task._id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
              },
            })
            .subscribe((response: any) => {
              if (response.data !== undefined) {
                this.getTaskData();
              }
            });
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.taskList.filter = filterValue;
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1; // MatPaginator uses zero-based index
    this.pageSize = event.pageSize;
    this.getTaskData();
  }
}
