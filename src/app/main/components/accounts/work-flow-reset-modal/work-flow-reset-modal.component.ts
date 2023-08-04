import {Component, Input, OnInit} from '@angular/core';
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {ApiService} from "../../../../services/api.service";
import {CommonFunctionsService} from "../../../../services/common-functions.service";
import {Router} from "@angular/router";
import {Accounts} from "../../../../model/accounts.model";
import {throwError} from "rxjs";
import {
  BulkCertifyActionModalComponent
} from "../bulk-certify-modal/bulk-certify-action-modal/bulk-certify-action-modal.component";
import {WorkFlowResetActionModalComponent} from "./work-flow-reset-action-modal/work-flow-reset-action-modal.component";

@Component({
  selector: 'app-work-flow-reset-modal',
  templateUrl: './work-flow-reset-modal.component.html',
  styleUrls: ['./work-flow-reset-modal.component.css']
})
export class WorkFlowResetModalComponent implements OnInit {

  actionModalRef: MdbModalRef<WorkFlowResetModalComponent> | null = null;
  @Input() public selectedCompanyID!: (param: any) => void;
  @Input() public selectedYear!: (param: any) => void;
  @Input() public selectedMonth!: (param: any) => void;

  public currentYear: any;
  public currentMonth: any;
  public loader;

  constructor(private _api: ApiService,
              private modalService: MdbModalService,
              private commonFunctionsService: CommonFunctionsService,
              public modalRef: MdbModalRef<WorkFlowResetModalComponent>,
              private router: Router
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
    const param = 'year=' + this.year + '&month=' + this.month + '&company_id=' + this.companyId;
    //const param = 'year=' + this.year + '&month=' + this.month + '&company_id=' + this.companyId + '&user=' + this.userId;
    this._api.getTypeRequest('accounts/fetch-work-reset-accounts?' + param).subscribe({
      next: (accounts: any) => {
        this.bulkAccounts = accounts.accounts;
        this.filteredAccountData = accounts.accounts;
        this.loader = false;
        this.bulkAccounts.forEach((account) => {
          account.certify = false;
        });
      },
      complete: () => {
      }
    });
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
  submitForReviewModal() {

    let status = 3;
    let action = 'Submit Capture';

    this.actionModalRef = this.modalService.open(WorkFlowResetActionModalComponent, {
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

}

