import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroMaterialComponent } from './cadastro-material.component';

describe('CadastroMaterialComponent', () => {
  let component: CadastroMaterialComponent;
  let fixture: ComponentFixture<CadastroMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
