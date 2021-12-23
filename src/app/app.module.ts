import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxDatesPickerCalendarModule } from '../ngx-dates-picker-calendar/module/ngx-dates-picker-calendar.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxDatesPickerCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
