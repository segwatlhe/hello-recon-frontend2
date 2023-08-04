import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from "mdb-angular-ui-kit/modal";

@Component({
  selector: 'app-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.css']
})
export class ActionModalComponent implements OnInit {
  public action_data: any;
  public role: any;
  public current_status: any;
  public new_status: any;
  public description: any;
  public heading: any;
  public action: any;
  public description_error: any;

  constructor(
    public modalRef: MdbModalRef<ActionModalComponent>
  ) {}

  ngOnInit(): void {
    this.role = this.action_data.role;
    this.current_status = this.action_data.current_status;
    this.new_status = this.action_data.new_status;
    this.heading = this.action_data.heading;
    this.action = this.action_data.action;
    this.description = '';
    this.description_error = '';
  }

  keyDown() {
    this.description_error = '';
  }

  saveAndClose(){
    if (this.description && this.description !== '') {
      this.modalRef.close(this.description)
    } else {
      this.description_error = 'Description is required';
    }
  }

}
