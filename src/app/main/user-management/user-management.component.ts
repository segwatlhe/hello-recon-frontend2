import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import { UserModalComponent} from "../components/user-modal/user-modal.component";
import { UserCompanyModalComponent } from "../components/user-company-modal/user-company-modal.component";
import { UserAccountsModalComponent } from "../components/user-accounts-modal/user-accounts-modal.component";
import Swal from "sweetalert2";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  providers: [MdbModalService]
})
export class UserManagementComponent implements OnInit {
  public users: any;
  modalRef: MdbModalRef<UserModalComponent> | null = null;
  userCompanyModalRef: MdbModalRef<UserCompanyModalComponent> | null = null;
  userAccountsModalRef: MdbModalRef<UserAccountsModalComponent> | null = null;
  public loader;
  public user;
  constructor(
    private _api: ApiService,
    private modalService: MdbModalService
  ) { }

  ngOnInit(): void {
    this.loader = true;
    let user_str = localStorage.getItem('userId');
    // @ts-ignore
    this.user = parseInt(user_str.toString());
    this.fetchUsers();
  }

  fetchUsers() {
    const payload = { amount: "all" };
    this._api.postTypeRequest('users/get-users', payload).subscribe((res: any) => {
      this.users = res.users;
      this.loader = false;
    });
  }

  addUser() {
    this.modalRef = this.modalService.open(UserModalComponent, {
      data: {},
      modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable w-50'
    });
    this.modalRef.onClose.subscribe((submit) => {
      this.fetchUsers();
    });
  }

  editUserDetails(id, username, email, firstName, surname, active_status, role, canReview){
    const active = active_status === 1;
    this.modalRef = this.modalService.open(UserModalComponent, {
      data: {
        user_details: {
          user_id: id,
          username: username,
          email: email,
          firstName: firstName,
          surname: surname,
          active: active,
          canReview: canReview,
          role: role
        }
      },
      modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable w-50'
    });
    this.modalRef.onClose.subscribe((submit) => {
      this.fetchUsers();
    });
  }

  editUserCompanies(id){
    this.userCompanyModalRef = this.modalService.open(UserCompanyModalComponent, {
      data: {
        user_details: {
          user_id: id,
        }
      },
      modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable w-50'
    });
  }

  editUserAccounts(id, firstName, surname){
    this.userAccountsModalRef = this.modalService.open(UserAccountsModalComponent, {
      data: {
        user_details: {
          user_id: id,
          name: firstName + ' ' + surname
        }
      },
      modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable modal-custom'
    });
  }

  onStatusChange(event, id) {
    let activeStatus = 0;
    if (event.target.checked) {
      activeStatus = 1;
    }
    const payload = {
      "id": id,
      "status": activeStatus
    };

    this._api.postTypeRequest('auth/activate-user', payload).subscribe(async(res: any) => {
      this.fetchUsers();
    });
  }

}
