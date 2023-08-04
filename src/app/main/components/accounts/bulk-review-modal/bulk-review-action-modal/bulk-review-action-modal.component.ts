import {Component, OnInit} from '@angular/core';
import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import {ApiService} from "../../../../../services/api.service";
import Swal from "sweetalert2";
import {throwError} from "rxjs";

@Component({
  selector: 'app-bulk-review-action-modal',
  templateUrl: './bulk-review-action-modal.component.html',
  styleUrls: ['./bulk-review-action-modal.component.css']
})
export class BulkReviewActionModalComponent implements OnInit {

  constructor(public modalRef: MdbModalRef<BulkReviewActionModalComponent>, private _api: ApiService) {
  }

  public description: any;
  private action: any;
  public description_error: any;
  public loader;
  public bulkReviewPayload: any;
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

    this.bulkReviewPayload.bulkReviewAccounts.forEach((account) => {

      if (this.description != '' && account.certify == true) {

        const payload = {
          description: this.description,
          capture_id: account.capture_id,
          status: this.bulkReviewPayload.status,
          action: this.bulkReviewPayload.action
        };

        this._api.postFileUploadTypeRequest('captures/bulk-review', payload).subscribe({
          next: (res) => {
            console.log(res);
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
