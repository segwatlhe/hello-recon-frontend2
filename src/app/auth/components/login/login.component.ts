import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ApiService } from './../../../services/api.service';
import { AuthService } from './../../../services/auth.service';
import { AuthGuardService } from './../../../services/auth-guard.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogin: boolean = false;
  errorMessage: any;
  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _authGuard: AuthGuardService,
    private _router:Router
  ) { }
  ngOnInit() {
    this.isUserLogin();
    if(this.isLogin) {
      this._api.getTypeRequest('auth/token').subscribe(
        (res: any) => {
          if (res.refreshToken) {
            this._auth.setDataInLocalStorage('token', res.refreshToken);
            return true;
          } else {
            this._auth.logout();
            return false;
          }
        },
        err => {
          this._auth.logout();
          return false;
        });
    }
    return true;
  }

  onSubmit(form: NgForm) {
    this._api.postTypeRequest('auth/signin', form.value).subscribe((res: any) => {
      if (res.accessToken) {

        this._auth.setDataInLocalStorage('userId', res.id);
        this._auth.setDataInLocalStorage('token', res.accessToken);
        this._auth.setDataInLocalStorage('role', res.roles);
        window.location.href = window.location.origin;
      }
    })
  }
  isUserLogin(){
    if(this._auth.getUserDetails() != null){
      this.isLogin = true;
    }
  }
  logout(){
    this._auth.clearStorage();
    this._router.navigate(['/']);
  }
}
