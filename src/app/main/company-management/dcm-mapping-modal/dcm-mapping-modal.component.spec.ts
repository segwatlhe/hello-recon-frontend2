import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmMappingModalComponent } from './dcm-mapping-modal.component';

describe('DcmMappingModalComponent', () => {
  let component: DcmMappingModalComponent;
  let fixture: ComponentFixture<DcmMappingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcmMappingModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DcmMappingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
