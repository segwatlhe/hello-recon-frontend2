import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ApiService } from "./services/api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public userDetails: any;
  public pre_current_user: any;
  public current_user: any;
  public user_name: any;
  public user_role: any;
  constructor(
    private _authService: AuthService,
    private _api: ApiService,
    private _auth: AuthService,
  ) {}
  title = 'hellogrouprecon-frontend';
  isLoggedIn = false;
  ngOnInit(): void {
    this.isLoggedIn = !!this._authService.getToken();
    this.current_user = localStorage.getItem('userId');
    this.user_role = localStorage.getItem('role');
    this.getUserDetails();
  }
  ngOnChanges(): void {
  }
  logout(): void {
    this._authService.clearStorage();
    window.location.reload();
  }
  getUserDetails() {
    const payload = {
      "amount": "one",
      "user_id": this.current_user
    };
    if(this.isLoggedIn) {
      this._api.postTypeRequest('users/get-users', payload).subscribe((res: any) => {
        this.userDetails = res.users[0];
        this.user_name = this.userDetails.firstName.concat(' ', this.userDetails.surname);
      });
    }
  }
}
