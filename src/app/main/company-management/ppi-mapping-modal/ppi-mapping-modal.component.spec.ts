import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpiMappingModalComponent } from './ppi-mapping-modal.component';

describe('PpiMappingModalComponent', () => {
  let component: PpiMappingModalComponent;
  let fixture: ComponentFixture<PpiMappingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpiMappingModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpiMappingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
