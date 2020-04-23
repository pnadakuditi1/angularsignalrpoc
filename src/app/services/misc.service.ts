import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { UtilityService, MONTHNAMES } from './utility.service';

import { DateFilterOption, KeyValuePair, LJListItem } from '../models/utilityModels';
import { Environment } from '../../environments/environment';

export const MODULES = {
  PAYMENTS: 1,
  DOCUMENTS: 2,
  PAYMENTSBATCHES: 3,
  ADMIN_DASHBOARD: 4,
  ACTIVITY: 5,
  NOTIFICATIONS: 6,
  SALESUSAGEREPORT: 7
}

export const ACCOUNT_STATEMENT_TYPE = {
  PDF: 1,
  CSV: 2
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export const MINDATE = new Date('0001-01-01T00:00:00');
export const CUSTOM_DATEFILTER_KEY = "Custom";

@Injectable({
  providedIn: 'root'
})

export class MiscService {

  constructor(
    private http: HttpClient,
    private utilityService: UtilityService) {
  }

  getTaxCodes(): Observable<KeyValuePair[]> {
    var url = Environment.paygoApiUrl + 'lookup/taxcodes';

    return this.http.get<KeyValuePair[]>(url, httpOptions)
    .pipe(
      catchError(this.utilityService.handleError('Error while retrieving tax codes', []))
    );
  }

  getAccountsDataGridViews(): Observable<KeyValuePair[]> {
    var url = Environment.paygoApiUrl + 'lookup/accountlistviews';

    return this.http.get<KeyValuePair[]>(url, httpOptions)
    .pipe(
      catchError(this.utilityService.handleError('Error while retrieving account list views', []))
    );
  }

  getDateFilterOptions(moduleId: number, accId?:string): Observable<DateFilterOption[]> {

    var tempModuleId = moduleId == MODULES.SALESUSAGEREPORT ? MODULES.DOCUMENTS : moduleId;
    var url = Environment.paygoApiUrl + 'lookup/firsttransactiondate?module=' + tempModuleId.toString();

    if (accId != null) {        
        url += '&accId=' + accId; 
    }
    
    return this.http.get<DateFilterOption[]>(url, httpOptions)
    .pipe(
      map(res => {
        let dtNow = new Date();
        let dtTempDate = new Date();

        let dtFirstTransDate = MINDATE;
        if (res) {
          if (res.toString().indexOf("Z") > 0 || res.toString().indexOf("z") > 0) {
            dtFirstTransDate = new Date(res.toString());
          }
          else {
            dtFirstTransDate = new Date(res + "Z");
          }
          
        }
        else {
          dtFirstTransDate = dtNow;
        }
        let dtYesterdayStart = new Date((new Date(dtTempDate.setDate(dtTempDate.getDate() - 1))).setHours(0, 0, 0, 0));
        let dtYesterdayEnd = this.setLastPossibleTimeForADate(dtYesterdayStart);
        let maxOptions = 12;
        let dateFilterOptions: DateFilterOption[] = [];
  
        if (dtFirstTransDate > MINDATE) {
          // If firstTransactionDate is more than 12 months ago, override it to be the first day of the 12 months before now
          if ( (dtNow.getMonth() - dtFirstTransDate.getMonth()) + (12 * (dtNow.getFullYear() - dtFirstTransDate.getFullYear())) > 12)
          {
            dtFirstTransDate = this.getBillingCycleStartDate(new Date(new Date(dtNow.getMonth() - 12)));
          }
        }
  
        if (moduleId == MODULES.SALESUSAGEREPORT) {
          dateFilterOptions.push({
            key: "All Time", 
            name: "All Time"
          });          
        }

        let i = 1;
        let cycleStartDate = this.getBillingCycleStartDate(dtNow);
        let earliestBillingCycleStartDate = this.getBillingCycleStartDate(dtFirstTransDate);
        while (i <= maxOptions && cycleStartDate >= earliestBillingCycleStartDate)
        {
          dateFilterOptions.push({
            key: MONTHNAMES[cycleStartDate.getMonth()] + " " + cycleStartDate.getFullYear().toString(),
            name: MONTHNAMES[cycleStartDate.getMonth()] + " " + cycleStartDate.getFullYear().toString(), 
            begin: this.getBillingCycleStartDate(cycleStartDate), 
            end: this.getBillingCycleEndDate(cycleStartDate)
          });
          cycleStartDate = new Date(cycleStartDate.setMonth(cycleStartDate.getMonth() - 1));
          i++;
        }
  
        if (moduleId == MODULES.PAYMENTS || moduleId == MODULES.DOCUMENTS || moduleId == MODULES.ADMIN_DASHBOARD
              || moduleId == MODULES.NOTIFICATIONS)
        {
          dateFilterOptions.push({
            key: "Today", 
            name: "Today", 
            begin: new Date(dtNow.setHours(0, 0, 0, 0)), 
            end: this.setLastPossibleTimeForADate(dtNow)
          });
          
          let numOfDaysSinceFirstTrans = this.getDateDiff(dtFirstTransDate, dtNow);
          if (numOfDaysSinceFirstTrans >= 1)
          {
            dateFilterOptions.push({
              key: "Yesterday", 
              name: "Yesterday", 
              begin: dtYesterdayStart, 
              end: dtYesterdayEnd,
            });
          }
  
          //Last 7 Days
          if (numOfDaysSinceFirstTrans > 1)
          {
            dtTempDate = new Date(new Date().setDate(dtYesterdayStart.getDate() - 6));
            dateFilterOptions.push({
              key: "Past 7 Days", 
              name: "Past 7 Days", 
              begin: new Date(dtTempDate.setHours(0, 0, 0, 0)), 
              end: dtYesterdayEnd
            });
          }
  
          //Last 30 Days
          if (numOfDaysSinceFirstTrans > 6)
          {
            dtTempDate = new Date(new Date().setDate(dtYesterdayStart.getDate() - 29));
            dateFilterOptions.push({
              key: "Past 30 Days", 
              name: "Past 30 Days", 
              begin: new Date(dtTempDate.setHours(0, 0, 0, 0)), 
              end: dtYesterdayEnd
            });
          }
  
          //Last 60 Days
          if (numOfDaysSinceFirstTrans > 29)
          {
            dtTempDate = new Date(new Date().setDate(dtYesterdayStart.getDate() - 59));
            dateFilterOptions.push({
              key: "Past 60 Days", 
              name: "Past 60 Days", 
              begin: new Date(dtTempDate.setHours(0, 0, 0, 0)), 
              end: dtYesterdayEnd
            });
          }
  
          //Last 12 Months
          if (numOfDaysSinceFirstTrans > 59)
          {
            dtTempDate = new Date(new Date().setMonth(dtNow.getMonth() - 12));
            dateFilterOptions.push({
              key: "Past 12 Months", 
              name: "Past 12 Months", 
              begin: new Date(dtTempDate.setHours(0, 0, 0, 0)), 
              end: dtYesterdayEnd
            });
          }

          //Custom Filter
          if (numOfDaysSinceFirstTrans > 1)
          {
            dateFilterOptions.push({
              key: "Custom", 
              name: "Custom Date Range", 
              begin: null,
              end: null,
              minDateForCustomDateRange: this.getBillingCycleStartDate(dtFirstTransDate), 
              maxDateForCustomDateRange: this.setLastPossibleTimeForADate(dtNow)
            });
          }          
        } 
        return dateFilterOptions;    
      }),      
      catchError(this.utilityService.handleError('Error while creating date filter options', []))
    );
  }

  public getDateDiff(firstDate: Date, secondDate: Date): number {
    return Math.round((secondDate.getTime() - firstDate.getTime() ) / 86400000);  // 24 Hours * 60 Minutes * 60 Seconds * 1000 Milliseconds
  }

  private getBillingCycleStartDate(d: Date): Date {
    return (new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0));
  }

  private getBillingCycleEndDate(d: Date): Date {
    let dtResult = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
    dtResult = new Date(dtResult.setMonth(dtResult.getMonth() + 1));
    dtResult = new Date(dtResult.setMilliseconds(dtResult.getMilliseconds() - 1));
    return dtResult;
  }
  
  setLastPossibleTimeForADate(date: Date): Date {
    let dtResult = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    return dtResult;
  }

  getTrackingPreferenceOptions(includeHidden: boolean = true): LJListItem[] {
    var options: LJListItem[] = [];        
    options.push({id: 3, name: 'Required'});    
    options.push({id: 2, name: 'Optional'});    
    if (includeHidden) {
      options.push({id: 1, name: 'Hidden'});    
    }
    return options;    
  }

  getBAEditionOptions(): LJListItem[] {
    var options: LJListItem[] = [];        
    options.push({id: 0, name: 'Not set'});  
    options.push({id: 2, name: 'Premium'});    
    options.push({id: 1, name: 'Light'});    
    return options;    
  }  

  openPdfFile(title: string, pdfContent: Blob) {
    if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > -1) {
      //* Microsoft Internet Explorer detected in. 
      console.log("IE Detected");
      window.navigator.msSaveOrOpenBlob(pdfContent, title + ".pdf");
    }
    else if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      console.log("not-IE and not Chrome");
      const data = window.URL.createObjectURL(pdfContent);
      var link = document.createElement('a');
      link.href = data;
      link.download = "Payments Batch Report - " + title + ".pdf";
      link.click();
      setTimeout(function() {
        window.URL.revokeObjectURL(data);
      }, 1500);
    }
    else {
      console.log("Chrome detected");
      var fileURL = URL.createObjectURL(pdfContent);
      var reportWindow = window.open(fileURL, '_blank', "toolbar=no, location=no, directories=no");  
      reportWindow.onload = function() {
        setTimeout(function() {
          var eHtml = reportWindow.document.getElementsByTagName('html');
          var eHead = reportWindow.document.getElementsByTagName('head');
          var eTitle = reportWindow.document.getElementsByTagName('title');
  
          if (eHtml.length > 0 && eHead.length == 0 && eTitle.length == 0) {
            var t = document.createElement('title');
            t.innerText = title + ".pdf";
            eHtml[0].appendChild(document.createElement('head'))
                    .appendChild(t);
          }       
        }, 1500);
      }    
    }
  }

  openCsvFile(title: string, csvContent: Blob) {
    if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > -1) {
      //* Microsoft Internet Explorer detected in. 
      console.log("IE Detected");
      window.navigator.msSaveOrOpenBlob(csvContent, title + ".csv");
    }
    else {
      console.log("not-IE Detected");
      const data = window.URL.createObjectURL(csvContent);
      var link = document.createElement('a');
      link.href = data;
      link.download = title + ".csv";
      document.body.appendChild(link);
      link.click();
      setTimeout(function() {
        window.URL.revokeObjectURL(data);
      }, 1500);
      document.body.removeChild(link);     
    }
  }  
}
