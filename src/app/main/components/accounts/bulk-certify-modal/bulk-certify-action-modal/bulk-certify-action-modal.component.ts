import {Component, OnInit} from '@angular/core';
import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import Swal from "sweetalert2";
import {ApiService} from "../../../../../services/api.service";
import {throwError} from "rxjs";

@Component({
  selector: 'app-bulk-certify-action-modal',
  templateUrl: './bulk-certify-action-modal.component.html',
  styleUrls: ['./bulk-certify-action-modal.component.css']
})
export class BulkCertifyActionModalComponent implements OnInit {

  constructor(public modalRef: MdbModalRef<BulkCertifyActionModalComponent>, private _api: ApiService) {
  }

  public description: any;
  public description_error: any;
  public loader;
  public bulkCertifyPayload: any;
  btnstate: boolean = false;

  ngOnInit(): void {
    this.description = '';
    this.description_error = '';
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

        this._api.postFileUploadTypeRequest('captures/bulk-certify', formData).subscribe({
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

  // error handling
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
