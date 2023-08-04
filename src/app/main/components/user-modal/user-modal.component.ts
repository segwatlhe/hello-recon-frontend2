import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import { MdbModalRef } from "mdb-angular-ui-kit/modal";
import { ApiService } from "../../../services/api.service";

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  public user_details: any;
  public username_input: any;
  public firstName_input: any;
  public surname_input: any;
  public email_input: any;
  public active_input: any;
  public password_input: any;
  public can_review_input: any;
  public placeholder: any;
  public selectedRole: any;
  public disabled: any;
  public loader;
  constructor(
    private _api: ApiService,
    public modalRef: MdbModalRef<UserModalComponent>) { }

  ngOnInit(): void {
    this.username_input = this.user_details && this.user_details.username ? this.user_details.username : '' ;
    this.firstName_input = this.user_details && this.user_details.firstName ? this.user_details.firstName : '' ;
    this.surname_input = this.user_details && this.user_details.surname ? this.user_details.surname : '' ;
    this.email_input = this.user_details && this.user_details.email ? this.user_details.email : '' ;
    this.active_input = this.user_details && this.user_details.active ? this.user_details.active : '' ;
    this.selectedRole = this.user_details && this.user_details.role ? this.user_details.role : '' ;
    this.can_review_input = this.user_details && this.user_details.canReview === 1 ? this.user_details.canReview : false;
    this.placeholder = this.user_details && this.user_details.user_id ? 'Leave empty to keep current password' : '';
    const role = localStorage.getItem('role');
    this.disabled = !!(this.user_details && this.user_details.user_id && role !== 'ROLE_ADMINISTRATOR');
    this.loader = false;
  }

  async addUser(){
    this.loader = true;

    if (this.selectedRole === '') {
      await Swal.fire('', 'Role cannot be unassigned', 'warning').then((result) => {
        this.loader = false;
      });
    } else {
      const payload = {
        username: this.username_input,
        email: this.email_input,
        firstName: this.firstName_input,
        surname: this.surname_input,
        status: this.active_input,
        password: this.password_input,
        canReview: this.can_review_input === true && this.selectedRole !== 'Administrator',
        roles: [this.selectedRole]
      };
      this._api.postTypeRequest('auth/add-user', payload).subscribe(async res => {
        await Swal.fire('', res['message'], 'success').then((result) => {
          this.loader = false;
          this.modalRef.close();
        });
      },
        err => {
          this.loader = false;
        });
      this.loader = false;
    }
  }
  saveUser(id){
    const payload = {
      firstName: this.firstName_input,
      surname: this.surname_input,
      status: this.active_input,
      canReview: this.can_review_input === true && this.selectedRole !== 'Administrator',
      user_id: id
    };
    if(this.username_input !== this.user_details.username) {
      payload['username'] = this.username_input;
    }
    if(this.email_input !== this.user_details.email) {
      payload['email'] = this.email_input;
    }
    this.password_input = this.password_input && this.password_input !== '' ? this.password_input : '' ;
    if(this.password_input !== ''){
      payload["password"] = this.password_input;
    }

    this._api.postTypeRequest('auth/edit-user', payload).subscribe(async res => {
      await Swal.fire('', res['message'], 'success').then((result) => {
        this.modalRef.close();
      });
    },
      err => {
        this.loader = false;
      });
  }
  async deleteUser(id){
    await Swal.fire({
      title: 'Are you sure you want to delete this user?',
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if(result.isConfirmed) {
        const payload = {
          id: id
        };
        this._api.postTypeRequest('auth/remove-user', payload).subscribe(async res => {
            await Swal.fire('', res['message'], 'success').then((result) => {
              this.modalRef.close();
            });
          },
          err => {
            this.loader = false;
          });
      }
    });
  }

}
