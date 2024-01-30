import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  hidePassword: boolean = true;

  constructor(fb: FormBuilder, private apiService: ApiService, private snackBar: MatSnackBar){
    
    this.loginForm = fb.group({
      email: fb.control('', [Validators.required, Validators.email]),
      password: fb.control('', [Validators.required]),
      selectedOption: fb.control('USER', [Validators.required]),
    })
  }

  login(){

    let user = {
      email: this.loginForm.get('email')?.value,
      userType: this.loginForm.get('selectedOption')?.value,
      password: this.loginForm.get('password')?.value,
    }

    this.apiService.login(user).subscribe({
      next: res => {
        
        if( res === "NO ACCOUNT"){
            this.snackBar.open("!!! Invalid Credentials !!!", "OK");
        }
        else{
          this.snackBar.open("Welcome", "Ok")
          localStorage.setItem('access_token', res);
          this.apiService.userStatus.next("loggedIn");
        }
      }
    })
  }

}
