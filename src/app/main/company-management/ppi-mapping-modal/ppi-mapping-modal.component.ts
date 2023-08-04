import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CompanyService} from "../../../services/company/company.service";
import Swal from "sweetalert2";
import {throwError} from "rxjs";
import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import {PpiMappings} from "../../../model/ppiMappings.model";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-ppi-mapping-modal',
  templateUrl: './ppi-mapping-modal.component.html',
  styleUrls: ['./ppi-mapping-modal.component.css']
})
export class PpiMappingModalComponent implements OnInit {

  ppiMappingForm!: FormGroup;
  ppiMappings: any[] = [];
  companies: any[] = [];
  pageCustomer = 1;
  countCustomer = 10;
  selectedCompany: number | undefined;
  ppiMapping: PpiMappings | undefined;
  companyName: any;

  constructor(public modalRef: MdbModalRef<PpiMappingModalComponent>,
              private fb: FormBuilder,
              private companyService: CompanyService) {
  }

  ngOnInit(): void {
    this.buildFrom();
    this.getPpiMappings();
    this.fetchActiveCompanies();
    this.submit();
  }

  buildFrom() {
    this.ppiMappingForm = this.fb.group({
        database: new FormControl('', Validators.required),
        partner_code: new FormControl('', Validators.required),
        account: new FormControl('', Validators.required)
      }
    );
  }

  submit() {

    if(this.selectedCompany === undefined) {
      return;
    }

    if (this.ppiMappingForm.valid) {
      this.companyService.fetchCompany(this.selectedCompany).subscribe({
        next: (response) => {

          this.ppiMapping = new PpiMappings();

          this.ppiMapping.company = response.company.company_name;
          this.ppiMapping.database = response.company.sql_server_db;
          this.ppiMapping.partner_code = this.ppiMappingForm.get('partner_code')?.value;
          this.ppiMapping.account = this.ppiMappingForm.get('account')?.value;

          this.companyService.createMapping(this.ppiMapping).subscribe({
            next: (res) => {
              Swal.fire({
                title: 'PPI Mapping Added',
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
              this.getPpiMappings();
            }
          });
        },
        error: (err) => {
          console.error(err);
          this.handleError(err);
        }
      });
    }
  }

  public getPpiMappings() {
    this.companyService.ppiMappings().subscribe(
      data => {
        this.ppiMappings = data.ppiMappings;
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
    this.companyService.delete(id).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'PPI Mapping Deleted',
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
          title: 'PPI Mapping Not deleted.',
          text: '',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'Okay',
        }).then((result) => {
        }).catch((err) => {
        });
      },
      complete: () => {
        this.getPpiMappings();
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
}
