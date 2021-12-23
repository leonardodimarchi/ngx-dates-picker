import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { NgxDatesPickerCalendarComponent } from '../component/ngx-dates-picker-calendar.component';

@NgModule({
  declarations: [ NgxDatesPickerCalendarComponent ],
  imports: [ CommonModule, FormsModule, NgSlimScrollModule ],
  exports: [ NgxDatesPickerCalendarComponent, CommonModule, FormsModule, NgSlimScrollModule ]
})
export class NgxDatesPickerCalendarModule { }
