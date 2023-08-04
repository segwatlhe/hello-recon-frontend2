import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkReviewModalComponent } from './bulk-review-modal.component';

describe('BulkReviewModalComponent', () => {
  let component: BulkReviewModalComponent;
  let fixture: ComponentFixture<BulkReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkReviewModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
