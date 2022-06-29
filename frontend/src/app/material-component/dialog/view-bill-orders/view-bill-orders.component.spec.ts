import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBillOrdersComponent } from './view-bill-orders.component';

describe('ViewBillOrdersComponent', () => {
  let component: ViewBillOrdersComponent;
  let fixture: ComponentFixture<ViewBillOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBillOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBillOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
