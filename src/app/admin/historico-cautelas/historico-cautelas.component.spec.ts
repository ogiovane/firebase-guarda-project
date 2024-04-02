import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoCautelasComponent } from './historico-cautelas.component';

describe('HistoricoCautelasComponent', () => {
  let component: HistoricoCautelasComponent;
  let fixture: ComponentFixture<HistoricoCautelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoCautelasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoricoCautelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
