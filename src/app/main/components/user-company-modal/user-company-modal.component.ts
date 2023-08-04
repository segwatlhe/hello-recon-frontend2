import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {MdbModalRef} from "mdb-angular-ui-kit/modal";

@Component({
  selector: 'app-user-company-modal',
  templateUrl: './user-company-modal.component.html',
  styleUrls: ['./user-company-modal.component.css']
})
export class UserCompanyModalComponent implements OnInit {

  public linkedCompanies: any;
  public user_details: any;

  constructor(
    private _api: ApiService,
    public modalRef: MdbModalRef<UserCompanyModalComponent>
  ) { }

  ngOnInit(): void {
    this.populateLinkedCompanies();
  }

  async populateLinkedCompanies() {
    await this._api.getTypeRequest('company/fetch-companies?active=1').subscribe((res: any) => {
      this.filterCompanies(res.companies);
    });
  }

  async filterCompanies(companies) {
    this._api.getTypeRequest('company/fetch-companies?active=1&user=' + this.user_details.user_id).subscribe((res: any) => {
      const linkedCompanies = res.companies;
      let linkedCompanyIds = [];
      for (const key in linkedCompanies) {
        let linkedCompany = linkedCompanies[key];
        // @ts-ignore
        linkedCompanyIds.push(linkedCompany.company_id);
      }
      for (const key in companies) {
        let companyId = companies[key].id;
        console.log('companyId',companyId);
        // @ts-ignore
        if (linkedCompanyIds.includes(companyId)) {
          companies[key]['linked'] = true;
        } else {
          companies[key]['linked'] = false;
        }
      }
      this.linkedCompanies = companies;
    });
  }

  onStatusChange(event, id) {
    const payload = {
      "company_id": id,
      "user_id": this.user_details.user_id
    };
    if (event.target.checked) {
      this._api.postTypeRequest('company/assign-company', payload).subscribe(async(res: any) => {});
    } else {
      this._api.postTypeRequest('company/unassign-company', payload).subscribe(async(res: any) => {});
    }
  }

}
