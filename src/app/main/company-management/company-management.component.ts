import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {CompanyModalComponent} from "../components/company-modal/company-modal.component";
import {MdbModalRef, MdbModalService} from 'mdb-angular-ui-kit/modal';
import Swal from "sweetalert2";
import {throwError} from "rxjs";
import {PpiMappingModalComponent} from "./ppi-mapping-modal/ppi-mapping-modal.component";
import {CommonFunctionsService} from "../../services/common-functions.service";
import {Router} from "@angular/router";
import {DcmMappingModalComponent} from "./dcm-mapping-modal/dcm-mapping-modal.component";
import {CompanyService} from "../../services/company/company.service";
import {LoanAccountsMappingModalComponent} from "./loan-accounts-mapping-modal/loan-accounts-mapping-modal.component";

@Component({
  selector: 'app-company-management',
  templateUrl: './company-management.component.html',
  styleUrls: ['./company-management.component.css'],
  providers: [MdbModalService]
})
export class CompanyManagementComponent implements OnInit {

  public companies: any;
  modalRef: MdbModalRef<CompanyModalComponent> | null = null;
  public role: any;
  public loader;
  public loader2;

  constructor(
    private _api: ApiService,
    private modalService: MdbModalService,
    private commonFunctionsService: CommonFunctionsService,
    private router: Router,
    private companyService: CompanyService
  ) {
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.loader = true;
    this.loader2 = false;
    this.fetchCompanies();
  }

  fetchCompanies() {
    this._api.getTypeRequest('company/fetch-companies').subscribe((res: any) => {
      this.companies = res.companies;
      this.loader = false;
    });
  }

  editCompany(id, company_name, sql_server_db, active_status) {
    const active = active_status === 1;
    this.modalRef = this.modalService.open(CompanyModalComponent, {
      data: {
        company_details: {
          company_id: id,
          company_name: company_name,
          sql_server_db: sql_server_db,
          active: active
        }
      },
      modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable w-50'
    });
    this.modalRef.onClose.subscribe((submit) => {
      this.fetchCompanies();
    })
  }

  addCompany() {
    this.modalRef = this.modalService.open(CompanyModalComponent, {
      data: {},
      modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable w-50'
    });
    this.modalRef.onClose.subscribe((submit) => {
      this.fetchCompanies();
    })
  }

