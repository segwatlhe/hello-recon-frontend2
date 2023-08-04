import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import { ApiService } from "../../services/api.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public user_details: any;
  public firstName_input: any;
  public surname_input: any;
  public password_input: any;
  public confirm_password_input: any;
  public disabled: any;
  public loader;
  public user: any;
  public user_id: any;
  public submit_disabled: any;

  constructor(
    private _api: ApiService
  ) {}

  ngOnInit(): void {
    console.log('password_input', this.password_input);
    this.user_id = localStorage.getItem('userId');
    this.submit_disabled = false;
    this.fetchUser();
  }

  async fetchUser() {
    this.loader = true;
    const payload = {
      amount: "one",
      user_id: this.user_id
    };
    await this._api.postTypeRequest('users/get-users', payload).subscribe(res => {
      this.user = res['users'];
      this.firstName_input = this.user[0].firstName;
      this.surname_input = this.user[0].surname;
      this.password_input = '';
      this.loader = false;
    },
      err => {
        console.log(err);
      });
  }

  saveUser(){
    const payload = {
      firstName: this.firstName_input,
      surname: this.surname_input,
      user_id: this.user_id
    };
    this.password_input = this.password_input && this.password_input !== '' ? this.password_input : '' ;
    if(this.password_input !== '') {
      payload["password"] = this.password_input;
    }
    this._api.postTypeRequest('auth/edit-user', payload).subscribe(async res => {
        await Swal.fire('', res['message'], 'success').then((result) => {
          this.fetchUser();
        });
      },
      err => {
        this.loader = false;
      });
  }
  checkPasswordMatch() {
    if (
      (this.password_input === undefined && this.confirm_password_input === undefined) ||
      (this.password_input === '' && this.confirm_password_input === undefined) ||
      (this.password_input === '' && this.confirm_password_input === '') ||
      (this.password_input === this.confirm_password_input)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
