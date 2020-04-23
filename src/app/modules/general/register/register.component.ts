import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  fgRegistration: FormGroup;
  registrationError: boolean = false;
  registrationErrorMessage: string = "";

  constructor(
    private authSvc: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.authSvc.isLoggedIn()) {
      this.authSvc.logout();
      window.location.reload();
    }
    
    this.fgRegistration = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    })
  }

  register() {
    this.registrationError = false;
    this.registrationErrorMessage = "";
    if (this.fgRegistration.valid) {
      this.authSvc.register(this.fgRegistration.value).subscribe(result => {
        if (result.message == null) {
          console.log("registration success");
          this.router.navigate(['login'], { queryParams: { isRegistered: true } });        
        }
        else {
          this.registrationError = true;
          this.registrationErrorMessage = result.message;
        }
      })
    }
  }
}