  async sync(company_id = null) {
    let id = '';
    await Swal.fire({
      title: 'Are you sure you want to sync accounts?',
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader2 = true;
        console.log('confirm', result.isConfirmed);
        if (company_id !== null) {
          id = '?company_id=' + company_id;
        }
        this._api.getTypeRequest('accounts/sync-data' + id).subscribe(res => {
            Swal.fire({
              title: 'Successfully synced accounts',
              text: '',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Okay',
            }).then((result) => {
              this.loader2 = false;
            })
              .catch((err) => {
                this.loader2 = false;
              });
          },
          err => {
            this.loader2 = false;
          });
      }
    })
  }

  dateFormat(date) {
    if(date){
      return this.commonFunctionsService.dateFormat(date);
    }
  }

  async syncCompany(company_id = null, companyName: string) {
    let id = '';
    await Swal.fire({
      title: 'Are you sure you want to sync accounts?',
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader2 = true;
        console.log('confirm', result.isConfirmed, companyName);
        if (company_id !== null) {
          id = '?company_id=' + company_id;
        }
        this._api.getTypeRequest('accounts/sync-data' + id).subscribe({
          next: (data: any)=>{
            if(data.result === 'Success'){
              console.log('on sync save to db', data.result);
              this.companyService.lastSync(company_id).subscribe({
                next: (res: any)=>{
                  console.log(res);
                }
              })
            }
          },
          error:(error:any)=>{
            //this.handleError(error);
            this.reset(error);
          },
          complete: () => {
            this._api.getTypeRequest('accounts/zero-balance-count' + id).subscribe({
              next: (data: any) => {
                Swal.fire({
                  title: companyName + ' synced' + ' \nand ' + data.message,
                  text: '',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'Okay',
                }).then((result) => {
                  this.loader2 = false;
                }).catch((err) => {
                  this.loader2 = false;
                });
              },
              complete: () => {
                this._api.getTypeRequest('accounts/zero-balance-reset' + id).subscribe({
                  next: (accounts: any) => {
                    console.log(accounts);
                    const currentUrl = this.router.url;
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                      this.ngOnInit();
                      this.loader = false;
                      this.router.navigate([currentUrl]);
                    });
                  },
                  error: (error=>{
                    this.handleError(error);
                  })
                });
              }
            });
          }
        });
      }
    });
  }

  reset(error: any) {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.ngOnInit();
      this.loader = false;
      this.router.navigate([currentUrl]);
      Swal.fire({
        title: error.message,
        text: '',
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'Okay',
      }).then((result) => {
        this.loader = false;
        this.handleError(error);
      });
    });
  }
  // async syncPreviousMonth(company_id = null, companyName: string) {
  //   let id = '';
  //   await Swal.fire({
  //     title: 'Are you sure you want to sync accounts?',
  //     text: '',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.loader2 = true;
  //       console.log('confirm', result.isConfirmed, companyName);
  //       if (company_id !== null) {
  //         id = '?company_id=' + company_id;
  //       }
  //       this._api.getTypeRequest('accounts/sync-data2' + id).subscribe({
  //         error:(error=>{
  //           this.handleError(error);
  //         }),
  //       });
  //     }
  //   });
  // }

  async syncPreviousMonth(company_id = null, companyName: string) {
    let id = '';
    await Swal.fire({
      title: 'Are you sure you want to sync accounts?',
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader2 = true;
        console.log('confirm',result.isConfirmed);
        if (company_id !== null){
          id = '?company_id=' + company_id;
        }
        this._api.getTypeRequest('accounts/sync-data2' + id).subscribe(res => {
            Swal.fire({
              title: 'Successfully synced previous months accounts',
              text: '',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Okay',
            }).then((result) => {
              this.loader2 = false;
            })
              .catch((err) => {
                this.loader2 = false;
              });
          },
          err => {
            this.loader2 = false;
          });
      }
    })
  }

  openPpiMappingModal() {

    this.modalRef = this.modalService.open(PpiMappingModalComponent,
      {
        //data: {companyId, account_details, title, year, month},
        modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable modal-custom'
      });
    this.modalRef.onClose.subscribe();
  }

  openDcmMappingModal() {

    this.modalRef = this.modalService.open(DcmMappingModalComponent,
      {
        //data: {companyId, account_details, title, year, month},
        modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable modal-custom'
      });
    this.modalRef.onClose.subscribe();
  }
  openLoanAccountsModal() {

    this.modalRef = this.modalService.open(LoanAccountsMappingModalComponent,
      {
        //data: {companyId, account_details, title, year, month},
        modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable modal-custom'
      });
    this.modalRef.onClose.subscribe();
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

  async syncCompany2(company_id = null, companyName: string) {
    let id = '';
    await Swal.fire({
      title: 'Are you sure you want to sync accounts?',
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader2 = true;
        console.log('confirm', result.isConfirmed, companyName);
        if (company_id !== null) {
          id = '?company_id=' + company_id;
        }
        this._api.getTypeRequest('accounts/sync-data2' + id).subscribe({
          next: (data: any)=>{
            if(data.result === 'Success'){
              console.log('on sync save to db', data.result);
              this.companyService.lastSync(company_id).subscribe({
                next: (res: any)=>{
                  console.log(res);
                }
              })
            }
          },
          error:(error:any)=>{
            //this.handleError(error);
            this.reset(error);
          },
          complete: () => {
            this._api.getTypeRequest('accounts/zero-balance-count' + id).subscribe({
              next: (data: any) => {
                Swal.fire({
                  title: companyName + ' synced' + ' \nand ' + data.message,
                  text: '',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'Okay',
                }).then((result) => {
                  this.loader2 = false;
                }).catch((err) => {
                  this.loader2 = false;
                });
              },
              complete: () => {
                this._api.getTypeRequest('accounts/zero-balance-reset' + id).subscribe({
                  next: (accounts: any) => {
                    console.log(accounts);
                    const currentUrl = this.router.url;
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                      this.ngOnInit();
                      this.loader = false;
                      this.router.navigate([currentUrl]);
                    });
                  },
                  error: (error=>{
                    this.handleError(error);
                  })
                });
              }
            });
          }
        });
      }
    });
  }

}
