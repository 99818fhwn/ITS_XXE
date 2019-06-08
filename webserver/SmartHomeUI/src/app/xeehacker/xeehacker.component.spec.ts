import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XEEHackerComponent } from './xeehacker.component';

describe('XEEHackerComponent', () => {
  let component: XEEHackerComponent;
  let fixture: ComponentFixture<XEEHackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XEEHackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XEEHackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
