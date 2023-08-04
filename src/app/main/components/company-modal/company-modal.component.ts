import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from "mdb-angular-ui-kit/modal";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-company-modal',
  templateUrl: './company-modal.component.html',
  styleUrls: ['./company-modal.component.css']
})
export class CompanyModalComponent implements OnInit {
  public company_details: any;
  public company_name_input: any;
  public sql_server_db_input: any;
  public active_input: any;
  public loader;
  constructor(
    private _api: ApiService,
    public modalRef: MdbModalRef<CompanyModalComponent>
  ) {}

  ngOnInit(): void {
    this.loader = false;
    this.company_name_input = this.company_details && this.company_details.company_name ? this.company_details.company_name : '' ;
    this.sql_server_db_input = this.company_details && this.company_details.sql_server_db ? this.company_details.sql_server_db : '';
    this.active_input = this.company_details && this.company_details.active ? this.company_details.active : '';
  }

  addCompany() {
    this.loader = true;
    const payload = {
      "company_name": this.company_name_input,
      "company_db": this.sql_server_db_input
    };
    this._api.postTypeRequest('company/add-company', payload).subscribe(async res => {
      await Swal.fire('', res['message'], 'success').then((result) => {
        this.loader = false;
        this.modalRef.close();
      });
    },
      err => {
        this.loader = false;
      });
  }

  saveCompany(id) {
    this.loader = true;
    const payload = {
      "company_name": this.company_name_input,
      "company_db": this.sql_server_db_input,
      "company_id": id,
      "status": this.active_input
    };

    this._api.postTypeRequest('company/edit-company', payload).subscribe(async(res: any) => {
      await Swal.fire('', res.message, 'success').then((result) => {
        this.loader = false;
        this.modalRef.close();
      })
        .catch((err) => {
          this.loader = false;
        });
    });

  }

  async deleteCompany(id) {
    await Swal.fire({
      title: 'Are you sure you want to delete the company?',
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if(result.isConfirmed) {
        this.loader = true;
        this._api.getTypeRequest('company/remove-company?company_id=' + id).subscribe(async res => {
          await Swal.fire('', res['message'], 'success').then((result) => {
            this.loader = false;
            this.modalRef.close();
          },
            err => {
              this.loader = false;
            });
        });
      }
    });
  }

}
