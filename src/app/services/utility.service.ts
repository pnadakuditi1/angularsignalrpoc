import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(public dialog: MatDialog) { }

  handleError<T> (errorMessage:string = '', result?: T) {
    return (error: any): Observable<T> => {
    console.log(errorMessage);
      alert(errorMessage);

      // Let the app keep running by returning an empty result.
      return of(result as T);      
    };
  }
}