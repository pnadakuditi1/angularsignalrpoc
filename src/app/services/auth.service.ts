import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginRequest, Token } from '../models/login';
import { UtilityService } from './utility.service';

import { Environment } from '../../environments/environment';
import { ApiResponse } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(
    private http: HttpClient,
    private utilityService: UtilityService) {
    }

  login(data): Observable<boolean> {
    let headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

    return this.http.post<Token>(Environment.apiUrl + 'login', JSON.stringify(data), headers)
        .pipe(
          map(res => {
            if (res) {
              this.setToken(res);
              return true;
            }
            else {
              return false;
            }
          }),
          catchError(this.utilityService.handleError<boolean>('Exception while logging in.')), 
        );
  }

  register(data): Observable<ApiResponse> {
    let headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

    return this.http.post<ApiResponse>(Environment.apiUrl + 'register', JSON.stringify(data), headers)
        .pipe(
          map(res => {
            debugger;
            return res;
          }),
          catchError(this.utilityService.handleError<ApiResponse>('Exception while registering.')), 
        );
  }

  getToken(): Token {
    var username = localStorage.getItem("username");
    if (username) {
      return {
        id: localStorage.getItem("id"),
        username: username,
        name: localStorage.getItem("name")
      };
    }
    else {
      return null;
    }
  }  

  isLoggedIn(): boolean {
    return this.getToken() == null ? false : true;
  }  

  logout() {
    localStorage.clear();
  }
  
  private setToken(token: Token): boolean {
    localStorage.clear();
    localStorage.setItem("username", token.username);
    localStorage.setItem("name", token.name);
    localStorage.setItem("id", token.id);
    return true;
  }  

}