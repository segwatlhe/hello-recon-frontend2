import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureModalComponent } from './capture-modal.component';

describe('CaptureModalComponent', () => {
  let component: CaptureModalComponent;
  let fixture: ComponentFixture<CaptureModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
