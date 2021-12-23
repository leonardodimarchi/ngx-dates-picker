//#region Imports

import { Component } from '@angular/core';
import { DatepickerOptions, DateRange } from '../ngx-dates-picker-calendar/component/ngx-dates-picker-calendar.component';
import { ptBR } from 'date-fns/locale';

//#endregion

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public showingDate: string = new Date().toLocaleDateString();

  public date: Date | DateRange = new Date();

  public options: DatepickerOptions = {
    showNavigationIfMonthIsClicked: false,
    selectRange: true,
    includeDays: 'previous-month', // 'none', 'previous-month', 'next-month', 'all'. Should it render days outside current month.
    minYear: 1970,
    maxYear: 2030,
    barTitleFormat: 'MMMM yyyy',
    dayNamesFormat: 'EEEEE',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: ptBR,
  };

  public formatDisplay(): void {
    if ('start' in this.date) {
      this.showingDate = 'Start: ' + this.date.start.toLocaleDateString() + ' - End: ' + this.date.end.toLocaleDateString();
    } else {
      this.showingDate = this.date.toLocaleDateString();
    }
  }
}
