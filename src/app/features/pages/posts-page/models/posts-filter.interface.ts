export interface PostsFilter {
  search: string;
  sortBy: 'title' | 'userName';
  sortDirection: 'asc' | 'desc';
}