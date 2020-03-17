import {
  Component, Renderer2, ElementRef,
  Directive, EventEmitter, Input, Output, QueryList, ViewChildren, HostBinding, HostListener
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';



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


@Component({
    selector: 'app-user-list-table',
    templateUrl: './user-list-table.component.html',
    styleUrls: ['./user-list-table.component.css']
})
/** user-list-table component*/
export class UserListTableComponent {
  users: Array<User> = new Array<User>();
  usersOriginal: Array<User> = new Array<User>();
  sortPriority: number = 0;

  activePage: number;
  pageSize: number;
  collectionSize: number;
  requestPage: number;
  pageCount: number;
  pageBlockSize = 3;
  pageBlockIndex: number;
  upperPageBlockIndex: number;
  upperVisiblePageIndex: number;
  lowerVisiblePageIndex: number;

  pager: Array<number> = new Array<number>();
  visiblePages: Array<number> = new Array<number>();
  pageSizeOptions = [3, 6, 9];
  private dataLoading = new Subject<any>();

  constructor(private http: HttpClient) {
    this.pageSize = this.pageSizeOptions[0]; this.requestPage = 1;
    this.getData(this.pageSize, this.requestPage);
  }
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({ column, direction, hostObject }: SortEvent) {
    this.sortPriority += 1;
    hostObject.priority = this.sortPriority;
    this.users = [...this.users].sort((a, b) => {
      var res: number = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }

  initialSort() {
    let x = [...this.headers].sort((a, b) => {
      return compare(a['priority'], b['priority'])
    })

    x.forEach(header => {
      if (header.priority > 0) {
        console.log(header.direction + ':' + header.priority);
        this.users = [...this.users].sort((a, b) => {
          var res: number = compare(a[header.sortable], b[header.sortable]);
          return header.direction === 'asc' ? res : -res;
        })
      };
    });
  }
  clearSort() {
    this.headers.forEach(header => {
      header.direction = '';
      header.priority = 0;
    });
    this.users = this.usersOriginal;
    this.sortPriority = 0;
  }

  buildPager(collectionSize: number, pageSize: number) {
    while (this.pager.length > 0) {
      this.pager.pop();
    }

    while (this.visiblePages.length > 0) {
      this.visiblePages.pop();
    }
    let x: number = Math.ceil(collectionSize / pageSize);
    if (x > 1)
      for (var i = 1; i < x + 1; i += 1) {
        this.pager.push(i);
      }

 

    this.pageCount = x;
    this.pageBlockIndex = Math.ceil(this.activePage / this.pageBlockSize);
    this.upperPageBlockIndex = Math.ceil(this.pageCount / this.pageBlockSize);
    this.upperVisiblePageIndex = (this.pageBlockIndex * this.pageBlockSize < this.pageCount) ?
      (this.pageBlockIndex * this.pageBlockSize) : this.pageCount;
    this.lowerVisiblePageIndex = this.pageBlockIndex * this.pageBlockSize > 4 ?
      ((this.pageBlockIndex - 1) * this.pageBlockSize + 1) : 1;

    for (var i = this.lowerVisiblePageIndex; i < this.upperVisiblePageIndex + 1; i += 1) {
      this.visiblePages.push(i);
    }
  }
  getData(pageSize: number, requestPage: number){
    this.http.get('/User/ListAllUser',
      {
        params: {
          pageSize: pageSize.toString(),
          requestPage: requestPage.toString()
        }
      }).subscribe(
        response => {
          let result = JSON.parse(JSON.stringify(response));
          let array = result['users'] as Array<any>

          this.collectionSize = result['collectionSize'];
          this.activePage = result['activePage'];
          this.pageSize = result['pageSize'];
          this.buildPager(this.collectionSize, this.pageSize);
          while (this.usersOriginal.length > 0) {
            this.usersOriginal.pop();
          }
          for (var i = 0; i < array.length; i += 1) {
            let user: User = {
              userName: array[i]['userName'],
              userFullName: array[i]['userFullName'],
              userDeptCode: array[i]['userDeptCode'],
              userTitleCode: array[i]['userTitleCode'],
              userEmail: array[i]['userEmail'],
              userEnabled: array[i]['userEnabled'],
              userFailedLoginCount: array[i]['userFailedLoginCount']
            }
            this.usersOriginal.push(user);
          }
          this.users = this.usersOriginal;
          
        },
        error => {

        },
        () => {
          this.dataLoading.next();
        }
    )
 
  }

  refresh() {
    let x: Subscription = this.dataLoading.asObservable().subscribe(() => {
      this.initialSort();
      x.unsubscribe();
    })
    this.getData(this.pageSize, this.requestPage);
  }

  loadPage(page: number) {
    let x: Subscription = this.dataLoading.asObservable().subscribe(() => {
      this.initialSort();
      x.unsubscribe();
    })
    this.requestPage = page;
    this.getData(this.pageSize, this.requestPage);
  }

  changePageSize(newPageSize: number) {
    if (this.pageSize == newPageSize) return;
    let x: Subscription = this.dataLoading.asObservable().subscribe(() => {
      this.initialSort();
      x.unsubscribe();
    })
    this.pageSize = newPageSize;
    this.requestPage = 1;
    this.getData(this.pageSize, this.requestPage);
  }
}

export interface User {
  userName: string
  userFullName: string
  userDeptCode: string
  userTitleCode: string
  userEmail: string
  userEnabled: boolean
  userFailedLoginCount: number
}

export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': 'asc', '': 'asc' };
export function compare(v1: any, v2: any): number {
  return v1 < v2 ? -1 : (v1 > v2 ? 1 : 0)
};
export interface SortEvent {
  column: string;
  direction: SortDirection;
  hostObject: NgbdSortableHeader;
}


