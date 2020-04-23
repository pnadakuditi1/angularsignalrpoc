import { Component, AfterContentChecked } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Token } from './models/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterContentChecked  {
  title = 'iPrattle';
  token: Token;

  constructor(
    private authSvc: AuthService,
    private router: Router) {

  }

  ngAfterContentChecked() {
    this.token = this.authSvc.getToken();
  }

  logout() {
    console.log("Logout method");
    this.authSvc.logout();
    this.router.navigate(['login']);
  }
}
