import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkReviewActionModalComponent } from './bulk-review-action-modal.component';

describe('BulkReviewActionModalComponent', () => {
  let component: BulkReviewActionModalComponent;
  let fixture: ComponentFixture<BulkReviewActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkReviewActionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkReviewActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
