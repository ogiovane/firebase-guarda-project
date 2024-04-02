import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucaoMaterialComponent } from './devolucao-material.component';

describe('DevolucaoMaterialComponent', () => {
  let component: DevolucaoMaterialComponent;
  let fixture: ComponentFixture<DevolucaoMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevolucaoMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevolucaoMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
