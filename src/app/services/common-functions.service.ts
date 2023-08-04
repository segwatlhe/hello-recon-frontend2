import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionsService {

  constructor() { }
  dateFormat(date) {
    const preFormattedDate = date.replace('T',' ');
    const formattedDate = preFormattedDate.replace('.000Z','');
    return formattedDate;
  }
}
