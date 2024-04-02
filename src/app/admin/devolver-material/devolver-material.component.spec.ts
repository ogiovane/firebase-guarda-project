import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolverMaterialComponent } from './devolver-material.component';

describe('DevolverMaterialComponent', () => {
  let component: DevolverMaterialComponent;
  let fixture: ComponentFixture<DevolverMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevolverMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevolverMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
