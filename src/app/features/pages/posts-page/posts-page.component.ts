import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PostsDataRequestService } from './services/posts-data-request.service';
import { PostsStoreService } from './services/posts-store.service';
import { UserListComponent } from './components/user-list/user-list.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostsFilterComponent } from './components/posts-filter/posts-filter.component';


@Component({
  selector: 'app-posts-page',
  imports: [UserListComponent, PostListComponent, PostsFilterComponent],
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PostsDataRequestService, PostsStoreService],
})
export class PostsPageComponent {
  private _postsDataRequestService = inject(PostsDataRequestService); 
  postsStoreService = inject(PostsStoreService);
  constructor() {
    this._postsDataRequestService.fetchUserWithPosts();
  }
}
