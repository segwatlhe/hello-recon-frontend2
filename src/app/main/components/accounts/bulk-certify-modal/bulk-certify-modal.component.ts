import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from "../../../../services/api.service";
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {CommonFunctionsService} from "../../../../services/common-functions.service";
import {Accounts} from "../../../../model/accounts.model";
import {BulkCertifyActionModalComponent} from "./bulk-certify-action-modal/bulk-certify-action-modal.component";
import {throwError} from "rxjs";
import {Router} from "@angular/router";
import {AccountsService} from "../../../../services/accounts/accounts.service";

@Component({
  selector: 'app-modal',
  templateUrl: './bulk-certify-modal.component.html',
  styleUrls: ['./bulk-certify-modal.component.css'],
  providers: [MdbModalService]
})
export class BulkCertifyModalComponent implements OnInit {

  actionModalRef: MdbModalRef<BulkCertifyActionModalComponent> | null = null;
  @Input() public selectedCompanyID!: (param: any) => void;
  @Input() public selectedYear!: (param: any) => void;
  @Input() public selectedMonth!: (param: any) => void;

  public currentYear: any;
  public currentMonth: any;
  public loader;

  constructor(
    private _api: ApiService,
    private modalService: MdbModalService,
    private commonFunctionsService: CommonFunctionsService,
    public modalRef: MdbModalRef<BulkCertifyModalComponent>,
    private router: Router,
    private accountsService: AccountsService
  ) {
  }

  public companyId: any;
  public month: any;
  public year: any;
  public title: any;
  pageCustomer = 1;
  countCustomer = 20;
  public admin_status: any;
  public preparer_status: any;
  public reviewer_status: any;
  public completed_status: any;
  public status: any;
  public reviewer: any;
  public preparer: any;
  public administrator: any;
  public account_details: any;
  public account: any;
  public userId: any;
  public fileName: any;
  public file: any;

  bulkAccounts: Accounts[] = [];
  public updateAction: any;
  public update_status: any;
  public canPickupReviews: any;
  public update_description: any;
  public actionModal: any;
  public role: any;
  public status_dropdown;
  public search_input: any;
  public search_name_input: any;
  public filteredAccountData: any;

  ngOnInit(): void {
    this.loader = true;
    this.account = this.account_details;
    this.admin_status = 'active';
    this.preparer_status = 'default';
    this.reviewer_status = 'default';
    this.completed_status = 'default';
    this.reviewer = this.account.reviewer;
    this.preparer = this.account.preparer;
    this.administrator = this.account.administrator;
    this.update_description = "Updated details";

    const preUserId = localStorage.getItem('userId') ? localStorage.getItem('userId') : '';
    // @ts-ignore
    this.userId = preUserId !== '' ? parseInt(preUserId.toString()) : null;
    this.getAccountsByStatus();
    this.role = localStorage.getItem('role');
  }

  ngOnChanges(): void {
    this.getAccountsByStatus();
  }

  dateFormat(date) {
    return this.commonFunctionsService.dateFormat(date);
  }

  getAccountsByStatus() {

    if (this.title === 'Bulk Certify Income Statement') {
      this.accountsService.fetchBulkCertifyIncomeStatement(this.year, this.month, this.companyId).subscribe({
        next: (accounts: any) => {
          this.loader = false;
          this.bulkAccounts = accounts.accounts;
          this.filteredAccountData = accounts.accounts;

          this.bulkAccounts.forEach((account) => {
            account.certify = false;

            const payload = {
              description: "Created Monthly Account",
              account_id: account.account_id,
              company_id: account.company_id,
              year: account.year,
              month: account.month,
              allocated_preparer: account.preparer_id,
              allocated_reviewer: account.reviewer_id
            };

            if (account.capture_id === null) {
              this._api.postTypeRequest('captures/capture-workpaper', payload).subscribe({
                next: (res: any) => {
                  account.capture_id = Number(res.toString());
                },
                error: (error) => {
                  this.handleError(error);
                },
                complete: () => {
                  this.ngOnInit();
                }
              });
            }
            this.loader = false;
          });
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
        }
      });
    } else if (this.title === 'Bulk Certify Balance Statement') {
      this.accountsService.fetchBulkCertifyBalanceStatement(this.year, this.month, this.companyId).subscribe({
        next: (accounts: any) => {
          this.loader = false;
          this.bulkAccounts = accounts.accounts;
          this.filteredAccountData = accounts.accounts;

          this.bulkAccounts.forEach((account) => {
            account.certify = false;

            const payload = {
              description: "Created Monthly Account",
              account_id: account.account_id,
              company_id: account.company_id,
              year: account.year,
              month: account.month,
              allocated_preparer: account.preparer_id,
              allocated_reviewer: account.reviewer_id
            };


            if (account.capture_id === null) {
              this._api.postTypeRequest('captures/capture-workpaper', payload).subscribe({
                next: (res: any) => {
                  account.capture_id = Number(res.toString());
                },
                error: (error) => {
                  this.handleError(error);
                },
                complete: () => {
                  this.ngOnInit();
                }
              });
            }
          });
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
        }
      });
    }
  }


  changeHandler(item: any) {
    const id = item.id;

    const index = this.bulkAccounts.findIndex((u) => u.id === id);
    if (index === -1) {
      // ADD TO SELECTION
      this.bulkAccounts = [...this.bulkAccounts, item];
    }
  }

  getSelection(item) {
    return this.bulkAccounts.findIndex((s) => s.id === item.id) !== -1;
  }

  checkAllOptions() {
    if (this.bulkAccounts.every((val) => val.certify === true)) {
      this.bulkAccounts.forEach((val) => {
        val.certify = false;
      });
    } else {
      this.bulkAccounts.forEach((val) => {
        val.certify = true;
      });
    }
  }

  submitForReviewModal() {

    let status = 3;
    let action = 'Submit Capture';

    this.actionModalRef = this.modalService.open(BulkCertifyActionModalComponent, {
      ignoreBackdropClick: true,
      data: {
        bulkCertifyPayload: {
          bulkAccounts: this.bulkAccounts,
          file: this.file,
          status: status,
          action: action
        }
      }
    });
    this.actionModalRef.onClose.subscribe(() => {
      this.ngOnInit();
    });
  }

  // fileupload
  onFileSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
      this.fileName = file.name;
    }
  }

  filter_accounts() {
    this.search_name_input = '';
    this.status_dropdown = '0';
    const accountNewData = this.filteredAccountData;
    const accountFilteredData = accountNewData.filter(element =>
      element.account_id.includes(this.search_input)
    );
    this.bulkAccounts = accountFilteredData;
  }

  filter_account_names() {
    this.search_input = '';
    this.status_dropdown = '0';
    const accountNewData = this.filteredAccountData;
    const accountFilteredData = accountNewData.filter(element =>
      element.account_name.toLowerCase().includes(this.search_name_input.toLowerCase())
    );
    this.bulkAccounts = accountFilteredData;
  }

  filter_account_status() {
    if (parseInt(this.status_dropdown) !== 0) {
      const accountNewData = this.filteredAccountData;
      const accountFilteredData = accountNewData.filter(element =>
        element.status === parseInt(this.status_dropdown)
      );
      this.bulkAccounts = accountFilteredData;
    } else {
      this.bulkAccounts = this.filteredAccountData;
    }
  }

  reset() {
    this.search_input = '';
    this.status_dropdown = '0';
    this.search_name_input = '';
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.ngOnChanges();
      this.loader = false;
      this.router.navigate([currentUrl]);
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
