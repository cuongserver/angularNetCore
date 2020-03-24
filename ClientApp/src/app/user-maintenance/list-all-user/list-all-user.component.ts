import {
  Component, Renderer2, ElementRef,
  Directive, EventEmitter, Input, Output, QueryList, ViewChildren, HostBinding, HostListener, OnInit, AfterViewInit, ViewChild, OnDestroy
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { fadeAnimation } from '../../_common/const/animation';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoService } from './user-info.service';
import { saveAs } from 'file-saver'
import { map } from 'rxjs/operators';
import { JsonToCsvService } from '@app/_common/json-to-csv/json-to-csv.service';
import { TranslateService } from '@ngx-translate/core';

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
  selector: 'app-list-all-user',
  templateUrl: './list-all-user.component.html',
  styleUrls: ['./list-all-user.component.css'],
  animations: fadeAnimation
})
/** user-list-table component*/
export class ListAllUserComponent implements OnDestroy {
  users: Array<User> = new Array<User>();
  usersOriginal: Array<User> = new Array<User>();
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
  private dataLoading = new Subject<any>();

  conditionSet: Array<FilterCondition> = new Array<FilterCondition>();
  editMode: boolean;
  private subscription1: Subscription; private subscription2: Subscription;
  private subscription3: Subscription; private subscription4: Subscription;

  constructor(private http: HttpClient, private fb: FormBuilder, private infoservice: UserInfoService,
    private jsonToCsv: JsonToCsvService, private translate: TranslateService) {
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
    this.lowerItem = (this.activePage - 1) * pageSize + 1
    this.upperItem = Math.min(this.activePage * pageSize, this.collectionSize);
  }


