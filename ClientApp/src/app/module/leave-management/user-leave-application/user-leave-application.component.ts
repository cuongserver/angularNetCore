import { Component, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import * as res from '@app/module/system-setting/module-resource';
import { Observable, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogService, DialogController, MessageBoxButton, MessageBoxStyle } from '@app/_common/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@app/_common/loader/loader.service';
import { DatetimepickerComponent } from '@app/module/shared-module/datetime-picker-module/datetimepicker/datetimepicker.component';

//declare var $: any

import { apiLink, domain } from '@app/_common/const/apilink'
@Component({
  selector: 'app-user-leave-application',
  templateUrl: './user-leave-application.component.html',
  styleUrls: ['./user-leave-application.component.css'],
  animations: res.fadeAnimation
})
/** user-leave-application component*/
export class UserLeaveApplicationComponent implements OnDestroy, AfterViewInit {
  public transitionState: string = 'in';
  public dataLoading = new Subject<any>();
  public subscription1: Subscription; public subscription2: Subscription;
  public subscription3: Subscription; public subscription4: Subscription;

  public sub: Array<Subscription> = new Array<Subscription>();
  public submitSuccess: boolean = false;
  public thisForm: FormGroup;
  public userName: string;
  public leaveCodes: string[];
  public sysParams: SysParam[];
  public holidays: Holiday[];
  public app: LeaveApplication = {
    trackingRef: '',
    createdAt: '',
    applicantUserName: '',
    applicantDeptCode: '',
    applicantTitleCode: '',
    fromTime: '',
    toTime: '',
    timeConsumed: 0,
    applicantDescription: '',
    leaveCode: '',
    isValid: false,
    progress: '',
    approverUserName: '',
    approverCommand: '',
    approverDescription: '',
    createdByAdmin: false,
    finalStatus: true,
    applicantUserFullName: '',
    approverUserFullName: ''
  }

  regex: RegExp = new RegExp("^((\\d\\d\\d\\d)\\-([0]{0,1}[1-9]|1[012])\\-([1-9]|([012][0-9])|(3[01])))\\s(([0-1]?[0-9]|2?[0-3]):([0-5]\\d))$");
  
  public KVpair: { [key: string]: any } = {
    leaveCodeV: [Validators.required],
    fromTimeV: [Validators.required, Validators.pattern(this.regex)],
    toTimeV: [Validators.required, Validators.pattern(this.regex)],

    leaveCodeS: false,
    fromTimeS: false,
    toTimeS: false
  };

  datetimePickerOpen1: boolean = false;
  datetimePickerOpen2: boolean = false;

  constructor(public http: HttpClient, public formBuilder: FormBuilder, public jwtService: JwtHelperService,
    public dialogService: DialogService, public dialog: MatDialog, public loader: LoaderService) {
    this.thisForm = this.formBuilder.group({
      leaveCode: ['', this.KVpair['leaveCodeV']],
      fromTime: ['', this.KVpair['fromTimeV']],
      toTime: ['', this.KVpair['toTimeV']],
      applicantDescription: [''],
    }, {
      //validator: comparePassword
    });
    this.userName = extractFromToken('unique_name', jwtService);
    let _obj = { userName: this.userName };
    let data = JSON.stringify(_obj);    
    this.http.post(apiLink + '/LeaveManagement/UserLeaveApplication', data, res.moduleHttpOptions).subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
        this.app = result['application'] as LeaveApplication;
        this.leaveCodes = result['leaveCodes'];
        this.holidays = result['holidays'] as Holiday[];
        this.sysParams = result['sysParams'];
        this.initLeaveTimeCalculator();        
      },
      error => {

      }
    )

  }

  @ViewChild('dt1') dt1: DatetimepickerComponent;
  @ViewChild('dt2') dt2: DatetimepickerComponent;



  public initLeaveTimeCalculator(): void {    
    checkInTime = this.sysParams.find(x => x.paramKey == 'StartTime').paramValue;
    checkOutTime = this.sysParams.find(x => x.paramKey == 'EndTime').paramValue
    breakStartTime = this.sysParams.find(x => x.paramKey == 'BreakStart').paramValue
    breakEndTime = this.sysParams.find(x => x.paramKey == 'BreakEnd').paramValue
    let myArray1: string[] = [];
    myArray1.push(this.sysParams.find(x => x.paramKey == 'Weekend1').paramValue)
    myArray1.push(this.sysParams.find(x => x.paramKey == 'Weekend2').paramValue)
    weeklyDayOff = myArray1;
    let myArray2: string[] = [];
    this.holidays.forEach(x => myArray2.push(x.holidayDate));
    publicDayOff = myArray2;
  }

  get timeConsumed() {
    var startTime = this.app.fromTime;
    var endTime = this.app.toTime;
    if (!this.testRegex()) {
      this.app.timeConsumed = 0;
      return this.app.timeConsumed;
    };
    if (startTime != currentStartTime || endTime != currentEndTime) {
      currentStartTime = startTime;
      currentEndTime = endTime;
      var leaveDura = Math.ceil(leaveInMin(startTime, endTime) / 60);
      this.app.timeConsumed = leaveDura;
    }
    return this.app.timeConsumed
  }

  testRegex(): boolean {
    const regex = this.regex
    return regex.test(this.app.fromTime) && this.regex.test(this.app.toTime);
  }

  ngAfterViewInit() {
    this.sub.push(this.dt1.timeValue.subscribe(timeValue => {
      this.app.fromTime = timeValue
    }));
    this.sub.push(this.dt1.closeDateTimePicker.subscribe(closeSignal => {
      this.datetimePickerOpen1 = closeSignal;
    }));
    this.sub.push(this.dt2.timeValue.subscribe(timeValue => {
      this.app.toTime = timeValue
    }));
    this.sub.push(this.dt2.closeDateTimePicker.subscribe(closeSignal => {
      this.datetimePickerOpen2 = closeSignal;
    }));
  }

  ngOnDestroy() {
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
    this.sub.forEach(x => x.unsubscribe());
  }

  public resetValidity(fieldName: string): void {
    this.KVpair[fieldName + 'S'] = false;
  }

  public getModelError(key: string): boolean {
    if (key == 'leaveCode' + 'Required') return this.ctls['leaveCode']?.errors?.required && this.KVpair['leaveCode' + 'S']

    if (key == 'fromTime' + 'Required') return this.ctls['fromTime']?.errors?.required && this.KVpair['fromTime' + 'S']
    if (key == 'fromTime' + 'Pattern') return !this.ctls['fromTime']?.errors?.required && this.KVpair['fromTime' + 'S']
      && this.ctls['fromTime']?.errors?.pattern


    if (key == 'toTime' + 'Required') return this.ctls['toTime']?.errors?.required && this.KVpair['toTime' + 'S']
    if (key == 'toTime' + 'Pattern') return !this.ctls['toTime']?.errors?.required && this.KVpair['toTime' + 'S']
      && this.ctls['toTime']?.errors?.pattern
  }

  public submitForm(): void {
    this.syncData();
    if (this.ctls['leaveCode'].invalid) this.KVpair['leaveCode' + 'S'] = true;
    if (this.ctls['fromTime'].invalid) this.KVpair['fromTime' + 'S'] = true;
    if (this.ctls['toTime'].invalid) this.KVpair['toTime' + 'S'] = true;
    if (this.thisForm.invalid) return

    this.setEventListenerAfterSubmit();
    let data = JSON.stringify(this.app);
    this.http.post(apiLink + '/LeaveManagement/SubmitLeaveApplication', data, res.moduleHttpOptions).subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
        let message1 = result['status'];

        if (message1 == '000') {
          this.dialogService.sendMessage('000' + 'submitLeaveApp', this.app.trackingRef);
          this.app.leaveCode = '';
          this.app.fromTime = '';
          this.app.toTime = '';
          this.app.applicantDescription = '';
          
        }
        if (message1 == '002') {
          this.dialogService.sendMessage('002' + 'submitLeaveApp', this.app.trackingRef);
        }
      },
      error => {
        this.subscription1.unsubscribe();
      }

    )
    
  }

  get ctls() {
    return this.thisForm.controls
  }
  public syncData(): void {
    //this.app.fromTime = $('input[datetimepicker="lower"]').eq(0).val();
    //this.app.toTime = $('input[datetimepicker="upper"]').eq(0).val();
    this.ctls['leaveCode'].setValue(this.app.leaveCode);
    this.ctls['fromTime'].setValue(this.app.fromTime);
    this.ctls['toTime'].setValue(this.app.toTime);

  }
  public setEventListenerAfterSubmit(): void {
    this.subscription1 = this.dialogService.getMessage().subscribe(message => {
      this.subscription2 = this.loader.loaderDeactivated.subscribe(() => {
        var x = DialogController.show(this.dialog, message.text, message.extraInfo, '', '',
          MessageBoxButton.Ok, false, MessageBoxStyle.Simple).subscribe(result => {
            if (message.text == '000' + 'submitLeaveApp') this.submitSuccess = true;
            this.subscription1.unsubscribe();
            this.subscription2.unsubscribe();
          });
      });
    });
  }

  public newApplication(): void {
    let _obj = { userName: this.userName };
    let data = JSON.stringify(_obj);
    this.http.post(apiLink + '/LeaveManagement/UserLeaveApplication', data, res.moduleHttpOptions).subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
        this.app = result['application'] as LeaveApplication;
        this.leaveCodes = result['leaveCodes'];
        this.holidays = result['holidays'] as Holiday[];
        this.sysParams = result['sysParams'];
        this.submitSuccess = false
      },
      error => {
      }
    )
  }

  get pageLang() {
    return localStorage.getItem('pageLanguage')
  }

  showDatePicker1(): void {
    this.datetimePickerOpen1 = !this.datetimePickerOpen1;
    if (this.datetimePickerOpen2) this.datetimePickerOpen2 = false;
  }

  showDatePicker2(): void {
    this.datetimePickerOpen2 = !this.datetimePickerOpen2;
    if (this.datetimePickerOpen1) this.datetimePickerOpen1 = false;
  }

}

export function tokenGetter() {
  return sessionStorage.getItem("jwt");
}
export function extractFromToken(segment: string, jwtHelper: JwtHelperService): string {
  let token = tokenGetter();
  let decodedInfo = jwtHelper.decodeToken(token);
  return decodedInfo[segment];
}

export interface LeaveApplication {
  trackingRef: string
  createdAt: string
  applicantUserName: string
  applicantDeptCode: string
  applicantTitleCode: string
  fromTime: string
  toTime: string
  timeConsumed: number
  applicantDescription: string
  leaveCode: string
  isValid: boolean
  progress: string
  approverUserName: string
  approverCommand: string
  approverDescription: string
  createdByAdmin: boolean
  finalStatus: boolean
  applicantUserFullName: string
  approverUserFullName: string
}

export interface SysParam {
  paramKey: string
  paramValue: string
}

export interface Holiday {
  holidayDate: string
  description: string
  isEnabled: boolean
}
