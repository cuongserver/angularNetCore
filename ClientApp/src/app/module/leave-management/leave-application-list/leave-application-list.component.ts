import { Component, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import * as res from '@app/module/system-setting/module-resource';
import { HttpClient } from '@angular/common/http';
import {LeaveApplication,SysParam, Holiday } from '@app/module/leave-management/user-leave-application/user-leave-application.component'
import { LeaveApproveService } from '@app/module/leave-management/leave-approve.service';
import { Subscription, Subject } from 'rxjs';
import { JsonToCsvService } from '@app/_common/json-to-csv/json-to-csv.service';
import { NgbdSortableHeader, rotate, compare, SortDirection, SortEvent } from '@app/module/shared-module/sortable-header.module'
import { TranslateService } from '@ngx-translate/core';
import { apiLink, domain } from '@app/_common/const/apilink'
@Component({
  selector: 'app-leave-application-list',
  templateUrl: './leave-application-list.component.html',
  styleUrls: ['./leave-application-list.component.css'],
  animations: res.fadeAnimation
})
/** approve-leave-application component*/
export class LeaveApplicationListComponent implements OnDestroy {
/** approve-leave-application ctor */
  public response: any
  public transitionState: string = 'in';

  public onConfirmation: boolean = false;

  public subscription1: Subscription; public subscription2: Subscription;
  public subscription3: Subscription; public subscription4: Subscription;
  public dataLoading = new Subject<any>();

  public apps: Array<LeaveApplication> = new Array<LeaveApplication>();
  public appsOriginal: Array<LeaveApplication> = new Array<LeaveApplication>();

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

  constructor(public http: HttpClient, public translate: TranslateService,
    public jsonToCsv: JsonToCsvService ) {
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

  public onSort({ column, direction, hostObject }: SortEvent): void {
    this.sortPriority += 1;
    hostObject.priority = this.sortPriority;
    this.apps = [...this.apps].sort((a, b) => {
      var res: number = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }

  public initialSort(): void {
    let x = [...this.headers].sort((a, b) => {
      return compare(a['priority'], b['priority'])
    })

    x.forEach(header => {
      if (header.priority > 0) {
        this.apps = [...this.apps].sort((a, b) => {
          var res: number = compare(a[header.sortable], b[header.sortable]);
          return header.direction === 'asc' ? res : -res;
        })
      };
    });
  }

  public clearSort(): void {
    this.headers.forEach(header => {
      header.direction = '';
      header.priority = 0;
    });
    this.apps = this.appsOriginal;
    this.sortPriority = 0;
  }

  public loadPage(page: number): void {
    let x: Subscription = this.dataLoading.asObservable().subscribe(() => {
      this.initialSort();
      x.unsubscribe();
    })
    this.requestPage = page;
    this.getData(this.pageSize, this.requestPage);
  }
  public buildPager(collectionSize: number, pageSize: number): void {
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
  public getData(pageSize: number, requestPage: number): void {
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
    this.http.post(apiLink + '/LeaveManagement/GetSingleApplicationList', data, res.moduleHttpOptions).subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
       
        this.collectionSize = result['collectionSize'];
        this.activePage = result['activePage'];
        this.navigateToPage = this.activePage;
        this.pageSize = result['pageSize'];
        this.buildPager(this.collectionSize, this.pageSize);

        if (this.appsOriginal) {
          while (this.appsOriginal.length > 0) {
            this.appsOriginal.pop();
          }
        }

        this.appsOriginal = result["apps"] as Array<LeaveApplication>;
        this.apps = this.appsOriginal
        this.response = result;
      },
      error => {

      },
      () => {
        this.dataLoading.next();
      }
    )
  }

  public refresh(): void {
    let x: Subscription = this.dataLoading.asObservable().subscribe(() => {
      this.initialSort();
      x.unsubscribe();
    })
    this.getData(this.pageSize, this.requestPage);
  }

  public navigate(quickNavigateToPage: any): void {
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

  public changePageSize(newPageSize: number): void {
    if (this.pageSize == newPageSize) return;
    let x: Subscription = this.dataLoading.asObservable().subscribe(() => {
      this.initialSort();
      x.unsubscribe();
    })
    this.pageSize = newPageSize;
    this.requestPage = 1;
    this.getData(this.pageSize, this.requestPage);
  }

  public addCondition(): void {
    let condition = {} as Filter
    condition.booleanField = false;
    condition.numericField = false;
    condition.dateField = false;
    condition.phraseOperator = 'and';
    condition.comparisonType = 'contain';
    this.filters.push(condition);
  }

  public trackByIndex(index: number, obj: any): any {
    return index;
  }

  public removeCondition(index: number) {
    var x = this.filters.length;
    this.filters.splice(index, 1);
    if (x > 1) {
      this.filters[0].phraseOperator = 'and'
    };
  }
  public checkBooleanField(index: number): void {
    let x: Filter = this.filters[index]
    if (['isValid', 'createdByAdmin', 'finalStatus'].indexOf(x.field) >= 0) {
      x.comparisonType = 'equal';
      x.filterValue = 'true';
      x.booleanField = true;
    }
    else {
      x.booleanField = false;
    }
  }

  public checkFixedOptionField(index: number): void {
    let x: Filter = this.filters[index]
    if (['progress', 'approverCommand'].indexOf(x.field) >= 0) {
      x.comparisonType = 'equal';
      switch (x.field) {
        case 'progress':
          x.filterValue = '0000'; break;
        case 'approverCommand':
          x.filterValue = '0000'; break;
        default:
      }
    }

  }


  public transformHeader(): string[] {
    var x: string[] = [];
    x.push(this.translate.instant('leaveApplicationHeaders.progress'))
    x.push(this.translate.instant('leaveApplicationHeaders.approverCommand'))
    x.push('ID')
    x.push(this.translate.instant('leaveApplicationHeaders.createdAt'))
    x.push(this.translate.instant('leaveApplicationHeaders.applicantUserName'))
    x.push(this.translate.instant('leaveApplicationHeaders.applicantUserFullName'))
    x.push(this.translate.instant('leaveApplicationHeaders.applicantDeptCode'))
    x.push(this.translate.instant('commonCaptions.deptDesc.caption'))
    x.push(this.translate.instant('leaveApplicationHeaders.applicantTitleCode'))
    x.push(this.translate.instant('commonCaptions.titleDesc.caption'))
    x.push(this.translate.instant('leaveApplicationHeaders.fromTime'))
    x.push(this.translate.instant('leaveApplicationHeaders.toTime'))
    x.push(this.translate.instant('leaveApplicationHeaders.timeConsumed'))
    x.push(this.translate.instant('leaveApplicationHeaders.applicantDescription'))
    x.push(this.translate.instant('leaveApplicationHeaders.leaveCode'))
    x.push(this.translate.instant('leaveApplicationHeaders.isValid'))
    x.push(this.translate.instant('leaveApplicationHeaders.approverUserName'))
    x.push(this.translate.instant('leaveApplicationHeaders.approverUserFullName'))
    x.push(this.translate.instant('leaveApplicationHeaders.approverDescription'))
    x.push(this.translate.instant('leaveApplicationHeaders.createdByAdmin'))
    x.push(this.translate.instant('leaveApplicationHeaders.finalStatus'))

    return x
  }

  public transformResponse(data): Array<any> {
    let array = data as Array<LeaveApplication>;
    let x = new Array<any>();
    if (array == null || array.length == 0) {
      return [
        {
          progress: '',
          approverCommand: '',
          trackingRef: '',
          createdAt: '',
          applicantUserName: '',
          applicantUserFullName: '',
          applicantDeptCode: '',
          deptDesc: '',
          applicantTitleCode: '',
          titleDesc: '',
          fromTime: '',
          toTime: '',
          timeConsumed: '',
          applicantDescription: '',
          leaveCode: '',
          isValid: '',
          approverUserName: '',
          approverUserFullName: '',
          approverDescription: '',
          createdByAdmin: '',
          finalStatus: ''
        }
      ]
    }
    array.forEach(y => {
      var row = {
        progress: this.translate.instant('commonCaptions.progress.' + y.progress),
        approverCommand: y.approverCommand != '' ? this.translate.instant('approval.approval' + y.approverCommand) : '',
        trackingRef: y.trackingRef,
        createdAt: y.createdAt,
        applicantUserName: y.applicantUserName,
        applicantUserFullName: y.applicantUserFullName,
        applicantDeptCode: y.applicantDeptCode,
        deptDesc: this.translate.instant('commonCaptions.deptDesc.' + y.applicantDeptCode),
        applicantTitleCode: y.applicantTitleCode,
        titleDesc: this.translate.instant('commonCaptions.titleDesc.' + y.applicantTitleCode),
        fromTime: y.fromTime,
        toTime: y.toTime,
        timeConsumed: y.timeConsumed,
        applicantDescription: y.applicantDescription,
        leaveCode: y.leaveCode != '' ? this.translate.instant('leaveCode.leaveCode' + y.leaveCode) : '',
        isValid: this.translate.instant('commonCaptions.trueFalse.common' + y.isValid),        
        approverUserName: y.approverUserName,
        approverUserFullName: y.approverUserFullName,
        approverDescription: y.approverDescription,
        createdByAdmin: this.translate.instant('commonCaptions.trueFalse.common' + y.createdByAdmin),
        finalStatus: this.translate.instant('commonCaptions.enabled' + y.finalStatus)
      }

      x.push(row);
    })
    return x;
  }

  public downloadCsv(): void {
    var z = this.filters.length;
    if (z > 0) {
      for (var y = z - 1; y > -1; y -= 1) {
        if (this.filters[y].field == null || this.filters[y].field == '') {
          this.filters.splice(y, 1);
        }
      }
    }

    let x = {
      pageSize: 1 as number,
      requestPage: 1 as number,
      filters: this.filters
    }

    let data = JSON.stringify(x);
    this.http.post(apiLink + '/LeaveManagement/SingleApplicationListDownload', data, res.moduleHttpOptions).subscribe(
      response => {
        //let result = JSON.parse(JSON.stringify(response));
        //this.collectionSize = result['collectionSize'];
        //this.activePage = result['activePage'];
        //this.navigateToPage = this.activePage;
        //this.pageSize = result['pageSize'];
        //this.buildPager(this.collectionSize, this.pageSize);

        //while (this.summaryOriginal.length > 0) {
        //  this.summaryOriginal.pop();
        //}
        let result = JSON.parse(JSON.stringify(response));
        let x: string[] = this.transformHeader();
        let array = result['apps'] as Array<any>
        let y = this.transformResponse(array);
        //} else {
        //  let y = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        //};
        this.jsonToCsv.downloadFile(y, x, 'extract');

        //let array1 = result["summary"] as Array<any>;
        //array1.forEach(x => {
        //  let user: User = {
        //    userName: x['user']['userName'],
        //    userFullName: x['user']['userFullName'],
        //    userDeptCode: x['user']['userDeptCode'],
        //    userTitleCode: x['user']['userTitleCode']
        //  }
        //  let types: Array<LeaveType> = new Array<LeaveType>();
        //  let array2 = x["leaveTypes"] as Array<any>;
        //  array2.forEach(y => {
        //    let leaveType: LeaveType = {
        //      leaveCode: y['leaveCode'],
        //      limit: y['limit'] != null ? y['limit'].toString() : '',
        //      balance: ''
        //    }
        //    types.push(leaveType);
        //  })
        //  let detail: LeaveBalance = {
        //    user: user,
        //    leaveTypes: types
        //  }
        //  this.summaryOriginal.push(detail);
        //});
        //this.summary = this.summaryOriginal;
      },
      error => {

      },
      () => {
        this.dataLoading.next();
      }
    )

  }
  
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
