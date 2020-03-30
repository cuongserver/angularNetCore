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
import { apiLink, domain } from '@app/_common/const/apilink'

@Component({
  selector: 'app-public-holiday-list',
  templateUrl: './public-holiday-list.component.html',
  styleUrls: ['./public-holiday-list.component.css'],
  animations: res.fadeAnimation
})
/** PublicHolidayList component*/
export class PublicHolidayListComponent implements OnDestroy{
  public transitionState: string = 'in';
  public holidays: Array<Holiday> = new Array<Holiday>();
  public subscription1: Subscription; public subscription2: Subscription;
  public subscription3: Subscription; public subscription4: Subscription;
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
  public dataLoading = new Subject<any>();
  conditionSet: Array<any> = new Array<any>();
  editMode: boolean;


  constructor(public http: HttpClient, public jsonToCsv: JsonToCsvService, public translate: TranslateService,
    public dialogService: DialogService, public dialog: MatDialog, public loader: LoaderService) {
    this.getData();
  }

  ngOnDestroy() {
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
    if (this.subscription3) this.subscription3.unsubscribe();
    if (this.subscription4) this.subscription4.unsubscribe();
  }
  public removeFromDb(i: number): void {
    let data = JSON.stringify(this.holidays[i]);
    this.setEventListenerAfterSubmit();
    this.http.post(apiLink + '/SystemSetting/RemoveHoliday', data, res.moduleHttpOptions).subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
        let message1 = result['status'];

        if (message1 == '000') {
          this.dialogService.sendMessage('000' + 'removeholiday', this.holidays[i].holidayDate);
          this.holidays.splice(i, 1);
        }
        if (message1 == '002') {
          this.dialogService.sendMessage('002' + 'removeholiday', this.holidays[i].holidayDate);
        }

      },
      error => {
        this.subscription1.unsubscribe();
      }
    )
  }

  public getData(): void {
    this.http.get(apiLink + '/SystemSetting/ListAllHoliday')
      .subscribe(
        response => {
          let result = JSON.parse(JSON.stringify(response));
          let array = result['holidays'] as Array<any>

          //this.collectionSize = result['collectionSize'];
          //this.activePage = result['activePage'];
          //this.navigateToPage = this.activePage;
          //this.pageSize = result['pageSize'];
          //this.buildPager(this.collectionSize, this.pageSize);
          while (this.holidays.length > 0) {
            this.holidays.pop();
          }
          for (var i = 0; i < array.length; i += 1) {
            let holiday: Holiday = {
              holidayDate: array[i]['holidayDate'],
              description: array[i]['description']             
            }
            this.holidays.push(holiday);
          }
          //this.users = this.usersOriginal;

        },
        error => {

        },
        () => {
          this.dataLoading.next();
        }
      )
  }

  public downloadCsv() {
    this.http.get(apiLink + '/SystemSetting/ListAllHoliday')
      .subscribe(
        response => {
          let x: string[] = this.transformHeader();
          let result = JSON.parse(JSON.stringify(response));
          let array = result['holidays'] as Array<any>
          let y = this.transformResponse(array);
          this.jsonToCsv.downloadFile(y, x, 'extract');
        },
        error => {
          
        }
      )
  }


  public transformHeader(): string[] {
    var x: string[] = [];
    x.push(this.translate.instant('commonCaptions.date'))
    x.push(this.translate.instant('commonCaptions.descriptionCommon'))
    return x
  }
  public transformResponse(data): Array<Holiday> {
    let array = data as Array<any>;
    let x = new Array<Holiday>();
    for (var i = 0; i < array.length; i += 1) {
      let _obj: Holiday = {
        holidayDate: array[i]['holidayDate'],
        description: array[i]['description']
      }
      x.push(_obj);
    }
    return x;
  }

  setEventListenerAfterSubmit(): void {
    this.subscription1 = this.dialogService.getMessage().subscribe(message => {
      this.subscription2 = this.loader.loaderDeactivated.subscribe(() => {
        var x = DialogController.show(this.dialog, message.text, message.extraInfo, '', '',
          MessageBoxButton.Ok, false, MessageBoxStyle.Simple).subscribe(result => {
            this.subscription1.unsubscribe();
            this.subscription2.unsubscribe();
          });
      });
    });
  }
}




interface Holiday {
  holidayDate: string
  description: string
}
