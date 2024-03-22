import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CautelarMaterialComponent } from './cautelar-material.component';

describe('CautelarMaterialComponent', () => {
  let component: CautelarMaterialComponent;
  let fixture: ComponentFixture<CautelarMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CautelarMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CautelarMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
