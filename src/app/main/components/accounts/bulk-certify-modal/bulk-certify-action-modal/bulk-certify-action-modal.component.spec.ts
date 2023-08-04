import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCertifyActionModalComponent } from './bulk-certify-action-modal.component';

describe('BulkCertifyActionModalComponent', () => {
  let component: BulkCertifyActionModalComponent;
  let fixture: ComponentFixture<BulkCertifyActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkCertifyActionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkCertifyActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
