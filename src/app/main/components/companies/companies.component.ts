import {Component, Input, OnInit} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  @Input() public companyValue!: (param:any) => void;
  @Input() public dateValue!: (param:any) => void;

  public companies: any;
  public loading: boolean = false;
  public selectedYear;
  public selectedMonth;
  public months: any;
  public years: any;
  public role: any;
  constructor(
    private _api: ApiService,
  ) {}

  ngOnInit(): void {
    this.fetchUserCompanies();
    this.selectedYear = new Date().getFullYear();
    this.selectedMonth = new Date().getMonth();
    this.months = [
      {month: 1},
      {month: 2},
      {month: 3},
      {month: 4},
      {month: 5},
      {month: 6},
      {month: 7},
      {month: 8},
      {month: 9},
      {month: 10},
      {month: 11},
      {month: 12},
    ];
    this.selectCompany(this.years);
  }

  fetchUserCompanies() {
    this.role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const param = this.role === 'ROLE_ADMINISTRATOR' ? '?active=1' : '?active=1&user=' + userId;
    this._api.getTypeRequest('company/fetch-companies' + param).subscribe((res: any) => {
      this.companies = res.companies;
    });
  }

  selectCompany(id) {
    this.companyValue(id);
    this._api.getTypeRequest('company/fetch-company-dates?company_id=' + id).subscribe((res: any) => {
      this.years = res.message.years;
    })
  }

 getMonthName(monthNumber) {
   const date = new Date();
   let newMonth = monthNumber;
   if (newMonth === 0) {
     newMonth = 12;
   } else {
     newMonth = monthNumber - 1;
   }
   date.setMonth(newMonth);
   return date.toLocaleString('en-US', {
     month: 'long',
   });
 }

  searchDates(){
    console.log('selectedMonth', this.selectedMonth);
    const dates = {
      year: this.selectedYear,
      month: this.selectedMonth
    };
    this.dateValue(dates);
  }

}
