import {Component, Input, OnInit} from '@angular/core';
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {CaptureModalComponent} from "../../capture-modal/capture-modal.component";
import {ApiService} from "../../../../services/api.service";
import {CommonFunctionsService} from "../../../../services/common-functions.service";
import {Router} from "@angular/router";
import {BulkCertifyModalComponent} from "../bulk-certify-modal/bulk-certify-modal.component";
import {BulkReviewModalComponent} from "../bulk-review-modal/bulk-review-modal.component";
import Swal from "sweetalert2";
import {throwError} from "rxjs";
import {AccountsService} from "../../../../services/accounts/accounts.service";
import {WorkFlowResetModalComponent} from "../work-flow-reset-modal/work-flow-reset-modal.component";

@Component({
  selector: 'app-income-statement-accounts',
  templateUrl: './income-statement-accounts.component.html',
  styleUrls: ['./income-statement-accounts.component.css']
})
export class IncomeStatementAccountsComponent implements OnInit {
  @Input() public selectedCompanyID2!: (param: any) => void;
  @Input() public selectedYear2!: (param: any) => void;
  @Input() public selectedMonth2!: (param: any) => void;
  modalRef: MdbModalRef<CaptureModalComponent> | null = null;
  public accountData: any;
  public filteredAccountData: any;
  public userId: any;
  public color: any;
  public search_input: any;
  public search_name_input: any;
  public currentYear: any;
  public currentMonth: any;
  public loader;
  public selectedRisk;
  public status_dropdown;
  protected canPickupReviews: any;
  protected account_id: any;
  public user_role: any;
  public count: string = '';
  public incomestatementcount: string = '';
  btnstate: boolean = false;
  pageCustomer = 1;
  countCustomer = 50;

  constructor(
    private _api: ApiService,
    private modalService: MdbModalService,
    private commonFunctionsService: CommonFunctionsService,
    private router: Router,
    private accountService: AccountsService
  ) {
  }

  ngOnInit(): void {
    this.loader = true;


    if (localStorage.getItem('role') === 'ROLE_USER') {
      this.pickupReviews();
    }

    this.user_role = localStorage.getItem('role');
    this.fetchAccountData();
  }

  ngOnChanges(): void {
    this.fetchAccountData();
    this.incomeStatementCount();
    this.incomeStatementBalance();
  }

  fetchAccountData() {
    this.search_input = '';
    this.search_name_input = '';
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    this.currentMonth = currentMonth;
    this.currentYear = currentYear;
    const company_id = this.selectedCompanyID2;
    const year = this.selectedYear2 ? this.selectedYear2 : currentYear;
    const month = this.selectedMonth2 ? this.selectedMonth2 : currentMonth;
    const preUserId = localStorage.getItem('userId') ? localStorage.getItem('userId') : '';
    // @ts-ignore
    this.userId = preUserId !== '' ? parseInt(preUserId.toString()) : null;
    this.status_dropdown = '0';
    this.accountService.getIncomeStatementSheet(year, month, company_id).subscribe((res: any) => {
      if (localStorage.getItem('role') === 'ROLE_ADMINISTRATOR') {
        this.accountData = res.accounts;
        this.filteredAccountData = res.accounts;
        this.loader = false;
      } else {
        const accountNewData = res.accounts;
        const accountFilteredData = accountNewData.filter(element =>
          this.userId ? ((!element.preparer_id || !element.reviewer_id) || (element.preparer_id && element.preparer_id === this.userId)) || (element.reviewer_id && element.reviewer_id === this.userId) : null
        );
        this.accountData = accountFilteredData;
        this.filteredAccountData = accountFilteredData;
        this.loader = false;
      }
    });
  }

  public getAccount: any;

