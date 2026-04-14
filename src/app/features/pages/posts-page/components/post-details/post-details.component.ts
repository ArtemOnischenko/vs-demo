import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PostWithUser } from '../../models/user-with-posts.interface';

@Component({
  selector: 'app-post-details',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailsComponent {
   readonly post = inject<PostWithUser>(MAT_DIALOG_DATA);

}
