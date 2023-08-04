import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowResetActionModalComponent } from './work-flow-reset-action-modal.component';

describe('WorkFlowResetActionModalComponent', () => {
  let component: WorkFlowResetActionModalComponent;
  let fixture: ComponentFixture<WorkFlowResetActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowResetActionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowResetActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
