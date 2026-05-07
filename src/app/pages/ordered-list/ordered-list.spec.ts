import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedList } from './ordered-list';

describe('OrderedList', () => {
  let component: OrderedList;
  let fixture: ComponentFixture<OrderedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderedList],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderedList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
