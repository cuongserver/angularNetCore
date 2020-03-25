import {
  Directive, EventEmitter, Input, Output, HostBinding, HostListener, NgModule
} from '@angular/core';

@Directive({
  selector: 'th[sortable]'
})
export class NgbdSortableHeader {
  @Input() sortable: string;
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  @HostBinding('attr.priority') public priority: number = 0;
  @HostBinding('class.asc') get aSortActive() { return this.direction === 'asc'; }
  @HostBinding('class.desc') get dSortActive() { return this.direction === 'desc'; }
  @HostListener('click')
  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction, hostObject: this });
  }
}

export type SortDirection = 'asc' | 'desc' | '';
export const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': 'asc', '': 'asc' };
export function compare(v1: any, v2: any): number {
  return v1 < v2 ? -1 : (v1 > v2 ? 1 : 0)
};
export interface SortEvent {
  column: string;
  direction: SortDirection;
  hostObject: NgbdSortableHeader;
}

export interface FilterCondition {
  phraseOperator: string;
  field: string;
  comparisonType: string;
  filterValue: string;
  booleanField: boolean;
}

@NgModule({
  declarations: [
    NgbdSortableHeader
  ],
  exports: [
    NgbdSortableHeader
  ]
})
export class SortableHeaderModule {
}

