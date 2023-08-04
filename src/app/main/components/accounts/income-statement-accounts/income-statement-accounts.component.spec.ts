import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeStatementAccountsComponent } from './income-statement-accounts.component';

describe('IncomeStatementAccountsComponent', () => {
  let component: IncomeStatementAccountsComponent;
  let fixture: ComponentFixture<IncomeStatementAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeStatementAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeStatementAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
