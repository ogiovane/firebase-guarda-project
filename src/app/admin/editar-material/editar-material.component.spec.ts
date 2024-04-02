import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMaterialComponent } from './editar-material.component';

describe('EditarMaterialComponent', () => {
  let component: EditarMaterialComponent;
  let fixture: ComponentFixture<EditarMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
