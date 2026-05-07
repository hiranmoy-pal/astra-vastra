import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlaceCheckout } from './order-place-checkout';

describe('OrderPlaceCheckout', () => {
  let component: OrderPlaceCheckout;
  let fixture: ComponentFixture<OrderPlaceCheckout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPlaceCheckout],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPlaceCheckout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
