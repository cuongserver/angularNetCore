import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { moduleHttpOptions, fadeAnimation } from '@app/module/system-setting/module-resource';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogService, DialogController, MessageBoxButton, MessageBoxStyle } from '@app/_common/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@app/_common/loader/loader.service';
import { Subscription } from 'rxjs';
import {DatetimepickerComponent} from '@app/module/shared-module/datetime-picker-module/datetimepicker/datetimepicker.component'
import { apiLink, domain } from '@app/_common/const/apilink'



@Component({
  selector: 'app-add-public-holiday',
  templateUrl: './add-public-holiday.component.html',
  styleUrls: ['./add-public-holiday.component.css'],
  animations: fadeAnimation
})
/** AddPublicHoliday component*/
export class AddPublicHolidayComponent implements OnDestroy, AfterViewInit{
  public transitionState: string = 'in';
  public thisForm: FormGroup;
  public subscription1: Subscription;
  public subscription2: Subscription;
  public subscription3: Subscription;
  public subscription4: Subscription;

  public KVpair: { [key: string]: any } = {
    holidayDateV: [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)],    
    holidayDateS: false,
    descriptionS: false
  };
  //add
  datetimePickerOpen: boolean = false;
  //add(het)
  //pageLanguage: string = this.pageLang; //localStorage.getItem('pageLanguage')

  constructor(public formBuilder: FormBuilder,
    public http: HttpClient,
    public router: Router, public jwtHelper: JwtHelperService,
    public dialogService: DialogService,
    public dialog: MatDialog, public loader: LoaderService) {
    this.thisForm = this.formBuilder.group({
      holidayDate: ['', this.KVpair['holidayDateV']],
      description: ['']
    });
  }

  @ViewChild('dt1') dt1: DatetimepickerComponent;

  ngAfterViewInit() {
    this.subscription3 = this.dt1.timeValue.subscribe(timeValue => {
      let ctls = this.thisForm.controls;
      ctls['holidayDate'].setValue(timeValue);      
    })
    this.subscription4 = this.dt1.closeDateTimePicker.subscribe(closeSignal => {
      this.datetimePickerOpen = closeSignal;
    })
  }

  get pageLang() {
    return localStorage.getItem('pageLanguage')
  }

  ngOnDestroy() {
    //$('input[datetimepicker]').datetimepicker('destroy')
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
    if (this.subscription3) this.subscription3.unsubscribe();
    if (this.subscription4) this.subscription4.unsubscribe();
  }
  setValue(controlName: string) {
    var myVal = $("input[formcontrolname='" + controlName + "']").eq(0).val();
    let ctls = this.thisForm.controls;
    ctls[controlName].setValue(myVal);
  }

  resetValidity(key: string) {
    this.KVpair[key + 'S'] = false;
    if (key == 'userName') this.KVpair[key + 'DbExist'] = false;
  }

  submitForm() {
    let ctls = this.thisForm.controls;
    //this.setValue('holidayDate');
    //this.setValue('description');
    if (ctls['holidayDate'].invalid) this.KVpair['holidayDate' + 'S'] = true;
    if (this.thisForm.invalid) return;

    let _obj = {
      holidayDate: ctls['holidayDate'].value,
      description: ctls['description'].value
    }

    let data = JSON.stringify(_obj);
    this.setEventListenerAfterSubmit()
    this.http.post(apiLink + '/SystemSetting/AddNewHoliday', data, moduleHttpOptions).subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
        let message1 = result['status'];

        if (message1 == '000') {
          this.dialogService.sendMessage('000' + 'addnewholiday', _obj.holidayDate);
          ctls['holidayDate'].setValue('');
          ctls['description'].setValue('');
        }
        if (message1 == '004') {
          this.dialogService.sendMessage('004' + 'addnewholiday', _obj.holidayDate);
        }

      },
      error => {
        this.subscription1.unsubscribe();
      }
    )
  }

  getModelError(key: string): boolean {
    let ctls = this.thisForm.controls;    
    if (key == 'holidayDate' + 'Required') return ctls['holidayDate']?.errors?.required && this.KVpair['holidayDate' + 'S']
    if (key == 'holidayDate' + 'Pattern') return !ctls['holidayDate']?.errors?.required && this.KVpair['holidayDate' + 'S']
      && ctls['holidayDate']?.errors?.pattern    
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

  showDatePicker(): void {
    this.datetimePickerOpen = !this.datetimePickerOpen;
  }
}


