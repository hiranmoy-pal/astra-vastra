import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutReview } from './produt-review';

describe('ProdutReview', () => {
  let component: ProdutReview;
  let fixture: ComponentFixture<ProdutReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutReview],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
