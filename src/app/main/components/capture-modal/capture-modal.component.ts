import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {environment} from '../../../../environments/environment';
import {ActionModalComponent} from '../action-modal/action-modal.component';
import {MdbModalRef, MdbModalService} from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';
import {CommonFunctionsService} from "../../../services/common-functions.service";
import {AccountsService} from "../../../services/accounts/accounts.service";
import {throwError} from "rxjs";

@Component({
  selector: 'app-modal',
  templateUrl: './capture-modal.component.html',
  providers: [MdbModalService]
})
export class CaptureModalComponent implements OnInit {

  actionModalRef: MdbModalRef<ActionModalComponent> | null = null;
  public account_details: any;
  public account: any;
  public role: any;
  public preparer_id: any;
  public reviewer_id: any;
  public account_id: any;
  public account_name: any;
  public company_id: any;
  public year: any;
  public month: any;
  public monthName: any;
  public balance: any;
  public createdAt: any;
  public updatedAt: any;
  public reviewer: any;
  public preparer: any;
  public administrator: any;
  public currency: any;
  public logs: any;
  public users: any;
  public current_user: number = 0;
  public pre_current_user: any;
  public admin_status: any;
  public preparer_status: any;
  public reviewer_status: any;
  public completed_status: any;
  public status: any;
  public workpaper_id: any;
  public selectedPreparer: any;
  public selectedReviewer: any;
  public capture_id: any;
  public account_id_arr: any;
  public account_without_prefix: any;
  public update_status: any;
  public update_description: any;
  public action_return: any;
  public actionModal: any;
  public updateAction: any;
  public continue: any;
  public fileName: any;
  public file: any;
  public loader: any;
  public loader2: any;
  public extension: any;
  public canPickupReviews: any;
  public risk: any;
  public selectedRisk: any;
  public riskItems: any;
  public id: any;
  public getAccount: any;
  public testPayload: any;
  selectedAccountType: number | undefined;
  constructor(
    private _api: ApiService,
    public modalRef: MdbModalRef<CaptureModalComponent>,
    private modalService: MdbModalService,
    private commonFunctionsService: CommonFunctionsService,
    private accountService: AccountsService
  ) {}

  switchAccounts = [
    {id: 1, name: "Balance Sheet"},
    {id: 2, name: "Income Statement"}
  ]

  ngOnInit(): void {
    this.account = this.account_details[0];
    this.account_name = this.account.account_name;
    this.account_id = this.account.account_id;
    this.id = this.account.id;
    this.account_id_arr = this.account.account_id.split('.');
    this.account_without_prefix = this.account_id_arr[1];
    this.year = this.account.year;
    this.month = this.account.month;
    this.balance = this.account.balance;
    this.createdAt = this.account.createdAt;
    this.updatedAt = this.account.updatedAt;
    this.reviewer = this.account.reviewer;
    this.preparer = this.account.preparer;
    this.administrator = this.account.administrator;
    this.company_id = this.account.company_id;
    this.status = this.account.status ? this.account.status : 1;
    this.monthName = '';
    this.admin_status='active';
    this.preparer_status='default';
    this.reviewer_status='default';
    this.completed_status='default';
    this.pre_current_user = localStorage.getItem('userId');
    this.current_user = parseInt(this.pre_current_user);
    this.preparer_id = this.account.preparer_id ? this.account.preparer_id : null;
    this.reviewer_id = this.account.reviewer_id ? this.account.reviewer_id : null;
    this.workpaper_id = this.account.workpaper_id;
    this.capture_id = this.account.capture_id;
    this.extension = this.account.extension;
    this.risk = this.account.risk;
    this.selectedRisk = this.account.risk ? this.account.risk :'unassigned';
    this.statusClasses();
    this.getlogs();
    if (this.account.status === 3 && localStorage.getItem('role') !== 'ROLE_ADMINISTRATOR') {
      this.pickupReviews();
    }
    this.role = localStorage.getItem('role');
    if (this.role === 'ROLE_ADMINISTRATOR'){
      this.getUsers();
    }
    if (this.role === 'ROLE_ADMINISTRATOR') {
      this.riskItems = [
        {risk:'Low'},
        {risk:'Medium'},
        {risk:'High'}
      ];

    }
    this.selectedPreparer = this.preparer_id;
    this.selectedReviewer = this.reviewer_id;
    this.update_description = "Updated details";
    this.actionModal = false;
    this.loader = false;
    this.loader2 = false;
    this.continue = true;

  }

