import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private _router: Router
  ) { }

  getUserDetails() {
    if(localStorage.getItem('token')){
      return localStorage.getItem('token')
    }else{
      return null
    }

  }
  setDataInLocalStorage(variableName, data) {
    localStorage.setItem(variableName, data);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  clearStorage() {
    localStorage.clear();
  }
  logout () {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this._router.navigate(['/login']);
  }
}
