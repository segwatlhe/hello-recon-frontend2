import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCertifyModalComponent } from './bulk-certify-modal.component';

describe('BulkCertifyModalComponent', () => {
  let component: BulkCertifyModalComponent;
  let fixture: ComponentFixture<BulkCertifyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkCertifyModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkCertifyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
