import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { debounceTime, merge, map, distinctUntilChanged } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PostsStoreService } from '../../services/posts-store.service';
import { PostsFilter } from '../../models/posts-filter.interface';

@Component({
  selector: 'app-posts-filter',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './posts-filter.component.html',
  styleUrl: './posts-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsFilterComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _postsStoreService = inject(PostsStoreService);

  public form = this._formBuilder.group({
    search: this._postsStoreService.filter().search,
    sortBy: this._postsStoreService.filter().sortBy,
    sortDirection: this._postsStoreService.filter().sortDirection,
  });

  constructor() {
    // effect(() => {
    //   const filter = this._postsStoreService.filter();
    //   this.form.patchValue(
    //     {
    //       search: filter.search,
    //       sortBy: filter.sortBy,
    //       sortDirection: filter.sortDirection,
    //     },
    //     { emitEvent: false },
    //   );
    // });
  }

  ngOnInit(): void {

    const search$ = this.form.controls.search.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((search) => ({ ...this.form.value, search })),
    );

    const sort$ = merge(
      this.form.controls.sortBy.valueChanges.pipe(
        map((sortBy) => ({ ...this.form.value, sortBy })),
      ),
      this.form.controls.sortDirection.valueChanges.pipe(
        map((sortDirection) => ({ ...this.form.value, sortDirection })),
      ),
    );

    merge(search$, sort$).subscribe((value) => {
      this._router.navigate([], {
        queryParams: value,
        queryParamsHandling: 'merge',
      });
      this._postsStoreService.updateFilter(
        {
          search: value.search ?? '',
          sortBy: value.sortBy ?? 'title',
          sortDirection: value.sortDirection ?? 'asc',
        }
      );
    });
  }

}
