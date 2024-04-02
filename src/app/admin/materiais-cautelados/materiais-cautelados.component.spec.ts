import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaisCauteladosComponent } from './materiais-cautelados.component';

describe('MateriaisCauteladosComponent', () => {
  let component: MateriaisCauteladosComponent;
  let fixture: ComponentFixture<MateriaisCauteladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriaisCauteladosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MateriaisCauteladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
