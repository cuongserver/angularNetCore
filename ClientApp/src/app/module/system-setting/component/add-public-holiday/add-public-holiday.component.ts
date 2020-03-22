import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { moduleHttpOptions, fadeAnimation } from '@app/module/system-setting/module-resource';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  constructor(private formBuilder: FormBuilder, private http: HttpClient,
    private router: Router, private jwtHelper: JwtHelperService,
    private dialogService: DialogService,
    private dialog: MatDialog, private loader: LoaderService) {
    this.thisForm = this.formBuilder.group({
      calendarDate: [''],
      description: ['']
    });

    
  }

  ngAfterViewInit() {
    $('input[datetimepicker]').datetimepicker({
      theme: 'dark',
      timepicker: false,
      format: 'Y/m/d',
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

  submitForm() {

  }


}

export function getCachedLanguage(): string {
  let langOptions: string[] = (['vi', 'en']);
  let cachedLang = localStorage.getItem('pageLanguage');
  return langOptions.includes(cachedLang) && cachedLang !== null ? cachedLang : 'vi';
}
