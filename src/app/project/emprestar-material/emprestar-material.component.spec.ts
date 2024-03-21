import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmprestarMaterialComponent } from './emprestar-material.component';

describe('EmprestarMaterialComponent', () => {
  let component: EmprestarMaterialComponent;
  let fixture: ComponentFixture<EmprestarMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmprestarMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmprestarMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
