import {
  Component, OnInit, Input, HostListener, Directive,
  EventEmitter, Output, OnChanges, SimpleChange, SimpleChanges,
  ViewEncapsulation
} from '@angular/core';



@Directive({
  selector: '[datetime-picker]'
})

export class HideDropDownWhenClickOtherDirective {
  @Output() hideDropDown: EventEmitter<any> = new EventEmitter<any>();
  @HostListener('click', ['$event.target'])
  closeDropDown() {
    var x = event.target['attributes']['dropdown'];
    if (x == null) this.hideDropDown.emit(x);
  }
}

@Component({
  selector: 'app-datetimepicker',
  templateUrl: './datetimepicker.component.html',
  styleUrls: ['./datetimepicker.component.css', './font-awesome-5.2.1-base64.css']
})
export class DatetimepickerComponent implements OnInit, OnChanges {
  @Input() public language: string;
  public languagePack: {[key: string]: any} = {
    vi: {
      weekDay: ['Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'ChN'],
      monthName: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      hour: "Giờ",
      minute: "Phút",
      timePreset: "Cài đặt sẵn"
    },
    en: {
      weekDay: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      monthName: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      hour: "Hour",
      minute: "Min",
      timePreset: "Preset"
    }
  };

  @Input() public show: boolean;
  @Input() public timePickerExcluded: boolean;
  @Input() public initialTime: string;
  @Output() public timeValue: EventEmitter<string> = new EventEmitter<string>();
  @Output() public closeDateTimePicker: EventEmitter<boolean> = new EventEmitter<boolean>();
  public timePreset = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30'];
  public dayArray: Array<iDate> = new Array<iDate>();
  public gridPosition: Array<any> = [
    [0,1,2,3,4,5,6],
    [7,8,9,10,11,12,13],
    [14,15,16,17,18,19,20],
    [21,22,23,24,25,26,27],
    [28,29,30,31,32,33,34],
    [35,36,37,38,39,40,41]
  ]
  public yearSpan: Array<number> = new Array<number>();
  public dropdownOpenYear: boolean = false;
  public dropdownOpenMonth: boolean = false;
  public timeString: string;
  // c: current
  cDay: number;
  cMonth: number;
  cYear: number;
  cHour: string = '00'
  cMinute: string = '00'

  regex = /^((\d\d\d\d)\-([0]{0,1}[1-9]|1[012])\-([1-9]|([012][0-9])|(3[01])))\s(([0-1]?[0-9]|2?[0-3]):([0-5]\d))$/gm;
  regex1 = /^((\d\d\d\d)\-([0]{0,1}[1-9]|1[012])\-([1-9]|([012][0-9])|(3[01])))$/gm;
  constructor() {
    for (let i = 0; i < 42; i += 1) {
      this.dayArray.push(null);
    }
    for (let i = -10; i < 11; i += 1) {
      this.yearSpan.push(i);
    }
    if (['vi', 'en'].indexOf(this.language) < 0) {
      this.language = 'vi'
    }
    this.cDay = (new Date()).getDate();
    this.cMonth = (new Date()).getMonth();
    this.cYear = (new Date()).getFullYear();
    this.setDayArray();
    this.setTimeString();
  }

  
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentItem: SimpleChange = changes.initialTime;
    if (currentItem == null) return
    var item = currentItem.currentValue

    if (!this.timePickerExcluded) {
      if (!this.testRegex(item, this.regex)) item = this.getNowFull();
    }
    else {
      if (!this.testRegex(item, this.regex1)) item = this.getNowFull();
    }


    var a: string, b: string, c: string, d: string, e: string, f: string, g: string, h: string
    a = item as string;
    b = a.split(' ')[0];
    
    d = b.split('-')[0]; this.cYear = Number(d);
    e = b.split('-')[1]; this.cMonth = Number(e) - 1;
    f = b.split('-')[2]; this.cDay = Number(f);
    if (!this.timePickerExcluded) {
      c = a.split(' ')[1];
      g = c.split(':')[0]; this.cHour = g;
      h = c.split(':')[1]; this.cMinute = h;
    }
    this.setDayArray();
    this.setTimeString();

  }