  getlogs(){
    this._api.getTypeRequest('accounts/fetch-logs?account_id=' + this.account_id + '&month=' + this.month + '&year=' + this.year).subscribe((res: any) => {
      this.logs = res.logObj;
    });
  }

  async getWorkpaper(workpaper_id, extension = null){
    this.loader2 = true;
    const file_extension = extension !== null && extension !== '' ? extension : this.extension;
    await this._api.getTypeRequest( 'captures/fetch-file?fileId=' + workpaper_id).subscribe((res: any) => {
      const fileBlob = this.dataURItoBlob(res.base64, res.mimeType);
      let url = window.URL.createObjectURL(fileBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'workpaper_' + workpaper_id + '.' + file_extension;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.loader2 = false;
    });
  }

  dataURItoBlob(dataURI, mimeType) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], {type: mimeType});
  }

  getUsers(){
    const payload = {
      "amount": "all",
      "role": "user",
      "company_id": this.company_id
    };
    this._api.postTypeRequest('users/get-users', payload).subscribe((res: any) => {
      this.users = res.users;
    });
  }

  getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', {
      month: 'long',
    });
  }

  statusClasses() {
    switch(this.status) {
      case 2:
        this.preparer_status='active';
        break;
      case 3:
        this.preparer_status='active';
        this.reviewer_status='active';
        break;
      case 4:
        this.preparer_status='active';
        this.reviewer_status='active';
        this.completed_status='active';
        break;
      default:
    }
  }

  saveCapture(action = '') {
    this.loader = true;
    if(this.selectedPreparer === null && this.selectedReviewer === null) {
      Swal.fire('', 'No changes to save', 'warning').then(result => {
        this.loader = false;
      });
    } else {
      if ((this.current_user === this.reviewer_id || this.reviewer_id === null) && action && action === 'reject') {
        this.update_status = 2;
        this.openActionModal('Reject capture reason', 'reject-capture', 'Reject capture', 'updateCapture');
      } else {
        this.checkCapture();
      }
    }
  };

  saveCaptureProcess = async(capture_id) => {
    if (this.role === 'ROLE_ADMINISTRATOR') {
      if (parseInt(this.selectedPreparer) !== parseInt(this.selectedReviewer)) {
        let continueUpdate;
        if (this.current_user !== this.account.administrator_id) {
          const admin_payload = {
            user_id: this.current_user,
            account_id: this.account_id,
            company_id: this.account.company_id,
            capture_id: capture_id,
            role: "administrator"
          };
          continueUpdate = await this.assignAccount(admin_payload);
        }
        if (this.selectedPreparer !== 'unassigned' && this.selectedPreparer !== null && parseInt(this.selectedPreparer) !== this.account.preparer_id) {
          const admin_payload = {
            user_id: this.selectedPreparer,
            account_id: this.account_id,
            company_id: this.account.company_id,
            capture_id: capture_id,
            role: "preparer"
          };
          continueUpdate = await this.assignAccount(admin_payload);
        }
        if (this.selectedReviewer !== 'unassigned' && this.selectedReviewer !== null && parseInt(this.selectedReviewer) !== this.account.reviewer_id) {
          const admin_payload = {
            user_id: parseInt(this.selectedReviewer),
            account_id: this.account_id,
            company_id: this.account.company_id,
            capture_id: capture_id,
            role: "reviewer"
          };
          continueUpdate = await this.assignAccount(admin_payload);
        }
        if (continueUpdate === true && this.status === this.update_status) {
          await Swal.fire({
            title: 'Changes to capture saved',
            text: '',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Okay',
          }).then((result) => {
            this.modalRef.close();
          });
        }
        if (continueUpdate !== false) {
          this.updateCapture();
        }
        if (continueUpdate === true) {
          this.updateCapture();
        } else {
          this.loader = false;
        }
      } else {
        await Swal.fire('', 'Preparer and reviewer cannot be the same', 'error').then(result => {
          this.loader = false;
        });
      }
    } else if (this.status === 1 || this.status === 2) {
      if (parseInt(this.selectedPreparer) === this.account.preparer_id || this.selectedPreparer === null) {
        this.updateCapture();
      }
    } else if (this.status === 3) {
      if (parseInt(this.selectedReviewer) === this.account.reviewer_id || this.selectedReviewer === null) {
        if(this.updateAction && this.updateAction === 'Reject capture'){
          this.updateCapture();
        } else {
          await Swal.fire({
            title: 'Are you sure you want to approve this capture?',
            showCancelButton: true,
            confirmButtonText: 'Approve',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.updateCapture();
            }
          });
        }
      }


    }
  };

  checkCapture = async() => {
    if (this.capture_id === null) {
      this.createCapture();
    } else {
      this.saveCaptureProcess(this.capture_id);
    }
  };

  createCapture = async() => {
    const payload = {
      description: "Created Monthly Account",
      account_id: this.account_id,
      company_id: this.account.company_id,
      year: this.account.year,
      month: this.account.month,
      allocated_preparer: this.selectedPreparer,
      allocated_reviewer: this.selectedReviewer
    };
    let capture = 'none';
    await this._api.postTypeRequest('captures/capture-workpaper', payload).subscribe((res: any) => {
      capture = res.message;
      this.capture_id = res.message;
      this.saveCaptureProcess(res.message);
    });
  };

  assignAccount = async(payload) => {
    return new Promise(resolve => {
      this._api.postTypeRequest('accounts/assign-account', payload).subscribe((res: any) => {
        resolve(true);
      }, (error => {
        resolve(false);
      }));
    });
  };

  submitCapture = async() => {
    this.loader = true;
    if (this.role === 'ROLE_ADMINISTRATOR') {
      this.update_status = 2;
      this.update_description = "Capture submitted to preparer";
    }
    this.checkCapture();
  };

  updateCapture = async() => {
    const payload = {
      description: this.update_description,
      capture_id: this.capture_id,
      status: this.update_status ? this.update_status : this.status,
      action: this.updateAction ? this.updateAction : null
    };
    if(this.update_status === 3) {
      this.updateAction = 'Submit Capture';
      const formData = new FormData();
      formData.append("description", this.update_description);
      formData.append("capture_id", this.capture_id);
      formData.append("status", this.update_status ? this.update_status : this.status);
      formData.append("action", this.updateAction ? this.updateAction : null);
      formData.append("file", this.file);
      await this._api.postFileUploadTypeRequest('captures/update-capture', formData).subscribe(async res => {
        if (res['message'] === 'Update successful') {
          await Swal.fire({
            title: 'Update successful',
            text: '',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Okay',
          }).then((result) => {
            this.loader = false;
            this.modalRef.close();
          });
        }
      }, err => {
        this.loader = false;
        this.ngOnInit()
      });
    } else {
      await this._api.postTypeRequest('captures/update-capture', payload).subscribe(async res => {
        if (res['message'] === 'Update successful') {
          await Swal.fire({
            title: 'Update successful',
            text: '',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Okay',
          }).then((result) => {
            this.loader = false;
            this.modalRef.close();
          });
        }
      }, err => {
        this.loader = false;
      });
    }
  };

  submitForReview() {
    this.loader = true;
    this.update_description = "Capture submitted to reviewer";
    this.update_status = 3;
    this.openActionModal('Submit for review', 'submit-capture', 'Submit Capture', 'checkCapture');
  }

  uploadWhitepaper = async(capture_id) => {

    const formData = new FormData();
    formData.append("fkHelloDocTypeID", '1');
    formData.append("fkHelloDocSubTypeID", '');
    formData.append("clientId", environment.client_id);
    formData.append("customerId", environment.customer_id);
    formData.append("clientUniqueId", capture_id);
    formData.append("description", 'Submit to reviewer');
    formData.append("upload_file", this.file, this.fileName );

    return new Promise(resolve => {
      this._api.postTypeRequest('captures/update-capture', formData, 'S3_UPLOAD').subscribe((res: any) => {
        resolve(res);
      });
    });
  };

  openActionModal(heading, action, updateAction, continueFunction) {
    this.actionModal = true;
    this.actionModalRef = this.modalService.open(ActionModalComponent, {
      data: {
        action_data: {
          current_status: this.status,
          new_status: this.update_status,
          role: this.role,
          heading: heading,
          action: action,
        }
      },
      modalClass: 'modal-frame col-md-10 modal-notify modal-success modal-dialog-scrollable action-custom-model'
    });
    this.actionModalRef.onClose.subscribe((submit) => {
      if (submit) {
        this.updateAction = updateAction;
        this.action_return = {};
        this.update_description = submit;
        switch (continueFunction) {
          case 'updateCapture':
            this.updateCapture();
            break;
          case 'checkCapture':
            this.checkCapture();
            break;
          case 'saveCapture':
            this.saveCapture();
            break;
          default:
        }
      } else {
        this.loader = false;
      }
      this.actionModal = false;
    },
      ()=>{
      this.ngOnInit();
      });
  }

  onFileSelected(event) {
    const file:File = event.target.files[0];
    if (file) {
      this.file = file;
      this.fileName = file.name;
    }
  }

  reviewerAction(action = '') {
    this.loader = true;
    if (action === 'reject'){
      this.updateAction = "Reject capture";
      this.update_status = 2;
      this.saveCapture(action);
    } else {
      this.update_description = "Capture completed";
      this.update_status = 4;
      this.openActionModal('Approve capture', 'capture-completed', 'Capture completed', 'saveCapture');
    }
  }

  dateFormat(date) {
    return this.commonFunctionsService.dateFormat(date);
  }

  //checkEditable(month, year) {
    //const currentYear = new Date().getFullYear();
    //const currentMonth = new Date().getMonth();
    //return (currentMonth === parseInt(month) || month === undefined) && (currentYear === parseInt(year) || year === undefined);
  //}

  checkEditable(month, year) {
    let newYear = new Date().getFullYear();
    let newMonth = new Date().getMonth();;
    if (newMonth === 0) {
      newYear = newYear - 1;
      newMonth = 12;
    }
    return (newMonth === parseInt(month) || month === undefined) && (newYear === parseInt(year) || year === undefined);
  }

  pickupReviews() {
    this._api.getTypeRequest('auth/can-pickup-reviews').subscribe((res: any) => {
      this.canPickupReviews = res.message;
    });
  }

  riskClass(risk = '') {
    let riskClass = '';
    switch (risk) {
      case 'Low':
        riskClass = 'low-risk';
        break;
      case 'Medium':
        riskClass = 'medium-risk';
        break;
      case 'High':
        riskClass = 'high-risk';
        break;
      default:
        riskClass = '';
    }
    return riskClass;
  }

  updateRisk() {
    console.log('sr', this.selectedRisk, 'id', this.id);
    this._api.getTypeRequest('accounts/assign-risk?risk=' + this.selectedRisk + '&id=' + this.id).subscribe((res: any) => {
    });
  }

  switchAccountType() {
    this.accountService.switchAccountType(this.selectedAccountType, this.id).subscribe({
      next: async (next: any) => {
        await Swal.fire({
          title: next.message,
          text: '',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Okay',
        }).then((result) => {
          this.loader = false;
        });
      },
      error: (error=>{
        this.handleError(error);
      })
    });
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.log('client-side error ' + errorMessage);
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.log('server-side error ' + errorMessage);
    }
    console.log(errorMessage);
    return throwError(() => errorMessage);
  }

}
