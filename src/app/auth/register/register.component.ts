import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  hidePassword: boolean = true;
  hideRPassword: boolean = true;

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private snackBar: MatSnackBar){
    this.registerForm = this.fb.group({
      firstName: fb.control('', [Validators.required]),
      lastName: fb.control('', [Validators.required]),
      email: fb.control('', [Validators.required, Validators.email]),
      selectedOption: fb.control('USER', [Validators.required]),
      password: fb.control('', [Validators.required]),
    })
  }

  register() {

    let user = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value,
      userType: this.registerForm.get('selectedOption')?.value,
      password: this.registerForm.get('password')?.value
    }

    this.apiService.register(user).subscribe({
      next: res => {
        this.snackBar.open(res, "OK");
      }
    });
  }
}
