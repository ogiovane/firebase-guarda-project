import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroMilitaresComponent } from './cadastro-militares.component';

describe('CadastroMilitaresComponent', () => {
  let component: CadastroMilitaresComponent;
  let fixture: ComponentFixture<CadastroMilitaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroMilitaresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroMilitaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
