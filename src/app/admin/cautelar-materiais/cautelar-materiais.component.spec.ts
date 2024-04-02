import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CautelarMateriaisComponent } from './cautelar-materiais.component';

describe('CautelarMateriaisComponent', () => {
  let component: CautelarMateriaisComponent;
  let fixture: ComponentFixture<CautelarMateriaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CautelarMateriaisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CautelarMateriaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
