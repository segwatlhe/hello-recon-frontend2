import { Component, OnInit } from '@angular/core';
import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import {ApiService} from "../../../../../services/api.service";
import Swal from "sweetalert2";
import {throwError} from "rxjs";

@Component({
  selector: 'app-work-flow-reset-action-modal',
  templateUrl: './work-flow-reset-action-modal.component.html',
  styleUrls: ['./work-flow-reset-action-modal.component.css']
})
export class WorkFlowResetActionModalComponent implements OnInit {

  constructor(public modalRef: MdbModalRef<WorkFlowResetActionModalComponent>, private _api: ApiService) {
  }

  public description: any;
  public description_error: any;
  public loader;
  public bulkCertifyPayload: any;
  btnstate: boolean = false;


  ngOnInit(): void {
  }

  keyDown() {
    this.description_error = '';
  }

  submit() {
    this.loader = true;
    this.bulkCertifyPayload.bulkAccounts.forEach((account) => {

      const formData = new FormData();

      if (this.description != '' && account.certify == true) {

        formData.append("description", this.description);
        formData.append("capture_id", account.capture_id);
        formData.append("status", this.bulkCertifyPayload.status);
        formData.append("action", this.bulkCertifyPayload.action);
        formData.append("file", this.bulkCertifyPayload.file);
        formData.append("certify", account.certify);

        this._api.postFileUploadTypeRequest('captures/work-flow-reset', formData).subscribe({
          next: (res) => {
            console.log('ress', res);
            if (res['message'] === 'Update successful') {
              Swal.fire({
                title: 'Update successful',
                text: '',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Okay',
              }).then((result) => {
                this.loader = false;
                this.modalRef.close();
              });
            } else {
              // @ts-ignore
              Swal.fire({
                title: 'File upload failed',
                text: '',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'Okay',
              }).then((result) => {
                this.loader = false;
                this.modalRef.close();
              });
              return;
            }
          },
          error: (error) => {
            this.loader = false;
            this.handleError(error);
          },
          complete: () => {
            this.ngOnInit();
          }
        });
      } else {
        this.description_error = 'Description is required';
      }
    });
  }

  saveAndClose() {
    this.btnstate = true;
    this.submit();
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
