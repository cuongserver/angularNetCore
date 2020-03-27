import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import * as res from '@app/module/system-setting/module-resource';
import { Observable, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogService, DialogController, MessageBoxButton, MessageBoxStyle } from '@app/_common/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@app/_common/loader/loader.service';
declare var $: any

@Component({
  selector: 'app-user-leave-application',
  templateUrl: './user-leave-application.component.html',
  styleUrls: ['./user-leave-application.component.css'],
  animations: res.fadeAnimation
})
/** user-leave-application component*/
export class UserLeaveApplicationComponent implements OnDestroy, AfterViewInit {
  private transitionState: string = 'in';
  private dataLoading = new Subject<any>();
  private subscription1: Subscription; private subscription2: Subscription;
  private subscription3: Subscription; private subscription4: Subscription;
  private thisForm: FormGroup;
  private userName: string;
  private leaveCodes: string[];
  private sysParams: SysParam[];
  private holidays: Holiday[];
  private app: LeaveApplication = {
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
    approverDescription: '',
    createdByAdmin: false,
    finalStatus: true,
    applicantUserFullName: '',
    approverUserFullName: ''
  }


  private KVpair: { [key: string]: any } = {
    leaveCodeV: [Validators.required],
    fromTimeV: [Validators.required, Validators.pattern("^((\\d\\d\\d\\d)\\-([0]{0,1}[1-9]|1[012])\\-([1-9]|([012][0-9])|(3[01])))\\s(([0-1]?[0-9]|2?[0-3]):([0-5]\\d))$")],
    toTimeV: [Validators.required, Validators.pattern("^((\\d\\d\\d\\d)\\-([0]{0,1}[1-9]|1[012])\\-([1-9]|([012][0-9])|(3[01])))\\s(([0-1]?[0-9]|2?[0-3]):([0-5]\\d))$")],

    leaveCodeS: false,
    fromTimeS: false,
    toTimeS: false
  };


  constructor(private http: HttpClient, private formBuilder: FormBuilder, private jwtService: JwtHelperService,
    private dialogService: DialogService, private dialog: MatDialog, private loader: LoaderService) {
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
    this.http.post('/LeaveManagement/UserLeaveApplication', data, res.moduleHttpOptions).subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
        this.app = result['application'] as LeaveApplication;
        this.leaveCodes = result['leaveCodes'];
        this.holidays = result['holidays'] as Holiday[];
        this.sysParams = result['sysParams'];
        this.initDatetimePicker();
        this.initLeaveTimeCalculator();
      },
      error => {

      }
    )

  }

  private initLeaveTimeCalculator(): void {
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

    $("body").on("change", 'input[datetimepicker="lower"], input[datetimepicker="upper"]',  () => {
      var startTime = $('input[datetimepicker="lower"]').eq(0).val();
      var endTime = $('input[datetimepicker="upper"]').eq(0).val();
      if (startTime == null || startTime == undefined || startTime == '') {
        this.app.timeConsumed = 0;
        //$('#hourRequired-container').addClass('disp-none');
        return;
      };
      if (endTime == null || endTime == undefined || endTime == '') {
        this.app.timeConsumed = 0;
        //$('#hourRequired-container').addClass('disp-none');
        return;
      };
      if (startTime != currentStartTime || endTime != currentEndTime) {
        currentStartTime = startTime;
        currentEndTime = endTime;
        var leaveDura = Math.ceil(leaveInMin(startTime, endTime) / 60);
        this.app.timeConsumed = leaveDura;
        //if (leaveDura == 0) $('#hourRequired-container').addClass('disp-none');
        //if (leaveDura != 0) $('#hourRequired-container').removeClass('disp-none');
      };
    });
  }
  ngAfterViewInit() {

  }
  private initDatetimePicker(): void {
    $('input[datetimepicker]').datetimepicker({
      theme: 'dark',
      timepicker: true,
      format: 'Y-m-d H:i',
      mask: true,
      todayButton: false,
      allowTimes: ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30'],
      onShow: (ct, $i) => {
        let langOptions: string[] = (['vi', 'en']);
        let cachedLang = localStorage.getItem('pageLanguage');
        let x: string = langOptions.includes(cachedLang) && cachedLang !== null ? cachedLang : 'vi';
        $.datetimepicker.setLocale(x);
      }
    });
  }
  ngOnDestroy() {
    $('input[datetimepicker]').datetimepicker('destroy')
    $('input[datetimepicker]').unbind();
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription1.unsubscribe();
  }

  private resetValidity(fieldName: string): void {
    this.KVpair[fieldName + 'S'] = false;
  }

  private getModelError(key: string): boolean {
    if (key == 'leaveCode' + 'Required') return this.ctls['leaveCode']?.errors?.required && this.KVpair['leaveCode' + 'S']

    if (key == 'fromTime' + 'Required') return this.ctls['fromTime']?.errors?.required && this.KVpair['fromTime' + 'S']
    if (key == 'fromTime' + 'Pattern') return !this.ctls['fromTime']?.errors?.required && this.KVpair['fromTime' + 'S']
      && this.ctls['fromTime']?.errors?.pattern


    if (key == 'toTime' + 'Required') return this.ctls['toTime']?.errors?.required && this.KVpair['toTime' + 'S']
    if (key == 'toTime' + 'Pattern') return !this.ctls['toTime']?.errors?.required && this.KVpair['toTime' + 'S']
      && this.ctls['toTime']?.errors?.pattern
  }

  private submitForm(): void {
    this.syncData();
    if (this.ctls['leaveCode'].invalid) this.KVpair['leaveCode' + 'S'] = true;
    if (this.ctls['fromTime'].invalid) this.KVpair['fromTime' + 'S'] = true;
    if (this.ctls['toTime'].invalid) this.KVpair['toTime' + 'S'] = true;
    if (this.thisForm.invalid) return

    this.setEventListenerAfterSubmit();
    let data = JSON.stringify(this.app);
    this.http.post('/LeaveManagement/SubmitLeaveApplication', data, res.moduleHttpOptions).subscribe(
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
        if (message1 == '004') {
          this.dialogService.sendMessage('004' + 'submitLeaveApp', this.app.trackingRef);
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
  private syncData(): void {
    this.app.fromTime = $('input[datetimepicker="lower"]').eq(0).val();
    this.app.toTime = $('input[datetimepicker="upper"]').eq(0).val();
    this.ctls['leaveCode'].setValue(this.app.leaveCode);
    this.ctls['fromTime'].setValue(this.app.fromTime);
    this.ctls['toTime'].setValue(this.app.toTime);

  }
  private setEventListenerAfterSubmit(): void {
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
