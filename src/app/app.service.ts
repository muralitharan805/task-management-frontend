import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private tokenKey = 'auth_token';
  private apiUrl = environment.apiUrl;
  constructor(
    private httpClient: HttpClient,
    private dialogRef: MatDialogRef<any>
  ) {}

  login(userName: string, password: string) {
    return this.httpClient.post(`${this.apiUrl}/auth/login`, {
      email: userName,
      password: password,
    });
  }
  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  dialog = inject(MatDialog);

  openDialog(component: ComponentType<unknown>) {
    this.dialogRef = this.dialog.open(component, {
      width: '500px',
    });
    return this.dialogRef;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
