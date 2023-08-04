import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSheetAccountsComponent } from './balance-sheet-accounts.component';

describe('BalanceSheetAccountsComponent', () => {
  let component: BalanceSheetAccountsComponent;
  let fixture: ComponentFixture<BalanceSheetAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceSheetAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceSheetAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
