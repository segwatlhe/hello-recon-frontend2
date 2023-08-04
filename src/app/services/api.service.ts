import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = '';
  private options: {} = {};
  constructor(private _http: HttpClient) {}
  getTypeRequest(url, base='', type = '') {
    this.baseUrl = environment.apiURL;
    if (base !== '') {
      this.populateDetails(base, type);
    }
    return this._http.get(`${this.baseUrl}${url}`, this.options).pipe(
      catchError(this.handleError));
  }
  postTypeRequest(url, payload, base='', contentType='') {
    this.baseUrl = environment.apiURL;
    if (base !== '') {
      this.populateDetails(base, contentType);
    }
    return this._http.post(`${this.baseUrl}${url}`, payload, this.options).pipe(
      catchError(this.handleError));
  }
  postFileUploadTypeRequest(url, formData) {
    return this._http.post(`${this.baseUrl}${url}`, formData, this.options).pipe(
      catchError(this.handleError));
  }
  populateDetails(base, contentType='') {
    if (base === 'S3') {
      this.baseUrl = environment.s3URL;
      this.options = {
        headers: {
          'X-JWT-Assertion': environment.s3_X_JWT_Assertion,
          'Authorization': environment.s3_bearer,
        },

      };
    } else {
      this.baseUrl = environment.apiURL;
    }
    if (contentType === 'upload') {
      this.options = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    } else {
      this.options['responseType'] = 'blob';
    }
  }
  handleError(error: HttpErrorResponse) {
    let errorMessage;
    let errorMessageArr : string[] = [];
    if (error.error && typeof error.error.message !== 'string') {
      const errorObj = error.error.message;
      for (const key of Object.keys(errorObj)) {
        errorMessageArr.push(errorObj[key]);
        errorMessage = errorMessageArr.join("<br/>");
      }
    } else {
      errorMessage = error.error.message;
    }
    Swal.fire('Error: ' + error.status, errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }

}
