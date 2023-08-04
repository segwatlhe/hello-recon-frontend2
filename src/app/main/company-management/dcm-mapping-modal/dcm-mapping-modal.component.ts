import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CompanyService} from "../../../services/company/company.service";
import Swal from "sweetalert2";
import {throwError} from "rxjs";
import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import {PpiMappings} from "../../../model/ppiMappings.model";
import {MatSelectChange} from "@angular/material/select";
import {DcmMapping} from "../../../model/DcmMapping";

@Component({
  selector: 'app-dcm-mapping-modal',
  templateUrl: './dcm-mapping-modal.component.html',
  styleUrls: ['./dcm-mapping-modal.component.css']
})
export class DcmMappingModalComponent implements OnInit {

  dcmMappingForm!: FormGroup;
  ppiMappings: any[] = [];
  companies: any[] = [];
  pageCustomer = 1;
  countCustomer = 10;
  agentId = '';
  selectedCompany: number | undefined;
  ppiMapping: PpiMappings | undefined;
  companyName: any;
  dcmMapping: DcmMapping | undefined;

  constructor(public modalRef: MdbModalRef<DcmMappingModalComponent>,
              private fb: FormBuilder,
              private companyService: CompanyService) {
  }

  ngOnInit(): void {
    this.buildFrom();
    this.getDcmMappings();
    this.fetchActiveCompanies();
  }

  buildFrom() {
    this.dcmMappingForm = this.fb.group({
        database: new FormControl('', Validators.required),
        company: new FormControl('', [Validators.required]),
        agent_id: new FormControl('', Validators.required),
        account: new FormControl('', Validators.required),
      }
    );
  }

  submit() {

    if (this.selectedCompany === undefined) {
      return;
    }

      this.companyService.fetchCompany(this.selectedCompany).subscribe({
        next: (response) => {

          this.dcmMapping = new DcmMapping();

          this.dcmMapping.company = response.company.company_name;
          this.dcmMapping.database = response.company.sql_server_db;
          this.dcmMapping.agent_id = this.dcmMappingForm.get('agent_id')?.value;
          this.dcmMapping.account = this.dcmMappingForm.get('account')?.value;

          this.companyService.createDcmMapping(this.dcmMapping).subscribe({
            next: (response) => {

              Swal.fire({
                title: 'DCM Mapping Added',
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
              this.getDcmMappings();
            }
          });
        },
        error: (err) => {
          this.handleError(err);
        }
      });
  }

  searchAgentId() {
    this.companyService.searchAgentId(this.dcmMappingForm.get('agent_id')?.value).subscribe({
      next: (response) => {
        this.agentId = response.id;
        this.dcmMappingForm.setControl('agent_code', new FormControl(this.agentId));
      },
      error: (error) => {
        this.handleError(error);
        Swal.fire({
          title: 'Agent ID not found',
          text: '',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'Okay',
        }).then((result) => {
        }).catch((err) => {
        });
      }
    });

  }

  public getDcmMappings() {
    this.companyService.dcmMappings().subscribe(
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

  public deleteDcmMapping(id: number) {
    this.companyService.deleteDcmMapping(id).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'DCM Mapping Deleted',
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
          title: 'DCM Mapping Not deleted.',
          text: '',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'Okay',
        }).then((result) => {
        }).catch((err) => {
        });
      },
      complete: () => {
        this.getDcmMappings();
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
