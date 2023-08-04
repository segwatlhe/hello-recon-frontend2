import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {PpiMapping} from "../../model/PpiMapping";
import {DcmMapping} from "../../model/DcmMapping";
import {LoanAccountsMapping} from "../../model/loanAccountsMapping";



@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private readonly baseUrl: string = '';

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiURL;
  }

  createMapping(ppiMapping: PpiMapping): Observable<any> {
    return this.http.post(`${this.baseUrl}accounts/ppi-assign-partnercode`, ppiMapping);
  }

  ppiMappings(): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/ppi-mappings`);
  }

  delete(id:number): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/delete-mapping?id=${id}`, {responseType: 'text'});
  }

  createDcmMapping(dcmMapping: DcmMapping): Observable<any> {
    return this.http.post(`${this.baseUrl}accounts/dcm-assign-agent_id`, dcmMapping);
  }

  searchAgentId(agent_id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/search-agent-id?agent_id=${agent_id}`);
  }

  dcmMappings(): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/dcm-mappings`);
  }

  deleteDcmMapping(id:number): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/delete-dcm-mapping?id=${id}`, {responseType: 'text'});
  }

  lastSync(company_id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/last-sync?company_id=${company_id}`);
  }
  loanAccountsMappings(): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/loan-accounts-mappings`);
  }

  createAccountsLoanMapping(LoanAccountsMapping: LoanAccountsMapping ): Observable<any> {
    return this.http.post(`${this.baseUrl}accounts/loan-account-assign`, LoanAccountsMapping);
  }

  deleteloanAccountsMapping(id:number): Observable<any> {
    return this.http.get(`${this.baseUrl}accounts/delete-loan-accounts-mapping?id=${id}`, {responseType: 'text'});
  }

  fetchActiveCompanies(): Observable<any> {
    return this.http.get(`${this.baseUrl}company/fetch-active-companies`);
  }

  fetchCompany(companyId: number | undefined): Observable<any> {
    return this.http.get(`${this.baseUrl}company/fetch-company?id=${companyId}`);
  }

  fetchCompany2(companyId: number | undefined, companyId2: number | undefined): Observable<any> {
    return this.http.get(`${this.baseUrl}company/fetch-loan-company?id=${companyId}&id2=${companyId2}`);
  }

}
