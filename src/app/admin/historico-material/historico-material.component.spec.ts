import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoMaterialComponent } from './historico-material.component';

describe('HistoricoMaterialComponent', () => {
  let component: HistoricoMaterialComponent;
  let fixture: ComponentFixture<HistoricoMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoricoMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
