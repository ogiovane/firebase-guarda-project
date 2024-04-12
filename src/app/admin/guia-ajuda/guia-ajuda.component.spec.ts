import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaAjudaComponent } from './guia-ajuda.component';

describe('GuiaAjudaComponent', () => {
  let component: GuiaAjudaComponent;
  let fixture: ComponentFixture<GuiaAjudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuiaAjudaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuiaAjudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
