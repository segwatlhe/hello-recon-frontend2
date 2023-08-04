import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountsModalComponent } from './user-accounts-modal.component';

describe('UserAccountsModalComponent', () => {
  let component: UserAccountsModalComponent;
  let fixture: ComponentFixture<UserAccountsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccountsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