  openModal(event, accountId) {
    this.btnstate = true;
    const id = event.target.id;
    const account_details = this.accountData.filter(function (account) {
      if (parseInt(account.id) === parseInt(id)) {
        return account;
      }
    });

    const companyId = this.selectedCompanyID2;
    const year = this.selectedYear2 ? this.selectedYear2 : this.currentYear;
    const month = this.selectedMonth2 ? this.selectedMonth2 : this.currentMonth;
    const param = '&account_id=' + accountId + '&year=' + year + '&month=' + month + '&company_id=' + companyId;
    this._api.getTypeRequest('accounts/bulk-certify-account?' + param).subscribe({
      next: (accounts: any) => {
        this.getAccount = accounts.accounts[0];
        this.modalRef = this.modalService.open(CaptureModalComponent, {
          data: {account_details, testPayload: {getAccount: this.getAccount}},
          modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable modal-custom'
        });
        this.modalRef.onClose.subscribe((submit) => {
          this.btnstate = false;
        });
      },
      error: (error => {
        this.handleError(error);
      }),
      complete: () => {
        this.fetchAccountData();
        this.ngOnChanges();
      }
    });
  }

  statusText(statusId) {
    let status = '';
    switch (statusId) {
      case 1:
        status = 'With Administrator';
        break;
      case 2:
        status = 'With Preparer';
        break;
      case 3:
        status = 'With Reviewer';
        break;
      case 4:
        status = 'Completed';
        break;
      default:
        status = 'With Administrator';
    }
    return status;
  }

  readyClass(preparer_id, reviewer_id, status) {
    const ready = this.readyToAction(preparer_id, reviewer_id, status);
    return ready['ready_class'];
  }

  readyText(preparer_id, reviewer_id, status) {
    const ready = this.readyToAction(preparer_id, reviewer_id, status);
    return ready['ready'];
  }

  readyToAction(preparer_id, reviewer_id, status) {
    let returnObj = {};
    if (status === 2 && this.userId === preparer_id && this.userId !== reviewer_id) {
      returnObj['ready'] = 'Ready to action';
      returnObj['ready_class'] = 'ready-class';
    } else if (status === 2 && preparer_id === null && this.userId !== reviewer_id) {
      returnObj['ready'] = 'Ready to action';
      returnObj['ready_class'] = 'ready-class';
    } else if (status === 3 && this.userId === reviewer_id && this.userId !== preparer_id) {
      returnObj['ready'] = 'Ready to action';
      returnObj['ready_class'] = 'ready-class';
    } else if (status === 3 && reviewer_id === null && this.userId !== preparer_id) {
      returnObj['ready'] = 'Ready to action';
      returnObj['ready_class'] = 'ready-class';
    } else if (status === 1 && localStorage.getItem('role') === 'ROLE_ADMINISTRATOR') {
      returnObj['ready'] = 'Ready to action';
      returnObj['ready_class'] = 'ready-class';
    }
    return returnObj;
  }

  dateFormat(date) {
    return this.commonFunctionsService.dateFormat(date);
  }

  filter_accounts() {
    this.search_name_input = '';
    this.status_dropdown = '0';
    const accountNewData = this.filteredAccountData;
    const accountFilteredData = accountNewData.filter(element =>
      element.account_id.includes(this.search_input)
    );
    this.accountData = accountFilteredData;
  }

  filter_account_names() {
    this.search_input = '';
    this.status_dropdown = '0';
    const accountNewData = this.filteredAccountData;
    const accountFilteredData = accountNewData.filter(element =>
      element.account_name.toLowerCase().includes(this.search_name_input.toLowerCase())
    );
    this.accountData = accountFilteredData;
  }

  filter_account_status() {
    if (parseInt(this.status_dropdown) !== 0) {
      const accountNewData = this.filteredAccountData;
      const accountFilteredData = accountNewData.filter(element =>
        element.status === parseInt(this.status_dropdown)
      );
      this.accountData = accountFilteredData;
    } else {
      this.accountData = this.filteredAccountData;
    }
  }

