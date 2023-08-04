import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private readonly baseUrl: string = '';

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiURL;
  }

  balanceSheetCount(year: string, month: string, companyId: (param: any) => void): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/balance-sheet-count?year=${year}&month=${month}&company_id=${companyId}`);
  }

  getBalanceSheet(year: ((param: any) => void) | number, month: ((param: any) => void) | number, companyId: (param: any) => void): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/balance-sheet?year=${year}&month=${month}&company_id=${companyId}`);
  }

  incomeStatementCount(year: string, month: string, companyId: (param: any) => void): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/income-statement-count?year=${year}&month=${month}&company_id=${companyId}`);
  }
  getIncomeStatementSheet(year: ((param: any) => void) | number, month: ((param: any) => void) | number, companyId: (param: any) => void): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/income-statements?year=${year}&month=${month}&company_id=${companyId}`);
  }
  switchAccountType(accountType: any, id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/switch-account-type?accounts_type=${accountType}&id=${id}`);
  }
  balanceSheetBalance(year: string, month: string, companyId: (param: any) => void): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/balance-sheet-balance?year=${year}&month=${month}&company_id=${companyId}`);
  }
  incomeStatementBalance(year: string, month: string, companyId: (param: any) => void): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/income-statement-balance?year=${year}&month=${month}&company_id=${companyId}`);
  }
  fetchBulkReviewsIncomeStatement(year: string, month: string, companyId: (param: any) => void): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/fetch-bulk-reviews-income-statement?year=${year}&month=${month}&company_id=${companyId}`);
  }
  fetchBulkReviewsBalanceStatement(year: string, month: string, companyId: (param: any) => void): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/fetch-bulk-reviews-balance-statement?year=${year}&month=${month}&company_id=${companyId}`);
  }
  fetchBulkCertifyIncomeStatement(year: string, month: string, companyId: (param: any) => void): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/fetch-certify-income-statement?year=${year}&month=${month}&company_id=${companyId}`);
  }
  fetchBulkCertifyBalanceStatement(year: string, month: string, companyId: (param: any) => void): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/fetch-certify-balance-statement?year=${year}&month=${month}&company_id=${companyId}`);
  }

}



