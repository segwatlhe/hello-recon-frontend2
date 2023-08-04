import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAccountsMappingModalComponent } from './loan-accounts-mapping-modal.component';

describe('LoanAccountsMappingModalComponent', () => {
  let component: LoanAccountsMappingModalComponent;
  let fixture: ComponentFixture<LoanAccountsMappingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanAccountsMappingModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanAccountsMappingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
