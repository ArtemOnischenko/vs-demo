import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  QueryList,
  signal,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-virtual-scroll-list',
  imports: [NgTemplateOutlet],
  templateUrl: './virtual-scroll-list.component.html',
  styleUrl: './virtual-scroll-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onResize()',
  },
})
export class VirtualScrollListComponent {
  @ViewChild('container', { read: ElementRef }) containerRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('listItem', { read: ElementRef }) itemRefs!: QueryList<ElementRef<HTMLElement>>;

  listTemplate = input.required<TemplateRef<any>>();
  headerTemplate = input.required<TemplateRef<any>>();
  list = input.required<any[]>();
  itemSize = input<number>(50);

  containerHeight = 0;
  startIndex = 0;
  buffer = 100;

  private ticking = false;

  activeIndex = signal(0);
  visibleItems = signal<any[]>([]);

  constructor() {
    effect(() => {
      const list = this.list();

      if (!list.length) {
        this.activeIndex.set(0);
      } else if (this.activeIndex() > list.length - 1) {
        this.activeIndex.set(list.length - 1);
      }

      if (this.containerRef) {
        this.updateVisibleItems(this.getScrollTop());
      }
    });
  }

  onResize() {
    this.updateConteinerHeight();
    this.updateVisibleItems(this.getScrollTop());
  }

  ngAfterViewInit(): void {
    this.updateConteinerHeight();
    this.updateVisibleItems(0);
  }

  getScrollTop(): number {
    return this.containerRef.nativeElement.scrollTop;
  }

  updateConteinerHeight() {
    this.containerHeight = this.containerRef.nativeElement.clientHeight;
  }

  onScroll() {
    const scrollTop = this.getScrollTop();

    if (!this.ticking) {
      this.ticking = true;

      requestAnimationFrame(() => {
        this.updateVisibleItems(scrollTop);
        this.ticking = false;
      });
    }
  }

  updateVisibleItems(scrollTop: number) {
    const itemsPerView = Math.ceil(this.containerHeight / this.itemSize());
    const rawStart = Math.floor(scrollTop / this.itemSize());
    const newStart = Math.max(0, rawStart - this.buffer);

    const newEnd = Math.min(
      this.list().length,
      rawStart + itemsPerView + this.buffer
    );

    this.startIndex = newStart;

    this.visibleItems.set(this.list().slice(newStart, newEnd));
  }

  onContainerFocus() {
    if (!this.list().length) {
      return;
    }

    this.focusActiveItem();
  }

  onItemFocus(index: number) {
    this.activeIndex.set(index);
  }

  onItemClick(index: number) {
    this.activeIndex.set(index);
  }

  onKeydown(event: KeyboardEvent) {
    if (!this.list().length) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveActiveBy(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveActiveBy(-1);
        break;
      case 'Enter': // ensure Enter event goes to the item click handler
      case ' ':
        event.preventDefault();
        this.activateCurrentItem();
        break;
    }
  }

  private moveActiveBy(delta: number) {
    this.setActiveIndex(this.activeIndex() + delta);
  }

  private setActiveIndex(index: number) {
    const max = this.list().length - 1;
    const clampedIndex = Math.min(Math.max(index, 0), max);

    this.activeIndex.set(clampedIndex);
    this.ensureActiveItemVisible();
    this.focusActiveItem();
  }

  private ensureActiveItemVisible() {
    const top = this.activeIndex() * this.itemSize();
    const bottom = top + this.itemSize();
    const container = this.containerRef.nativeElement;
    const currentScrollTop = container.scrollTop;
    const viewportBottom = currentScrollTop + this.containerHeight;

    if (top < currentScrollTop) {
      container.scrollTop = top;
      this.updateVisibleItems(top);
      return;
    }

    if (bottom > viewportBottom) {
      const nextScrollTop = bottom - this.containerHeight;
      container.scrollTop = nextScrollTop;
      this.updateVisibleItems(nextScrollTop);
    }
  }

  private focusActiveItem() {
    queueMicrotask(() => {
      const localIndex = this.activeIndex() - this.startIndex;
      const itemRef = this.itemRefs?.get(localIndex);

      if (itemRef) {
        itemRef.nativeElement.focus();
      }
    });
  }

  private activateCurrentItem() {
    const localIndex = this.activeIndex() - this.startIndex;
    const wrapper = this.itemRefs?.get(localIndex)?.nativeElement;

    if (!wrapper) {
      return;
    }

    const clickableTarget = wrapper.firstElementChild as HTMLElement | null;
    if (clickableTarget) {
      clickableTarget.click();
    }
  }

  get totalHeight() {
    return this.list().length * this.itemSize();
  }

  get offsetY() {
    return this.startIndex * this.itemSize();
  }
}