  checkEditable(month, year, status) {
    let newYear = this.currentYear;
    let newMonth = this.currentMonth;
    if (newMonth === 0) {
      newYear = this.currentYear - 1;
      newMonth = 12;
    } else {
      if (newMonth === 1) {
        newMonth = 12;
        newYear = this.currentYear - 1;
      } else {
        newMonth = this.currentMonth - 2;
      }
    }
    if ((newMonth === parseInt(month) || month === undefined) && (newYear === parseInt(year) || year === undefined) && (status === 4)) {
      return 'View';
    } else {
      return 'Edit';
    }
  }

  checkEditable2(month, year) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Months are zero-based in JavaScript, so we add 1

    return currentYear === parseInt(year) && currentMonth === parseInt(month);
  }

  riskClass(risk = '') {
    let riskClass = '';
    switch (risk) {
      case 'Low':
        riskClass = 'low-risk';
        break;
      case 'Medium':
        riskClass = 'medium-risk';
        break;
      case 'High':
        riskClass = 'high-risk';
        break;
      default:
        riskClass = '';
    }
    return riskClass;
  }

  openBulkCertifyModal(event) {
    const companyId = this.selectedCompanyID2;
    const account_details = this.accountData
    const title = 'Bulk Certify Income Statement';
    const year = this.selectedYear2 ? this.selectedYear2 : this.currentYear;
    const month = this.selectedMonth2 ? this.selectedMonth2 : this.currentMonth;

    this.modalRef = this.modalService.open(BulkCertifyModalComponent,
      {
        data: {companyId, account_details, title, year, month},
        modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable modal-custom'
      });
    this.modalRef.onClose.subscribe((submit) => {
      // this.ngOnChanges();
    });
  }

  openBulkReviewModal(event) {
    const companyId = this.selectedCompanyID2;
    const account_details = this.accountData
    const title = 'Bulk Review Income Statement';
    const year = this.selectedYear2 ? this.selectedYear2 : this.currentYear;
    const month = this.selectedMonth2 ? this.selectedMonth2 : this.currentMonth;

    this.modalRef = this.modalService.open(BulkReviewModalComponent,
      {
        data: {companyId, account_details, title, year, month},
        modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable modal-custom'
      });
    this.modalRef.onClose.subscribe((submit) => {
      // this.ngOnChanges();
    });
  }

  openWorkResetModal(event) {
    const companyId = this.selectedCompanyID2;
    const account_details = this.accountData
    const title = 'Work Flow Reset';
    const year = this.selectedYear2 ? this.selectedYear2 : this.currentYear;
    const month = this.selectedMonth2 ? this.selectedMonth2 : this.currentMonth;

    this.modalRef = this.modalService.open(WorkFlowResetModalComponent,
      {
        data: {companyId, account_details, title, year, month},
        modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable modal-custom'
      });
    this.modalRef.onClose.subscribe((submit) => {
      this.ngOnChanges();
    });
  }

  pickupReviews() {
    this._api.getTypeRequest('auth/can-pickup-reviews').subscribe(
      (res: any) => {
        this.canPickupReviews = res.message;
      },
      error => {
        this.handleError(error);
      });
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
      Swal.fire({
        title: 'Page Refreshed',
        text: '',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Okay',
      }).then((result) => {
        this.loader = false;
      });
    });
  }

  incomeStatementCount() {
    const companyId = this.selectedCompanyID2;
    const year = this.selectedYear2 ? this.selectedYear2 : this.currentYear;
    const month = this.selectedMonth2 ? this.selectedMonth2 : this.currentMonth;
    this.accountService.incomeStatementCount(year, month, companyId).subscribe({
      next: (res: any) => {
        this.count = res.message;
      },
      error: (error => {
        this.handleError(error);
      })
    });
  }

  incomeStatementBalance() {
    const companyId = this.selectedCompanyID2;
    const year = this.selectedYear2 ? this.selectedYear2 : this.currentYear;
    const month = this.selectedMonth2 ? this.selectedMonth2 : this.currentMonth;
    this.accountService.incomeStatementBalance(year, month, companyId).subscribe({
      next: (res: any) => {
        this.incomestatementcount = res.message;
      },
      error: (error => {
        this.handleError(error);
      })
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
