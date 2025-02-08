import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.loginForm.get('password')?.setErrors({ wrongCredentials: true });
    this.appService
      .login(this.loginForm.value.userName, this.loginForm.value.password)
      .subscribe((response: any) => {
        if (response) {
          if (
            response.data !== undefined &&
            response.data.access_token !== undefined
          ) {
            this.appService.saveToken(response.data.access_token);
            this.router.navigate(['/tasks']);
            this.loginForm
              .get('password')
              ?.setErrors({ wrongCredentials: null });
          } else {
            // trigger form error
            this.loginForm
              .get('password')
              ?.setErrors({ wrongCredentials: true });
          }
        }
      });
  }
}
