import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from "./api.service";
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private _authService: AuthService,
    private _api: ApiService,
    private _auth: AuthService,
    private _router: Router
  ) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this._authService.getToken()) {
      this._api.getTypeRequest('auth/token').subscribe(
        (res: any) => {
          if(res.refreshToken) {
            this._auth.setDataInLocalStorage('token', res.refreshToken);
            return true;
          } else {
            this._auth.logout();
            return false;
          }
        },
        err => {
          this._auth.logout();
          return false; });
      return true;
    }
    // navigate to login page
    window.location.href = window.location.origin + '/login';
    this._router.navigate(['login']);
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }
}
