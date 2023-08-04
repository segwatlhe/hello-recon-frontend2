import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from "./auth/auth/auth.module";
import { ProfileComponent } from './main/profile/profile.component';
import { InterceptorService } from './services/interceptor-service.service';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { CompaniesComponent } from './main/components/companies/companies.component';
import { AccountsComponent } from './main/components/accounts/accounts.component';
import { CaptureModalComponent } from './main/components/capture-modal/capture-modal.component';
import { OverlayModule } from "@angular/cdk/overlay";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ActionModalComponent } from './main/components/action-modal/action-modal.component';
import { CompanyModalComponent } from './main/components/company-modal/company-modal.component';
import { UserManagementComponent } from './main/user-management/user-management.component';
import { CompanyManagementComponent } from './main/company-management/company-management.component';
import { UserModalComponent } from './main/components/user-modal/user-modal.component';
import { UserCompanyModalComponent } from './main/components/user-company-modal/user-company-modal.component';
import { UserAccountsModalComponent } from './main/components/user-accounts-modal/user-accounts-modal.component';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { UserProfileComponent } from './main/user-profile/user-profile.component';
import { BulkCertifyModalComponent } from './main/components/accounts/bulk-certify-modal/bulk-certify-modal.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MdbModalService} from "mdb-angular-ui-kit/modal";
import {NgxPaginationModule} from "ngx-pagination";
import { BulkCertifyActionModalComponent } from './main/components/accounts/bulk-certify-modal/bulk-certify-action-modal/bulk-certify-action-modal.component';
import { BulkReviewModalComponent } from './main/components/accounts/bulk-review-modal/bulk-review-modal.component';
import { BulkReviewActionModalComponent } from './main/components/accounts/bulk-review-modal/bulk-review-action-modal/bulk-review-action-modal.component';
import {MatExpansionModule} from "@angular/material/expansion";
import { BalanceSheetAccountsComponent } from './main/components/accounts/balance-sheet-accounts/balance-sheet-accounts.component';
import { IncomeStatementAccountsComponent } from './main/components/accounts/income-statement-accounts/income-statement-accounts.component';
import {SortDirective} from "./main/helper/sort.directive";
import { PpiMappingModalComponent } from './main/company-management/ppi-mapping-modal/ppi-mapping-modal.component';
import { DcmMappingModalComponent } from './main/company-management/dcm-mapping-modal/dcm-mapping-modal.component';
import { WorkFlowResetModalComponent } from './main/components/accounts/work-flow-reset-modal/work-flow-reset-modal.component';
import { WorkFlowResetActionModalComponent } from './main/components/accounts/work-flow-reset-modal/work-flow-reset-action-modal/work-flow-reset-action-modal.component';
import { LoanAccountsMappingModalComponent } from './main/company-management/loan-accounts-mapping-modal/loan-accounts-mapping-modal.component';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    DashboardComponent,
    CompaniesComponent,
    AccountsComponent,
    CaptureModalComponent,
    ActionModalComponent,
    UserManagementComponent,
    CompanyManagementComponent,
    CompanyModalComponent,
    UserModalComponent,
    UserCompanyModalComponent,
    UserAccountsModalComponent,
    UserProfileComponent,
    BulkCertifyModalComponent,
    BulkCertifyActionModalComponent,
    BulkReviewModalComponent,
    BulkReviewActionModalComponent,
    BalanceSheetAccountsComponent,
    IncomeStatementAccountsComponent,
    SortDirective,
    PpiMappingModalComponent,
    DcmMappingModalComponent,
    WorkFlowResetModalComponent,
    WorkFlowResetActionModalComponent,
    LoanAccountsMappingModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    AuthModule,
    OverlayModule,
    FormsModule,
    MdbTabsModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    MatExpansionModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule

  ],
  entryComponents: [
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    MdbModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
