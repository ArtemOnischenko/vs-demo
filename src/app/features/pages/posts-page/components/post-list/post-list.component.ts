import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { PostWithUser } from '../../models/user-with-posts.interface';
import { VirtualScrollListComponent } from '../../../../../shared/virtual-scroll-list/virtual-scroll-list.component';
import { PostsStoreService } from '../../services/posts-store.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-post-list',
  imports: [VirtualScrollListComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent {
  private _dialog = inject(MatDialog);
  postsStoreService = inject(PostsStoreService);
  rowHeight = 100;

  async openDetails(post: PostWithUser) {
    const { PostDetailsComponent } = await import('../post-details/post-details.component');
    this._dialog.open(PostDetailsComponent, {
      data: post
    });
  }
}