  getData(pageSize: number, requestPage: number) {

    var z = this.conditionSet.length;
    if (z > 0) {
      for (var y = z - 1; y > -1; y -= 1) {
        if (this.conditionSet[y].field == null || this.conditionSet[y].field == '') {
          this.conditionSet.splice(y, 1);
        }
      }
    }

    let x = {
      pageSize: pageSize as number,
      requestPage: requestPage as number,
      filters: this.conditionSet
    }
    let data = JSON.stringify(x);
    this.http.post('/User/ListAllUser', data, httpOptions)
      .subscribe(
        response => {
          let result = JSON.parse(JSON.stringify(response));
          let array = result['users'] as Array<any>

          this.collectionSize = result['collectionSize'];
          this.activePage = result['activePage'];
          this.navigateToPage = this.activePage;
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
  navigate(quickNavigateToPage: any) {
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

  addCondition() {
    let condition = {} as FilterCondition
    condition.booleanField = false;
    condition.phraseOperator = 'and'
    condition.comparisonType = 'contain'
    this.conditionSet.push(condition);
  }
  trackByIndex(index: number, obj: any): any {
    return index;
  }
  removeCondition(index: number) {
    var x = this.conditionSet.length;
    this.conditionSet.splice(index, 1);
    if (x > 1) {
      this.conditionSet[0].phraseOperator = 'and'
    };

  }
  checkBooleanField(index: number) {
    let x: FilterCondition = this.conditionSet[index]
    if (["userEnabled"].indexOf(x.field) >= 0) {
      x.comparisonType = "equal";
      x.filterValue = "true";
      x.booleanField = true;
    }
    else {
      x.booleanField = false;
    }
  }

  openEditFunction(user: User, index: number) {
    this.subscription1 = this.infoservice.getCloseMessage().subscribe(() => {
      this.subscription1.unsubscribe();
      this.subscription2.unsubscribe();
      this.editMode = false;     
    });
    this.subscription2 = this.infoservice.getConfirmMessage().subscribe((data) => {
      this.subscription2.unsubscribe();
      let i: number = data.index;
      let user: User = data.user;
      this.users[i].userFullName = user.userFullName;
      this.users[i].userDeptCode = user.userDeptCode;
      this.users[i].userTitleCode = user.userTitleCode;
      this.users[i].userEmail = user.userEmail;
      this.users[i].userEnabled = user.userEnabled;
      this.users[i].userFailedLoginCount = user.userFailedLoginCount;
    })
    this.infoservice.sendOpenCommand(user, index);
    this.editMode = true;
  }

  openResetPasswordFunction(user: User, index: number) {
    this.subscription3 = this.infoservice.OnCloseResetPasswordFunction().subscribe(() => {
      this.subscription3.unsubscribe();
      this.editMode = false;
    });

    this.infoservice.OpenResetPasswordFunction(user, index);
    this.editMode = true;
  }

  downloadCsv() {
    var z = this.conditionSet.length;
    if (z > 0) {
      for (var y = z - 1; y > -1; y -= 1) {
        if (this.conditionSet[y].field == null || this.conditionSet[y].field == '') {
          this.conditionSet.splice(y, 1);
        }
      }
    }

    let x = {
      pageSize: 1 as number,
      requestPage: 1 as number,
      filters: this.conditionSet
    }
    let data = JSON.stringify(x);
    this.http.post('/User/DownloadAllUser', data, httpOptions)
      .subscribe(
        response => {
          let x: string[] = this.transformHeader();
          let result = JSON.parse(JSON.stringify(response));
          let array = result['users'] as Array<any>
          let y = this.transformResponse(array);
          this.jsonToCsv.downloadFile(y, x, 'extract');
        },
        error => {

      })

  }

  transformHeader(): string[] {
    var x: string[] = [];
    x.push(this.translate.instant('commonCaptions.userName'))
    x.push(this.translate.instant('commonCaptions.userFullName'))
    x.push(this.translate.instant('commonCaptions.userDeptCode'))
    x.push(this.translate.instant('commonCaptions.deptDesc.caption'))
    x.push(this.translate.instant('commonCaptions.userTitleCode'))
    x.push(this.translate.instant('commonCaptions.titleDesc.caption'))
    x.push(this.translate.instant('commonCaptions.userEmail'))
    x.push(this.translate.instant('commonCaptions.userEnabled'))
    x.push(this.translate.instant('commonCaptions.userFailedLoginCount'))
    return x
  }
  transformResponse(data): Array<User1> {
    let array = data as Array<any>;
    let x = new Array<User1>();
    for (var i = 0; i < array.length; i += 1) {
      let user: User1 = {
        userName: array[i]['userName'],
        userFullName: array[i]['userFullName'],
        userDeptCode: array[i]['userDeptCode'],
        deptDesc: this.translate.instant('commonCaptions.deptDesc.' + array[i]['userDeptCode']),
        userTitleCode: array[i]['userTitleCode'],
        titleDesc: this.translate.instant('commonCaptions.titleDesc.' + array[i]['userTitleCode']),
        userEmail: array[i]['userEmail'],
        userEnabled: this.translate.instant('commonCaptions.enabled' + array[i]['userEnabled']),
        userFailedLoginCount: array[i]['userFailedLoginCount'] + ''
      }
      x.push(user);
    }
    return x;
  }


  //private downloadCsv1() {
  //  let form: HTMLElement = document.createElement('form');
  //  let input: HTMLElement = document.createElement('input');
  //  let submit: HTMLElement = document.createElement('input');
  //  form.setAttribute('method', 'post');
  //  form.setAttribute('action', '/User/DownloadUserList');
  //  form.setAttribute('target', '_blank');
  //  input.setAttribute('type', 'hidden');
  //  input.setAttribute('name', 'jwt');    
  //  submit.setAttribute('type', 'submit');
  //  form.appendChild(input);
  //  form.appendChild(submit);
  //  document.getElementsByTagName('body')[0].appendChild(form);
  //  input.setAttribute('value', sessionStorage.getItem('jwt'));
  //  submit.click();
  //  form.remove();
  //}


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

export interface FilterCondition {
  phraseOperator: string;
  field: string;
  comparisonType: string;
  filterValue: string;
  booleanField: boolean;
}
export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

interface User1 {
  userName: string
  userFullName: string
  userDeptCode: string
  deptDesc: string
  userTitleCode: string
  titleDesc: string
  userEmail: string
  userEnabled: string
  userFailedLoginCount: string
}
