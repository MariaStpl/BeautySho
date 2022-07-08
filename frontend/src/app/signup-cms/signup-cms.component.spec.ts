import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupCmsComponent } from './signup-cms.component';

describe('SignupCmsComponent', () => {
  let component: SignupCmsComponent;
  let fixture: ComponentFixture<SignupCmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupCmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
