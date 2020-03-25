import * as res from '@app/module/system-setting/module-resource';
import {
  Component, Renderer2, ElementRef,
  Directive, EventEmitter, Input, Output, QueryList, ViewChildren, HostBinding, HostListener, OnInit, AfterViewInit, ViewChild, OnDestroy
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { JsonToCsvService } from '@app/_common/json-to-csv/json-to-csv.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { DialogService, DialogController, MessageBoxButton, MessageBoxStyle } from '@app/_common/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@app/_common/loader/loader.service';
import { NgbdSortableHeader, rotate, compare, SortDirection, SortEvent } from '@app/module/shared-module/sortable-header.module'
import { LeaveLimitService } from '@app/module/leave-management/leave-limit.service';

@Component({
  selector: 'app-leave-limit-summary',
  templateUrl: './leave-limit-summary.component.html',
  styleUrls: ['./leave-limit-summary.component.css'],
  animations: res.fadeAnimation
})
/** LeaveLimitSummary component*/
export class LeaveLimitSummaryComponent implements OnDestroy{
  private transitionState: string = 'in';
  private leavecodes: string[];
  private summary: Array<LeaveBalance> = new Array<LeaveBalance>();
  private summaryOriginal: Array<LeaveBalance> = new Array<LeaveBalance>();

  sortPriority: number = 0;

  activePage: number;
  pageSize: number;
  collectionSize: number;
  requestPage: number;
  navigateToPage: number;
  pageCount: number;
  pageBlockSize = 3;
  pageBlockIndex: number;
  upperPageBlockIndex: number;
  upperVisiblePageIndex: number;
  lowerVisiblePageIndex: number;
  upperItem: number;
  lowerItem: number;

  pager: Array<number> = new Array<number>();
  visiblePages: Array<number> = new Array<number>();
  pageSizeOptions = [3, 6, 9];
  filters: Array<Filter> = new Array<Filter>();
  editMode: boolean;
  private dataLoading = new Subject<any>();
  private subscription1: Subscription; private subscription2: Subscription;
  private subscription3: Subscription; private subscription4: Subscription;

  constructor(private http: HttpClient, private infoservice: LeaveLimitService) {
    this.pageSize = this.pageSizeOptions[0]; this.requestPage = 1;
    this.navigateToPage = 1;
    this.getData(this.pageSize, this.requestPage);
  }
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  ngOnDestroy() {
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
    if (this.subscription3) this.subscription3.unsubscribe();
    if (this.subscription4) this.subscription4.unsubscribe();
  }

  private onSort({ column, direction, hostObject }: SortEvent): void {
    this.sortPriority += 1;
    hostObject.priority = this.sortPriority;
    this.summary = [...this.summary].sort((a, b) => {
      var res: number = compare(a['user'][column], b['user'][column]);
      return direction === 'asc' ? res : -res;
    });
  }

  private initialSort(): void {
    let x = [...this.headers].sort((a, b) => {
      return compare(a['priority'], b['priority'])
    })

    x.forEach(header => {
      if (header.priority > 0) {
        this.summary = [...this.summary].sort((a, b) => {
          var res: number = compare(a['user'][header.sortable], b['user'][header.sortable]);
          return header.direction === 'asc' ? res : -res;
        })
      };
    });
  }

  private clearSort(): void {
    this.headers.forEach(header => {
      header.direction = '';
      header.priority = 0;
    });
    this.summary = this.summaryOriginal;
    this.sortPriority = 0;
  }

  private loadPage(page: number): void {
    let x: Subscription = this.dataLoading.asObservable().subscribe(() => {
      this.initialSort();
      x.unsubscribe();
    })
    this.requestPage = page;
    this.getData(this.pageSize, this.requestPage);
  }
  private buildPager(collectionSize: number, pageSize: number): void {
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
    this.lowerItem = (this.activePage - 1) * pageSize + 1
    this.upperItem = Math.min(this.activePage * pageSize, this.collectionSize);
  }
  private getData(pageSize: number, requestPage: number): void{
    var z = this.filters.length;
    if (z > 0) {
      for (var y = z - 1; y > -1; y -= 1) {
        if (this.filters[y].field == null || this.filters[y].field == '') {
          this.filters.splice(y, 1);
        }
      }
    }
    let x = {
      pageSize: pageSize as number,
      requestPage: requestPage as number,
      filters: this.filters
    }

    let data = JSON.stringify(x);
    this.http.post('/LeaveManagement/LeaveLimitSummary', data, res.moduleHttpOptions).subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
        this.collectionSize = result['collectionSize'];
        this.activePage = result['activePage'];
        this.navigateToPage = this.activePage;
        this.pageSize = result['pageSize'];
        this.buildPager(this.collectionSize, this.pageSize);

        while (this.summaryOriginal.length > 0) {
          this.summaryOriginal.pop();
        }

        this.leavecodes = result["leaveCodes"] as string[];
        let array1 = result["summary"] as Array<any>;
        array1.forEach(x => {
          let user: User =  {
            userName: x['user']['userName'],
            userFullName: x['user']['userFullName'],
            userDeptCode: x['user']['userDeptCode'],
            userTitleCode: x['user']['userTitleCode']
          }
          let types: Array<LeaveType> = new Array<LeaveType>();
          let array2 = x["leaveTypes"] as Array<any>;
          array2.forEach(y => {
            let leaveType: LeaveType = {
              leaveCode: y['leaveCode'],
              limit: y['limit']!= null ? y['limit'].toString() : '',
              balance: ''
            }
            types.push(leaveType);
          })
          let detail: LeaveBalance = {
            user: user,
            leaveTypes: types
          }
          this.summaryOriginal.push(detail);
        });
        this.summary = this.summaryOriginal;
      },
      error => {

      },
      () => {
        this.dataLoading.next();
      }
    )
  }

  private refresh(): void {
    let x: Subscription = this.dataLoading.asObservable().subscribe(() => {
      this.initialSort();
      x.unsubscribe();
    })
    this.getData(this.pageSize, this.requestPage);
  }

  private navigate(quickNavigateToPage: any): void {
    if (!Number.isInteger(+quickNavigateToPage)) {
      this.navigateToPage = 1;
      return;
    }
    else {
      if (quickNavigateToPage === 0) {
        this.navigateToPage = 1;
        return;
      }
    }
    this.loadPage(+quickNavigateToPage);
  }

  private changePageSize(newPageSize: number): void {
    if (this.pageSize == newPageSize) return;
    let x: Subscription = this.dataLoading.asObservable().subscribe(() => {
      this.initialSort();
      x.unsubscribe();
    })
    this.pageSize = newPageSize;
    this.requestPage = 1;
    this.getData(this.pageSize, this.requestPage);
  }

  addCondition() {
    let condition = {} as Filter
    condition.booleanField = false;
    condition.numericField = false;
    condition.dateField = false;
    condition.phraseOperator = 'and';
    condition.comparisonType = 'contain';
    this.filters.push(condition);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  removeCondition(index: number) {
    var x = this.filters.length;
    this.filters.splice(index, 1);
    if (x > 1) {
      this.filters[0].phraseOperator = 'and'
    };
  }
  checkBooleanField(index: number) {
    let x: Filter = this.filters[index]
    if (["userEnabled"].indexOf(x.field) >= 0) {
      x.comparisonType = "equal";
      x.filterValue = "true";
      x.booleanField = true;
    }
    else {
      x.booleanField = false;
    }
  }

  openEditFunction(detail: LeaveBalance, index: number) {
    this.subscription1 = this.infoservice.OnCloseAdjustLimitFunction().subscribe(() => {
      this.subscription1.unsubscribe();
      this.subscription2.unsubscribe();
      this.editMode = false;
    });
    this.subscription2 = this.infoservice.OnConfirmAdjustLimitFunction().subscribe((data) => {
      this.subscription2.unsubscribe();
      let i: number = data.index;
      let detail: LeaveBalance = data.detail;
      for (var k = 0; k < detail.leaveTypes.length; k += 1) {
        this.summary[i].leaveTypes[k].limit = detail.leaveTypes[k].limit;
      }
    })
    this.infoservice.OpenAdjustLimitFunction(detail, index);
    this.editMode = true;
  }
}

export interface LeaveBalance {
  user: User;
  leaveTypes: LeaveType[]
}

export interface User {
  userName: string
  userFullName: string
  userDeptCode: string
  userTitleCode: string
}

export interface LeaveType {
  leaveCode: string
  limit: string
  balance: string
}

interface Filter {
  phraseOperator: string;
  field: string;
  comparisonType: string;
  filterValue: string;
  booleanField: boolean;
  numericField: boolean;
  dateField: boolean;
}

//export type SortDirection = 'asc' | 'desc' | '';
//const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': 'asc', '': 'asc' };
//export function compare(v1: any, v2: any): number {
//  return v1 < v2 ? -1 : (v1 > v2 ? 1 : 0)
//};
//export interface SortEvent {
//  column: string;
//  direction: SortDirection;
//  hostObject: NgbdSortableHeader;
//}
