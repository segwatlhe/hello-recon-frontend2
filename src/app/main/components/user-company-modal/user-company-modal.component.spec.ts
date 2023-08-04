import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCompanyModalComponent } from './user-company-modal.component';

describe('UserCompanyModalComponent', () => {
  let component: UserCompanyModalComponent;
  let fixture: ComponentFixture<UserCompanyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCompanyModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCompanyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
