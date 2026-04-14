import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsFilterComponent } from './posts-filter.component';

describe('PostsFilterComponent', () => {
  let component: PostsFilterComponent;
  let fixture: ComponentFixture<PostsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsFilterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
