import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaixarMaterialComponent } from './baixar-material.component';

describe('BaixarMaterialComponent', () => {
  let component: BaixarMaterialComponent;
  let fixture: ComponentFixture<BaixarMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaixarMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BaixarMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
