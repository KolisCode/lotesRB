import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteCard } from './lote-card';

describe('LoteCard', () => {
  let component: LoteCard;
  let fixture: ComponentFixture<LoteCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteCard],
    }).compileComponents();

    fixture = TestBed.createComponent(LoteCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
