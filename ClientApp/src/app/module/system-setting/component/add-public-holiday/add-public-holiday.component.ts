import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { moduleHttpOptions, fadeAnimation } from '@app/module/system-setting/module-resource';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogService } from '@app/_common/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@app/_common/loader/loader.service';

//để sử dụng được jquery + plugin, khai báo như bên dưới
declare var $: any



@Component({
  selector: 'app-add-public-holiday',
  templateUrl: './add-public-holiday.component.html',
  styleUrls: ['./add-public-holiday.component.css'],
  animations: fadeAnimation
})
/** AddPublicHoliday component*/
export class AddPublicHolidayComponent implements OnDestroy, AfterViewInit{
  private transitionState: string = 'in';
  private thisForm: FormGroup;
  private KVpair: { [key: string]: any } = {
    holidayDateV: [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)],    
    holidayDateS: false,
    descriptionS: false
  };

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router, private jwtHelper: JwtHelperService,
    private dialogService: DialogService,
    private dialog: MatDialog, private loader: LoaderService) {
    this.thisForm = this.formBuilder.group({
      holidayDate: ['', this.KVpair['holidayDateV']],
      description: ['']
    });
  }

  ngAfterViewInit() {
    $('input[datetimepicker]').datetimepicker({
      theme: 'dark',
      timepicker: false,
      format: 'Y-m-d',
      mask: true,
      todayButton: false,
      defaultTime: "00:00",
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
    this.setValue('holidayDate');
    this.setValue('description');
    if (ctls['holidayDate'].invalid) this.KVpair['holidayDate' + 'S'] = true;
    if (this.thisForm.invalid) return;
  }

  getModelError(key: string): boolean {
    let ctls = this.thisForm.controls;    
    if (key == 'holidayDate' + 'Required') return ctls['holidayDate']?.errors?.required && this.KVpair['holidayDate' + 'S']
    if (key == 'holidayDate' + 'Pattern') return !ctls['holidayDate']?.errors?.required && this.KVpair['holidayDate' + 'S']
      && ctls['holidayDate']?.errors?.pattern    
  }
}


