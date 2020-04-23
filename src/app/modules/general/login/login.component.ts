import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  fgLogin: FormGroup;
  loginError: boolean = false;
  isRegistered: boolean = false;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { 
      this.activatedRoute.queryParams.subscribe(p => {
        this.isRegistered = p.isRegistered;
      });      
    }

  ngOnInit(): void {
    this.fgLogin = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
    })
  }

  login() {
    this.loginError = false;
    if (this.fgLogin.valid) {
      this.authSvc.login(this.fgLogin.value).subscribe(result => {
        if (result) {
          console.log("Login success");
          this.router.navigate(['s/chat']);    
        }
        else {
          this.loginError = true;
        }
      });
    }
  }

}
