import { TestBed } from '@angular/core/testing';

import { PostsDataRequestService } from './posts-data-request.service';

describe('PostsDataRequestService', () => {
  let service: PostsDataRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostsDataRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
