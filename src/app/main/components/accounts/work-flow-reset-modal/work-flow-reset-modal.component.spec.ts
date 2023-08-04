import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowResetModalComponent } from './work-flow-reset-modal.component';

describe('WorkFlowResetModalComponent', () => {
  let component: WorkFlowResetModalComponent;
  let fixture: ComponentFixture<WorkFlowResetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowResetModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowResetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
