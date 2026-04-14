import { computed, inject, Injectable, signal } from '@angular/core';
import { PostWithUser, User, UserWithPosts } from '../models/user-with-posts.interface';
import { PostsFilter } from '../models/posts-filter.interface';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class PostsStoreService {
private _route = inject(ActivatedRoute);

  private queryParams = this._route.snapshot.queryParams;
  private _userWithPosts = signal<UserWithPosts[]>([]);
  private _filter = signal<PostsFilter>(this.getDefaultFilter());
  private _userSelected = signal<Set<number>>(this.getDefaultUserSelected());

  readonly userSelected = this._userSelected.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly totalPosts = computed(() => this._userWithPosts().reduce((total, user) => total + user.posts.length, 0));

  readonly userList = computed<User[]>(() => {
    return this._userWithPosts().map(user => ({ id: user.id, name: user.name }));
  });

  // TODO: to big need to do something with
  readonly postList = computed<PostWithUser[]>(() => {
    const selectedUserIds = this._userSelected();
    const filter: PostsFilter = this._filter();
    let posts = this._userWithPosts().flatMap(user => {
      return user.posts.map(post => ({ ...post, userId: user.id, userName: user.name }));
    });

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      posts = posts.filter(post => post.title.toLowerCase().includes(searchLower) || post.postBody.toLowerCase().includes(searchLower));
    }
    if(selectedUserIds.size) {
      posts = posts.filter(post => selectedUserIds.has(post.userId));
    }
    posts = posts.sort((a, b) => {
      const fieldA = typeof a[filter.sortBy] === 'string' ? a[filter.sortBy].toLowerCase() : a[filter.sortBy];
      const fieldB = typeof b[filter.sortBy] === 'string' ? b[filter.sortBy].toLowerCase() : b[filter.sortBy];
      if (fieldA < fieldB) return filter.sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return filter.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return posts;
  });

  getDefaultFilter(): PostsFilter {
    return {
      search: this.queryParams['search'] ?? '',
      sortBy: this.queryParams['sortBy'] ?? 'title',
      sortDirection: this.queryParams['sortDirection'] ?? 'asc',
    };
  }

  getDefaultUserSelected(): Set<number> {
    const queryUsersIds = this.queryParams['users'];
    const selectedUserIds: number[] = queryUsersIds
      ? queryUsersIds
          .split(',')
          .map((id: string) => +(id.trim()))
      : [];
    return new Set(selectedUserIds);
  }

  updateUserWithPosts(data: UserWithPosts[]) {
    this._userWithPosts.set(data);
  }

  updateFilter(filter: PostsFilter) {
     this._filter.set(filter);
  }

  updateUserSelected(userIds: Set<number>) {
    this._userSelected.set(new Set(userIds));
  }
}

