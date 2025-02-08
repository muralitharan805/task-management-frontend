import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  country = [
    {
      id: 1,
      name: 'india',
    },
    {
      id: 2,
      name: 'US',
    },
  ];

  cities = [
    {
      id: 1,
      name: 'Tiruppur',
    },
    {
      id: 2,
      name: 'Coimbatore',
    },
  ];

  state = [
    {
      id: 1,
      name: 'Tamil Nadu',
    },
    {
      id: 2,
      name: 'Kearla',
    },
  ];

  registerForm: FormGroup;

  private apiUrl = environment.apiUrl;
  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.registerForm = formBuilder.group(
      {
        name: ['', Validators.required],
        email: ['', Validators.required],
        mobileNo: ['', Validators.required],
        password: ['', Validators.required],
        rePassword: ['', Validators.required],
        country: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        gender: ['Male', Validators.required],
      },
      {
        validator: [this.validateRetypePassword],
      }
    );
  }

  registerUser() {
    if (this.registerForm.invalid) {
      return;
    }
    this.httpClient
      .post(`${this.apiUrl}/auth/register`, {
        name: this.registerForm.value.name,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email,
        mobileNumber: this.registerForm.value.mobileNo,
        county: this.registerForm.value.country,
        city: this.registerForm.value.city,
        state: this.registerForm.value.state,
        gender: this.registerForm.value.gender,
      })
      .subscribe((data) => {
        this.registerForm.reset();
        this.router.navigate(['/tasks']);
      });
  }

  resetRegisterForm() {}

  validateRetypePassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      console.log('control.value ', control.value);

      return control.value.password === control.value.rePassword
        ? null
        : { passwordNoMatch: true };
    };
  }
}
