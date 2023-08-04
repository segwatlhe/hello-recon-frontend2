import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import Swal from "sweetalert2";
import {MdbTabsComponent} from 'mdb-angular-ui-kit/tabs';

@Component({
  selector: 'app-user-accounts-modal',
  templateUrl: './user-accounts-modal.component.html',
  styleUrls: ['./user-accounts-modal.component.css']
})
export class UserAccountsModalComponent implements OnInit {
  @ViewChild('tabs') tabs: MdbTabsComponent | undefined;
  public user_details: any;
  public linkedCompanies: any;
  public linkedAccounts: any;
  public companies: any;
  public userName: any;
  public userId: any;
  public bulkUpdateObj: any;

  constructor(
    private _api: ApiService,
    public modalRef: MdbModalRef<UserAccountsModalComponent>
  ) {
  }

  ngOnInit(): void {
    this.bulkUpdateObj = {
      preparer: {},
      reviewer: {},
      unsubscribe: {
        preparer: {},
        reviewer: {}
      },
    };
    this.linkedAccounts = [];
    this.populateLinkedAccounts();
    this.userName = this.user_details.name;
    this.userId = this.user_details.user_id;
  }

  async populateLinkedAccounts() {
    let usercompanies = {};
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const month = this.getMonth();
    const year = this.getYear();
    await this._api.getTypeRequest('company/fetch-companies?active=1&user=' + this.user_details.user_id).subscribe(async (res: any) => {
      usercompanies = res.companies;
      for (const key in usercompanies) {
        await this._api.getTypeRequest('accounts/fetch-accounts?year=' + year + '&month=' + month + '&company_id=' + usercompanies[key].company_id).subscribe((res: any) => {
          let companyDetails = {
            company_name: usercompanies[key].company_name,
            company_id: usercompanies[key].company_id,
            accounts: res.accounts
          };
          this.linkedAccounts.push(companyDetails);
          /*for (let i=0; i<20; i++) {
            this.linkedAccounts.push(companyDetails);
          }*/
        });
      }
    });
  }

  async assignRole(userId, role, captureId = null, companyId, account_id, year, month, selectedPreparer, selectedReviewer, tabIndex) {
    if (captureId === null) {
      const payload = {
        description: "Created Monthly Account",
        account_id: account_id,
        company_id: companyId,
        year: year,
        month: month,
        allocated_preparer: selectedPreparer,
        allocated_reviewer: selectedReviewer
      };
      let capture = 'none';
      await this._api.postTypeRequest('captures/capture-workpaper', payload).subscribe(async (res: any) => {
        capture = res.message;
        console.log(capture);
        const payload = {
          user_id: userId,
          account_id: account_id,
          capture_id: res.message,
          company_id: companyId,
          role: role
        };
        await this._api.postTypeRequest('accounts/assign-account', payload).subscribe(async (res: any) => {
          await Swal.fire('', res.message, 'success').then((result) => {
            this.linkedAccounts = [];
            Promise.resolve().then(() => {
              this.populateLinkedAccounts().then(() => {
                this.tabs !== undefined ? this.tabs.setActiveTab(tabIndex) : null
              });
            });
          });
        });
      });
    } else {
      const payload = {
        user_id: userId,
        account_id: account_id,
        capture_id: captureId,
        company_id: companyId,
        role: role
      };
      this._api.postTypeRequest('accounts/assign-account', payload).subscribe(async (res: any) => {
        await Swal.fire('', res.message, 'success').then((result) => {
          this.linkedAccounts = [];
          Promise.resolve().then(() => {
            this.populateLinkedAccounts().then(() => {
              this.tabs !== undefined ? this.tabs.setActiveTab(tabIndex + 1) : null
            });
          });
        });
      });
    }
  }

  checkSelect(event, role, accountId, month, year) {
    if (event.target.checked) {
      if (this.bulkUpdateObj.unsubscribe[accountId] && this.bulkUpdateObj.unsubscribe[accountId].role === role) {
        delete this.bulkUpdateObj.unsubscribe[accountId];
      }
      const selectIdArr = event.target.id.split('_');
      const otherRole = role === 'preparer' ? 'reviewer' : 'preparer';
      const selectId = otherRole + '_' + selectIdArr[1];
      const input = document.getElementById(selectId) as HTMLInputElement | null;
      if (input != null) {
        input.checked = false;
      }
    }
    if (role === 'preparer') {
      if (event.target.checked) {
        this.bulkUpdateObj.preparer[accountId] = {
          id: accountId,
          user: this.userId,
          role: role,
          month: month,
          year: year
        };
        this.bulkUpdateObj.unsubscribe['preparer'][accountId] = {
          id: accountId,
          user: this.userId,
          role: role,
          month: month,
          year: year
        };
      } else {
        this.bulkUpdateObj.unsubscribe['reviewer'][accountId] = {
          id: accountId,
          user: this.userId,
          role: role,
          month: month,
          year: year
        };
        delete this.bulkUpdateObj.preparer[accountId];
      }
    } else if (role === 'reviewer') {
      if (event.target.checked) {
        this.bulkUpdateObj.reviewer[accountId] = {
          id: accountId,
          user: this.userId,
          role: role,
          month: month,
          year: year
        };
        this.bulkUpdateObj.unsubscribe['reviewer'][accountId] = {
          id: accountId,
          user: this.userId,
          role: role,
          month: month,
          year: year
        };
      } else {
        this.bulkUpdateObj.unsubscribe['preparer'][accountId] = {
          id: accountId,
          user: this.userId,
          role: role,
          month: month,
          year: year
        };
        delete this.bulkUpdateObj.reviewer[accountId];
      }
    }
  }

  bulkUpdate() {
    console.log(this.bulkUpdateObj);
    const payload = {
      update_details: this.bulkUpdateObj
    };
    console.log(payload);
    this._api.postTypeRequest('accounts/bulk-assign-accounts', payload).subscribe(async (res: any) => {
      await Swal.fire('', res.message, 'success').then((result) => {
        this.linkedAccounts = [];
        Promise.resolve().then(() => {
          this.populateLinkedAccounts().then(() => {
            this.modalRef.close();
          });
        });
      });
    });
  }

  getMonth() {
    new Date().getFullYear();
    let newMonth = new Date().getMonth();
    if (newMonth === 0) {
      newMonth = 12;
    }
    console.log('month', newMonth);
    return newMonth
  }


  getYear() {
    let newYear = new Date().getFullYear();
    let newMonth = new Date().getMonth();
    if (newMonth === 0) {
      newYear = newYear - 1;
    }
    console.log('year', newYear);
    return newYear;
  }

}
