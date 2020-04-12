import { DatetimepickerComponent, HideDropDownWhenClickOtherDirective } from './datetimepicker/datetimepicker.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    DatetimepickerComponent,
    HideDropDownWhenClickOtherDirective
  ]
  ,
  exports: [
    DatetimepickerComponent
  ]
})
export class DatetimepickerModule { }
