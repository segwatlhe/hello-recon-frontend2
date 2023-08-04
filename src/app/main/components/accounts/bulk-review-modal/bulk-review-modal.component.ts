import {Component, Input, OnInit} from '@angular/core';
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {ApiService} from "../../../../services/api.service";
import {CommonFunctionsService} from "../../../../services/common-functions.service";
import {BulkReviewActionModalComponent} from "./bulk-review-action-modal/bulk-review-action-modal.component";
import {throwError} from "rxjs";
import {Accounts} from "../../../../model/accounts.model";
import {Router} from "@angular/router";
import {AccountsService} from "../../../../services/accounts/accounts.service";


@Component({
  selector: 'app-bulk-review-modal',
  templateUrl: './bulk-review-modal.component.html',
  styleUrls: ['./bulk-review-modal.component.css'],
  providers: [MdbModalService]
})
export class BulkReviewModalComponent implements OnInit {

  actionModalRef: MdbModalRef<BulkReviewModalComponent> | null = null;
  @Input() public selectedCompanyID!: (param: any) => void;
  @Input() public selectedYear!: (param: any) => void;
  @Input() public selectedMonth!: (param: any) => void;

  public currentYear: any;
  public currentMonth: any;
  public loader;

  constructor(private _api: ApiService,
              private modalService: MdbModalService,
              private commonFunctionsService: CommonFunctionsService,
              public modalRef: MdbModalRef<BulkReviewModalComponent>,
              private router: Router,
              private accountsService: AccountsService) {

  }

  public role: any;
  public completed_status: any;
  public account: any;
  public account_details: any;
  public userId: any;
  public status_dropdown;
  public search_input: any;
  public search_name_input: any;
  public filteredAccountData: any;

  ngOnInit(): void {
    this.loader = true;
    this.getAccountsByStatus()

    this.account = this.account_details[0];
    this.admin_status = 'active';
    this.preparer_status = 'default';
    this.reviewer_status = 'default';
    this.completed_status = 'default';
    this.reviewer = this.account.reviewer;
    this.preparer = this.account.preparer;
    this.administrator = this.account.administrator;

    const preUserId = localStorage.getItem('userId') ? localStorage.getItem('userId') : '';
    // @ts-ignore
    this.userId = preUserId !== '' ? parseInt(preUserId.toString()) : null;

    console.log('userId:', preUserId);
    this.userId = preUserId;

    this.getAccountsByStatus();
    this.role = localStorage.getItem('role');
  }

  ngOnChanges(): void {
    this.getAccountsByStatus();
  }

  public title: any;
  pageCustomer = 1;
  countCustomer = 20;
  admin_status: any;
  status: any;
  administrator: any;
  preparer_status: any;
  preparer: any;
  reviewer_status: any;
  reviewer: any;
  bulkReviewAccounts: Accounts[] = [];
  public month: any;
  public year: any;
  public companyId: any;
  public loader2: any;
  public extension: any;

  getSelection(item) {
    return this.bulkReviewAccounts.findIndex((s) => s.id === item.id) !== -1;
  }

  changeHandler(item: any) {
    const id = item.id;

    const index = this.bulkReviewAccounts.findIndex((u) => u.id === id);
    if (index === -1) {
      // ADD TO SELECTION
      this.bulkReviewAccounts = [...this.bulkReviewAccounts, item];
    }
  }

  dateFormat(date) {
    return this.commonFunctionsService.dateFormat(date);
  }

  getAccountsByStatus() {

    if (this.title === 'Bulk Review Income Statement') {
      this.accountsService.fetchBulkReviewsIncomeStatement(this.year, this.month, this.companyId).subscribe({
        next: (accounts: any) => {
          this.loader = false;
          this.bulkReviewAccounts = accounts.accounts;
          this.filteredAccountData = accounts.accounts;

          this.bulkReviewAccounts.forEach((account) => {
            account.certify = false;
            this.extension = account.extension;
          });
        },
        error: (error) => {
          this.handleError(error);
        },
        complete: () => {
        }
      });
    } else if (this.title === 'Bulk Review Balance Statement') {
      this.accountsService.fetchBulkReviewsBalanceStatement(this.year, this.month, this.companyId).subscribe({
        next: (accounts: any) => {
          this.loader = false;
          this.bulkReviewAccounts = accounts.accounts;
          this.filteredAccountData = accounts.accounts;

          this.bulkReviewAccounts.forEach((account) => {
            account.certify = false;
            this.extension = account.extension;
          });
        },
        error: (error) => {
          this.handleError(error);
        },
        complete: () => {
        }
      });
    }
  }

  checkAllOptions() {
    if (this.bulkReviewAccounts.every((val) => val.certify === true)) {
      this.bulkReviewAccounts.forEach((val) => {
        val.certify = false;
      });
    } else {
      this.bulkReviewAccounts.forEach((val) => {
        const preparerId = String(val.preparer_id); // Convert preparer_id to string
        const reviewerId = String(val.reviewer_id); // Convert reviewer_id to string
        if (this.userId !== preparerId && this.userId !== reviewerId) {
          val.certify = true;
        }
      });
    }
  }

  submitCompleteModal(result: boolean) {

    let status: number;
    let action: string;
    let title: string;
    let button: string;

    if (result === true) {
      status = 4;
      action = 'capture-completed';
      title = 'Approve capture';
      button = 'Approve and Submit';
    } else {
      status = 2;
      action = 'Reject capture';
      title = 'Reject capture';
      button = 'Reject and Submit';
    }
    this.actionModalRef = this.modalService.open(BulkReviewActionModalComponent, {
      ignoreBackdropClick: true,
      data: {
        bulkReviewPayload: {
          bulkReviewAccounts: this.bulkReviewAccounts,
          status: status,
          action: action,
          title: title,
          button: button
        }
      }
    });
    this.actionModalRef.onClose.subscribe(() => {
      this.ngOnInit();
    });
  }

  dataURItoBlob(dataURI, mimeType) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], {type: mimeType});
  }

  async getWorkpaper(workpaper_id, extension) {
    this.loader2 = true;
    const file_extension = extension !== null && extension !== '' ? extension : this.extension;
    await this._api.getTypeRequest('captures/fetch-file?fileId=' + workpaper_id).subscribe((res: any) => {
      const fileBlob = this.dataURItoBlob(res.base64, res.mimeType);
      let url = window.URL.createObjectURL(fileBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'workpaper_' + workpaper_id + '.' + file_extension;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.loader2 = false;
    });
  }

  filter_accounts() {
    this.search_name_input = '';
    this.status_dropdown = '0';
    const accountNewData = this.filteredAccountData;
    const accountFilteredData = accountNewData.filter(element =>
      element.account_id.includes(this.search_input)
    );
    this.bulkReviewAccounts = accountFilteredData;
  }

  filter_account_names() {
    this.search_input = '';
    this.status_dropdown = '0';
    const accountNewData = this.filteredAccountData;
    const accountFilteredData = accountNewData.filter(element =>
      element.account_name.toLowerCase().includes(this.search_name_input.toLowerCase())
    );
    this.bulkReviewAccounts = accountFilteredData;
  }

  filter_account_status() {
    if (parseInt(this.status_dropdown) !== 0) {
      const accountNewData = this.filteredAccountData;
      const accountFilteredData = accountNewData.filter(element =>
        element.status === parseInt(this.status_dropdown)
      );
      this.bulkReviewAccounts = accountFilteredData;
    } else {
      this.bulkReviewAccounts = this.filteredAccountData;
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

