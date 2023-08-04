import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import {CompanyService} from "../../../services/company/company.service";
import Swal from "sweetalert2";
import {throwError} from "rxjs";
import {MatSelectChange} from "@angular/material/select";
import {LoanAccountsMapping} from "../../../model/loanAccountsMapping";

@Component({
  selector: 'app-loan-accounts-mapping-modal',
  templateUrl: './loan-accounts-mapping-modal.component.html',
  styleUrls: ['./loan-accounts-mapping-modal.component.css']
})
export class LoanAccountsMappingModalComponent implements OnInit {

  loanAccountsMappingForm!: FormGroup;
  loanAccountsMappings: any[] = [];
  companies: any[] = [];
  pageCustomer = 1;
  countCustomer = 10;
  selectedCompany: number | undefined;
  selectedCompany2: number | undefined;
  loanAccountsMapping: LoanAccountsMapping | undefined;
  companyName: any;
  companyName2: any;

  constructor(public modalRef: MdbModalRef<LoanAccountsMappingModalComponent>, private fb: FormBuilder, private companyService: CompanyService) {
  }

  ngOnInit(): void {
    this.buildFrom();
    this.getloanAccountsMappings();
    this.fetchActiveCompanies();
  }

  buildFrom() {
    this.loanAccountsMappingForm = this.fb.group({
        database1: new FormControl('', Validators.required),
        company1: new FormControl('', [Validators.required]),
        currency1: new FormControl('', Validators.required),
        account1: new FormControl('', Validators.required),
        database2: new FormControl('', Validators.required),
        company2: new FormControl('', [Validators.required]),
        currency2: new FormControl('', Validators.required),
        account2: new FormControl('', Validators.required),
      }
    );
  }

  submit() {

    if(this.selectedCompany === undefined||this.selectedCompany2 === undefined) {
      return;
    }

    this.companyService.fetchCompany2(this.selectedCompany, this.selectedCompany2).subscribe({
      next: (response) => {

        this.loanAccountsMapping = new LoanAccountsMapping();

        this.loanAccountsMapping.company1 = response.company1.company_name;
        this.loanAccountsMapping.company2 = response.company2.company_name;


        this.loanAccountsMapping.database1 = response.company1.sql_server_db;
        this.loanAccountsMapping.database2 = response.company2.sql_server_db;

        this.loanAccountsMapping.currency1 = this.loanAccountsMappingForm.get('currency1')?.value;
        this.loanAccountsMapping.currency2 = this.loanAccountsMappingForm.get('currency2')?.value;
        this.loanAccountsMapping.account1 = this.loanAccountsMappingForm.get('account1')?.value;
        this.loanAccountsMapping.account2 = this.loanAccountsMappingForm.get('account2')?.value;

        this.companyService.createAccountsLoanMapping(this.loanAccountsMapping).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Loan Account Mapping Added',
              text: '',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Okay',
            }).then((result) => {
            }).catch((err) => {
            });
          },
          error: (err) => {
            console.error(err);
            this.handleError(err);
            Swal.fire({
              title: err.error.message,
              text: '',
              icon: 'error',
              showCancelButton: false,
              confirmButtonText: 'Okay',
            }).then((result) => {
            }).catch((err) => {
            });
          },
          complete: () => {
            this.getloanAccountsMappings();
          }
        });

      },
      error: (err) => {
        console.error(err);
        this.handleError(err);
      }
    });
  }

  public getloanAccountsMappings() {
    this.companyService.loanAccountsMappings().subscribe(
      data => {
        this.loanAccountsMappings = data.loanAccountsMapping;
      },
      error => {
        this.handleError(error);
      }
    );
  }

  public fetchActiveCompanies() {
    this.companyService.fetchActiveCompanies().subscribe(
      data => {
        this.companies = data.companies;
      },
      error => {
        this.handleError(error);
      }
    );
  }

  public delete(id: number) {
    this.companyService.deleteloanAccountsMapping(id).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Loan Account Mapping Deleted',
          text: '',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Okay',
        }).then((result) => {
        }).catch((err) => {
        });

      },
      error: (err) => {
        this.handleError(err);
        Swal.fire({
          title: 'Loan Account Mapping Not deleted.',
          text: '',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'Okay',
        }).then((result) => {
        }).catch((err) => {
        });
      },
      complete: () => {
        this.getloanAccountsMappings();
      }
    });
  }

  onChange(companyId: MatSelectChange) {

    this.companyService.fetchCompany(this.selectedCompany).subscribe({
      next: (response) => {
        this.companyName = response.company.company_name;
      },
      error: (err) => {
        this.handleError(err.error.message())
      }
    });

  }

  onChange2(companyId: MatSelectChange) {

    this.companyService.fetchCompany(this.selectedCompany2).subscribe({
      next: (response) => {
        this.companyName2 = response.company.company_name;
      },
      error: (err) => {
        this.handleError(err.error.message())
      }
    });

  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.log('client-side error ' + errorMessage);
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.log('server-side error ' + errorMessage);
    }
    console.log(errorMessage);
    return throwError(() => errorMessage);
  }

}



