import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDetailProductComponent } from './manage-detail-product.component';

describe('ManageDetailProductComponent', () => {
  let component: ManageDetailProductComponent;
  let fixture: ComponentFixture<ManageDetailProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDetailProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDetailProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
