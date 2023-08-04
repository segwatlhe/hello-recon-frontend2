import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./auth/components/login/login.component";
import { ProfileComponent } from './main/profile/profile.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UserManagementComponent } from "./main/user-management/user-management.component";
import { CompanyManagementComponent } from "./main/company-management/company-management.component";
import { UserProfileComponent } from "./main/user-profile/user-profile.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'profile', canActivate: [AuthGuardService], component: ProfileComponent},
  {path: '', canActivate: [AuthGuardService], component: DashboardComponent},
  {path: 'user-management', canActivate: [AuthGuardService], component: UserManagementComponent},
  {path: 'company-management', canActivate: [AuthGuardService], component: CompanyManagementComponent},
  {path: 'user-profile', canActivate: [AuthGuardService], component: UserProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
