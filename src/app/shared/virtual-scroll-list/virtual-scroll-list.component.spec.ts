import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualScrollListComponent } from './virtual-scroll-list.component';

describe('VirtualScrollListComponent', () => {
  let component: VirtualScrollListComponent;
  let fixture: ComponentFixture<VirtualScrollListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualScrollListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VirtualScrollListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
