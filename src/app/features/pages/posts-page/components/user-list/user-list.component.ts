import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VirtualScrollListComponent } from '../../../../../shared/virtual-scroll-list/virtual-scroll-list.component';
import { PostsStoreService } from '../../services/posts-store.service';

@Component({
  selector: 'app-user-list',
  imports: [VirtualScrollListComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  postsStoreService = inject(PostsStoreService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  rowHeight = 50;

  toggleSelection(userId: number) {
    const queryUsersIds = this._route.snapshot.queryParamMap.get('users');
    const selectedUserIds = queryUsersIds
      ? queryUsersIds
          .split(',')
          .map((id) => +(id.trim()))
      : [];

    const selectedSet = new Set(selectedUserIds);

    if (selectedSet.has(userId)) {
      selectedSet.delete(userId);
    } else {
      selectedSet.add(userId);
    }

    this.postsStoreService.updateUserSelected(selectedSet);

    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        users: selectedSet.size ? [...selectedSet].join(',') : null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
