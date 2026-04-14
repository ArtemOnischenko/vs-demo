import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { USER_WITH_POSTS } from '../mock-data/user-with-posts.mock';
import { PostsStoreService } from './posts-store.service';

@Injectable()
export class PostsDataRequestService {
  private _postsStoreService = inject(PostsStoreService);
  fetchUserWithPosts() {
    return of(USER_WITH_POSTS).subscribe((data) => {
      this._postsStoreService.updateUserWithPosts(data);
    });

  }
}