  hideDropdown(event) {
    this.dropdownOpenMonth = false;
    this.dropdownOpenYear = false;
  }

  setDayArray(): void {
    let cMonth1stMd = (new Date(this.cYear, this.cMonth, 1)).getDate();
    let cMonthLastMd = (new Date(this.cYear, this.cMonth + 1, 0)).getDate();
    let cMonth1stWd = (new Date(this.cYear, this.cMonth, 1)).getDay();
    let cMonthLasttWd = (new Date(this.cYear, this.cMonth + 1, 0)).getDay();

    const cMonth1st = new Date(this.cYear, this.cMonth, 1);
    const anchorDate = new Date(this.cYear, this.cMonth, 1, 12, 0, 0, 0);
    var anchorPosition;
    if(cMonth1stWd <= 1) anchorPosition = 6 + cMonth1stWd;
    if(cMonth1stWd > 1) anchorPosition = cMonth1stWd -1;
    this.dayArray[anchorPosition] = {
      year: this.cYear,
      month: this.cMonth,
      day: 1,
      weekDay: cMonth1stWd
    }

    if(anchorPosition > 0){
      for(var i = anchorPosition -1; i >= 0; i -=1){
        var res = anchorDate.getTime() + (i - anchorPosition)*24*60*60*1000
        var nextDate = new Date(res);
        let entry: iDate = {
          year: nextDate.getFullYear(),
          month: nextDate.getMonth(),
          day: nextDate.getDate(),
          weekDay: nextDate.getDay()
        }
      this.dayArray[i] = entry
      }
    }
    for(var j = anchorPosition + 1; j < 42; j +=1){
      var res = anchorDate.getTime() + (j - anchorPosition)*24*60*60*1000
      var nextDate = new Date(res);
      let entry: iDate = {
        year: nextDate.getFullYear(),
        month: nextDate.getMonth(),
        day: nextDate.getDate(),
        weekDay: nextDate.getDay()
      }
      this.dayArray[j] = entry
    }
  }
  weekDayLangPack(lang: string) {
    return this.languagePack[lang]['weekDay'] as []
  }
  public trackByIndex(index: number, obj: any): any {
    return index;
  }

  setCalendarDate(index: number): void{
    this.cDay = this.dayArray[index].day;
    this.cMonth = this.dayArray[index].month;
    this.cYear = this.dayArray[index].year;
    this.setDayArray();
    this.setTimeString();
  }
  setMonth(value: number): void{
    this.toggleDropDownMonth();
    this.cMonth = value;
    this.cDay = 1;
    this.setDayArray();
    this.setTimeString();
  }

  setYear(value: number): void{
    this.toggleDropDownYear();
    this.cYear = value;
    this.cDay = 1;
    this.setDayArray();
    this.setTimeString();
  }

  toggleDropDownMonth():void{
    this.dropdownOpenMonth = !this.dropdownOpenMonth
    if(this.dropdownOpenYear) this.dropdownOpenYear = false;
  }

  toggleDropDownYear():void{
    this.dropdownOpenYear = !this.dropdownOpenYear
    if(this.dropdownOpenMonth) this.dropdownOpenMonth = false;
  }

  prevMonth(): void{
    this.cDay = 1;
    if(this.cMonth == 0) {
      this.cMonth = 11
      this.cYear -= 1
    }
    else{
      this.cMonth -= 1
    }    
    this.setDayArray();
  }
  nextMonth(): void{
    this.cDay = 1;
    if(this.cMonth == 11) {
      this.cMonth = 0
      this.cYear += 1
    }
    else{
      this.cMonth += 1
    }    
    this.setDayArray();
  }

