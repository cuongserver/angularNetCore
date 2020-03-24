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

@Component({
  selector: 'app-public-holiday-list',
  templateUrl: './public-holiday-list.component.html',
  styleUrls: ['./public-holiday-list.component.css'],
  animations: res.fadeAnimation
})
/** PublicHolidayList component*/
export class PublicHolidayListComponent implements OnDestroy{
  private transitionState: string = 'in';
  private holidays: Array<Holiday> = new Array<Holiday>();
  private subscription1: Subscription; private subscription2: Subscription;
  private subscription3: Subscription; private subscription4: Subscription;
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
  conditionSet: Array<any> = new Array<any>();
  editMode: boolean;


  constructor(private http: HttpClient, private jsonToCsv: JsonToCsvService, private translate: TranslateService,
    private dialogService: DialogService, private dialog: MatDialog, private loader: LoaderService) {
    this.getData();
  }

  ngOnDestroy() {
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
    if (this.subscription3) this.subscription3.unsubscribe();
    if (this.subscription4) this.subscription4.unsubscribe();
  }
  private removeFromDb(i: number): void {
    let data = JSON.stringify(this.holidays[i]);
    this.setEventListenerAfterSubmit();
    this.http.post('/SystemSetting/RemoveHoliday', data, res.moduleHttpOptions).subscribe(
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

  private getData(): void {
    this.http.get('/SystemSetting/ListAllHoliday')
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

  private downloadCsv() {
    this.http.get('/SystemSetting/ListAllHoliday')
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


  private transformHeader(): string[] {
    var x: string[] = [];
    x.push(this.translate.instant('commonCaptions.date'))
    x.push(this.translate.instant('commonCaptions.descriptionCommon'))
    return x
  }
  private transformResponse(data): Array<Holiday> {
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
