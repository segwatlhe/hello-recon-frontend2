import {Component, OnInit} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public boundSelectCompany= (companyId:any)=>{
    this.selectCompany(companyId);
  };

  public boundSelectDates= (dates:any)=>{
    this.selectedDates(dates);
  };

  public protectedData: any;
  public loading: boolean = false;
  public selectedCompany;
  public selectedCompany2;
  public selectedAccountData;
  public selectedAccountData2;
  public selectedYear;
  public selectedYear2;
  public selectedMonth;
  public selectedMonth2;



  constructor(
    private _api: ApiService
  ) {}

  ngOnInit(): void {
  }

  selectCompany(company): void {
    this.selectedCompany = company;
    this.selectedCompany2 = company;
  }

  selectAccount(account): void {
    this.selectedAccountData = account;
    this.selectedAccountData2 = account;
  }

  selectedDates(dates): void {
    this.selectedYear = dates.year;
    this.selectedMonth = dates.month;
    this.selectedYear2 = dates.year2;
    this.selectedMonth2 = dates.month2;
  }


}