  setTime(time: string): void {
    this.cHour = time.split(':')[0]
    this.cMinute = time.split(':')[1]
    this.setTimeString();
  }
  setTimeString(): void {
    this.timeString = this.cYear + '-' + this.format(this.cMonth + 1) + '-' + this.format(this.cDay)
      + ' ' + this.format(this.cHour) + ':' + this.format(this.cMinute);
    if (this.timePickerExcluded)
      this.timeString = this.cYear + '-' + this.format(this.cMonth + 1) + '-' + this.format(this.cDay)
  }

  format(item: number | any): string {
    var vM
    if (('' + (item)).length < 2) {
      vM = '0' + item
    }
    else {
      vM = '' + item
    }
    if (item === NaN || item === undefined || item === null) vM = '00'
    return vM
  }

  checkKey(prop: string) {
    if (![48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 8, 9, 13].includes(event['keyCode'])) {
      event.preventDefault();
      return;
    }
    if (prop == 'cHour') {
      if (('' + this.cHour).length == 2 && [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(event['keyCode'])) {
        event.preventDefault();
        return;
      }
      if (Number(this.cHour) > 23) {
        this.cHour = '23'
        return;
      }
    }
    if (prop == 'cMinute') {
      if (('' + this.cMinute).length == 2 && [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(event['keyCode'])) {
        event.preventDefault();
        return;
      }
      if (Number(this.cMinute) > 59) {
        this.cHour = '59'
        return;
      }
    }
    
  }

  validate(prop: string) {

    if (prop == 'cHour') {
      if (Number(this.cHour) > 23) {
        this.cHour = '23'
        return;
      }
    }

    if (prop == 'cMinute') {
      if (Number(this.cMinute) > 59) {
        this.cMinute = '59'
        return;        
      }
    }



  }

  validatePaste(prop: string) {
    var x = event['clipboardData'].getData('text');
    if (isNaN(Number(x))) {
      event.preventDefault();
      if (prop == 'cHour') this.cHour = '00'
      if (prop == 'cMinute') this.cMinute = '00'
    }
  }

  cHourChange() {
    if (this.cHour == undefined) this.cHour = '00';
    if (this.cHour !== undefined && this.cHour.length == 0) this.cHour = '00';
    if (this.cHour.length == 1) this.cHour = '0' + this.cHour;
    this.setTimeString();
  }

  cMinuteChange() {
    if (this.cMinute == undefined) this.cMinute = '00';
    if (this.cMinute !== undefined && this.cMinute.length == 0) this.cMinute = '00';
    if (this.cMinute.length == 1) this.cMinute = '0' + this.cMinute;
    this.setTimeString();
  }

  asjustHour(value: number) {
    var x = Number(this.cHour)
    if ((x + value) < 0) {
      this.cHour = '00';
      this.setTimeString();
      return;
    }
    if ((x + value) > 23) {
      this.cHour = '23';
      this.setTimeString();
      return;
    }
    this.cHour = this.format(x + value)
    this.setTimeString();
  }

  asjustMin(value: number) {
    var x = Number(this.cMinute)
    if ((x + value) < 0) {
      this.cMinute = '00';
      this.setTimeString();
      return;
    }
    if ((x + value) > 59) {
      this.cMinute = '59';
      this.setTimeString();
      return;
    }
    this.cMinute = this.format(x + value);
    this.setTimeString();
  }

  testRegex(str: string, reg: RegExp ){
    let m
    while ((m = reg.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === reg.lastIndex) {
        reg.lastIndex++;
      }
    }
    return reg.test(str);
  }



  getNowFull() {
    var x: string = (new Date() as Date).toJSON();
    var y = x.substring(0, 10);
    var z: string = (new Date() as Date).toTimeString();
    var t = z.substring(0, 5);
    if(this.timePickerExcluded) t = '00:00'
    return y + ' ' + t
  }

  emitOutput() {
    this.timeValue.emit(this.timeString);
    this.close();
  }
  close(): void {
    this.closeDateTimePicker.emit(false);
  }

}

interface iDate {
  year: number
  month: number  
  day: number
  weekDay: number
}
