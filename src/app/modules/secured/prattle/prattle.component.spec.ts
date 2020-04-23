import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrattleComponent } from './prattle.component';

describe('PrattleComponent', () => {
  let component: PrattleComponent;
  let fixture: ComponentFixture<PrattleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrattleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrattleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
