import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FridgeSimulatorComponent } from './fridge-simulator.component';

describe('FridgeSimulatorComponent', () => {
  let component: FridgeSimulatorComponent;
  let fixture: ComponentFixture<FridgeSimulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FridgeSimulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FridgeSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
