import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginRequest, Token } from '../models/login';

import { Environment } from '../../environments/environment';
import { ApiResponse, Contact } from '../models/user';

import { UtilityService } from './utility.service';
import { AuthService } from './auth.service';
import { Message } from '../models/message';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class CommunicationService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private utilityService: UtilityService) {
    }

  getContacts(): Observable<Contact[]> {
    var url = Environment.apiUrl + "contacts";
    var params: string[] = [];

    params.push('userId=' + this.authService.getToken().id);

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    return this.http.get<Contact[]>(url, httpOptions)
      .pipe(
        catchError(this.utilityService.handleError<Contact[]>('Error while getting contacts. Please try again.'))
      );
  }

  getContactsToAdd(): Observable<Contact[]> {
    var url = Environment.apiUrl + "contactstoadd";
    var params: string[] = [];

    params.push('userId=' + this.authService.getToken().id);

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    return this.http.get<Contact[]>(url, httpOptions)
      .pipe(
        catchError(this.utilityService.handleError<Contact[]>('Error while getting contacts to add. Please try again.'))
      );
  }

  addContact(contactId: string): Observable<ApiResponse> {

    var data = {
      userId: this.authService.getToken().id,
      contactId: contactId
    }

    return this.http.post<ApiResponse>(Environment.apiUrl + 'addcontact', JSON.stringify(data), httpOptions)
        .pipe(
          map(res => {
            debugger;
            return res;
          }),
          catchError(this.utilityService.handleError<ApiResponse>('Exception while adding contact.')), 
        );
  }

  getMessages(contactId): Observable<Message[]> {
    var url = Environment.apiUrl + "messages";
    var params: string[] = [];

    params.push('userId=' + this.authService.getToken().id);
    params.push('contactId=' + contactId);

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    return this.http.get<Message[]>(url, httpOptions)
      .pipe(
        catchError(this.utilityService.handleError<Message[]>('Error while getting messages. Please try again.'))
      );
  }

}