import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FogotPasswordCmsComponent } from './fogot-password-cms.component';

describe('FogotPasswordCmsComponent', () => {
  let component: FogotPasswordCmsComponent;
  let fixture: ComponentFixture<FogotPasswordCmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FogotPasswordCmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FogotPasswordCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
