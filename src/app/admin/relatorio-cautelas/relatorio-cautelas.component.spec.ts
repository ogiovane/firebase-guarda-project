import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioCautelasComponent } from './relatorio-cautelas.component';

describe('RelatorioCautelasComponent', () => {
  let component: RelatorioCautelasComponent;
  let fixture: ComponentFixture<RelatorioCautelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioCautelasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RelatorioCautelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
