import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceberMaterialComponent } from './receber-material.component';

describe('ReceberMaterialComponent', () => {
  let component: ReceberMaterialComponent;
  let fixture: ComponentFixture<ReceberMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceberMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceberMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
