//#region Imports

import { Component, ElementRef, forwardRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDate,
  getDay,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameMonth,
  isToday,
  setDay,
  setMonth,
  setYear,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
import { ISlimScrollOptions } from 'ngx-slimscroll';
import { createDateRange, isNil, isSameDate } from '../helpers';
import { DatepickerOptions, DateRange, Day, DayClass } from '../models';

//#endregion

export { DatepickerOptions, DateRange };

@Component({
  selector: 'ngx-dates-picker',
  templateUrl: 'ngx-dates-picker.component.html',
  styleUrls: ['ngx-dates-picker.component.sass'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgxDatesPickerComponent), multi: true },
  ],
})
export class NgxDatesPickerComponent implements ControlValueAccessor, OnInit, OnChanges {

  constructor() {
    this.scrollOptions = {
      barBackground: '#DFE3E9',
      gridBackground: '#FFFFFF',
      barBorderRadius: '3',
      gridBorderRadius: '3',
      barWidth: '6',
      gridWidth: '6',
      barMargin: '0',
      gridMargin: '0',
    };
  }

  //#region ViewChild and ViewChildren

  @ViewChild('container') calendarContainerElement: ElementRef;
  @ViewChild('inputElement') inputElement: ElementRef;

  //#endregion

  //#region Inputs

  @Input() options: DatepickerOptions;
  @Input() previousMonthButtonTemplate: TemplateRef<any>;
  @Input() nextMonthButtonTemplate: TemplateRef<any>;

  //#endregion

  //#region Properties

  private currentOptions: DatepickerOptions = {
    includeDays: 'previous-month',
    includeNextMonthsFirstFullWeek: false,
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MMM dd, yyyy',
    barTitleFormat: 'MMMM yyyy',
    dayNamesFormat: 'EEE',
    showNavigationIfMonthIsClicked: false,
    selectRange: false,
    firstCalendarDay: 0,
    locale: {},
  };

  public barTitle: string;
  public view: 'days' | 'months' | 'years';
  public years: { year: number; isThisYear: boolean }[];
  public months: { month: number; name: string; isSelected: boolean }[];
  public dayNames: string[];
  public scrollOptions: ISlimScrollOptions;
  public days: Day[];

  private disabled: boolean;
  private viewingDate: Date;
  private _range: DateRange;

  set range(val: DateRange | undefined) {
    this._range = val;

    this.onChangeCallback(this.getValueToEmit(val));
  }

  get range(): DateRange | undefined {
    return this._range;
  }

  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  //#endregion

  //#region Methods

  public ngOnInit(): void {
    this.view = 'days';

    this.range = {
      start: new Date(),
      end: new Date(),
    };

    this.viewingDate = new Date();

    this.initDayNames();
    this.initYears();
    this.initMonths();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!('options' in changes)) {
      return;
    }

    this.updateOptions(changes.options.currentValue);
    this.initDayNames();
    this.init();
    this.initYears();
    this.initMonths();
  }

  private updateOptions(options: DatepickerOptions): void {
    this.currentOptions = {
      ...this.currentOptions,
      ...options,
    };
  }

  public nextMonth(): void {
    this.viewingDate = addMonths(this.viewingDate, 1);
    this.init();
  }

  public prevMonth(): void {
    this.viewingDate = subMonths(this.viewingDate, 1);
    this.init();
  }

  public setDate(i: number): void {
    const date = this.days[i].date;

    if (this.currentOptions.selectRange) {
      if (!this.range.start && !this.range.end) {
        this.range.start = date;
      } else {
        if (this.range.start && !this.range.end && isAfter(date, this.range.start)) {
          this.range.end = date;
        } else {
          this.range.end = undefined;
          this.range.start = date;
        }
      }
    } else {
      this.range.start = this.range.end = date;
    }

    this.init();
    this.onChangeCallback(this.getValueToEmit(this.range));
  }

  public setYear(i: number): void {
    this.viewingDate = setYear(this.viewingDate, this.years[i].year);
    this.init();
    this.initYears();
    this.view = 'months';
  }

  public setMonth(i: number): void {
    this.viewingDate = setMonth(this.viewingDate, this.months[i].month);
    this.init();
    this.initMonths();
    this.view = 'days';
  }

  private init(): void {
    if (!this.viewingDate) {
      return;
    }

    const start = startOfMonth(this.viewingDate);
    const end = endOfMonth(this.viewingDate);

    this.days = eachDayOfInterval({ start, end }).map((date) => this.formatDay(date));

    const firstMonthDay = getDay(start) - this.currentOptions.firstCalendarDay;
    const prevDays = firstMonthDay < 0 ? 7 - this.currentOptions.firstCalendarDay : firstMonthDay;
    let nextDays = (this.currentOptions.firstCalendarDay === 1 ? 7 : 6) - getDay(end);

    const showPrevMonthDays = this.currentOptions.includeDays === 'all' || this.currentOptions.includeDays === 'previous-month';
    const showNextMonthDays = this.currentOptions.includeDays === 'all' || this.currentOptions.includeDays === 'next-month';

    if (showNextMonthDays && this.currentOptions.includeNextMonthsFirstFullWeek) {
      nextDays += 7;
    }

    for (let i = 1; i <= prevDays; i++) {
      this.days.unshift(this.formatDay(subDays(start, i), showPrevMonthDays));
    }

    new Array(nextDays).fill(undefined)
      .forEach((_, i) => this.days.push(this.formatDay(addDays(end, i + 1), showNextMonthDays)));

    this.barTitle = format(this.viewingDate, this.currentOptions.barTitleFormat, this.currentOptions.locale);
  }

  private initYears(): void {
    const range = this.currentOptions.maxYear - this.currentOptions.minYear;

    this.years = Array.from(new Array(range), (x, i) => i + this.currentOptions.minYear).map((year) => {
      return { year: year, isThisYear: year === getYear(this.viewingDate) };
    });
  }

  private initMonths(): void {
    this.months = Array.from(new Array(12), (x, i) => setMonth(new Date(), i + 1))
      .map((date) => {
        return { month: date.getMonth(), name: format(date, 'MMM'), isSelected: date.getMonth() === getMonth(this.viewingDate) };
      });
  }

  private initDayNames(): void {
    this.dayNames = [];
    const start = this.currentOptions.firstCalendarDay;

    for (let i = start; i <= 6 + start; i++) {
      const date = setDay(new Date(), i);

      this.dayNames.push(format(date, this.currentOptions.dayNamesFormat, this.currentOptions.locale));
    }
  }

  public toggleView(): void {
    if (!this.currentOptions.showNavigationIfMonthIsClicked) {
      return;
    }

    this.view = this.view === 'days' ? 'years' : 'days';
  }

  public writeValue(val: DateRange | Date | string | undefined) {
    if (val) {
      if (typeof val === 'string') {
        this.range.start = this.range.end = new Date(val);
      } else {
        if (val instanceof Date) {
          this.range.start = this.range.end = val;
        } else {
          if (val.start) { // Checking if it's instance of DateRange
            this.range = val;
          } else {
            throw Error('Invalid input data type');
          }
        }
      }

      this.viewingDate = this.range.start || this.viewingDate;

      this.init();
    }
  }

  public registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  formatDay = (date: Date, isVisible: boolean = true): Day => (
    {
      date: date,
      day: getDate(date),
      month: getMonth(date),
      year: getYear(date),
      inThisMonth: isSameMonth(date, this.viewingDate),
      isToday: isVisible && isToday(date),
      isSelected: isVisible && this.isDateSelected(date),
      isInRange: isVisible && this.isInRange(date),
      isSelectable: isVisible && this.isDateSelectable(date),
      isStart: isVisible && this.isRangeBoundary(date, 'start'),
      isEnd: isVisible && this.isRangeBoundary(date, 'end'),
      isVisible,
    }
  )

  public getDayClasses(day: Day): DayClass {
    return {
      'is-prev-month': !day.inThisMonth,
      'is-today': day.isToday,
      'is-selected': day.isSelected,
      'is-in-range': day.isInRange,
      'is-disabled': !day.isSelectable,
      'range-start': day.isStart,
      'range-end': day.isEnd,
      'is-visible': day.isVisible,
    };
  }

  /**
   * Checks if specified date is in range of min and max dates
   * @param date
   */
  private isDateSelectable(date: Date): boolean {
    const minDateSet = !isNil(this.currentOptions.minDate);
    const maxDateSet = !isNil(this.currentOptions.maxDate);
    const timestamp = date.valueOf();

    return (!(minDateSet && timestamp < this.currentOptions.minDate.valueOf()) ||
      (!(maxDateSet && timestamp > this.currentOptions.maxDate.valueOf())));
  }

  private isDateSelected(date: Date): boolean {
    return isSameDate(date, this.range.start) || isSameDate(date, this.range.end);
  }

  private isInRange(date: Date): boolean {
    return this.isDateSelected(date) || (isAfter(date, this.range.start) && isBefore(date, this.range.end));
  }

  private isRangeBoundary(date: Date, boundary: 'start' | 'end'): boolean {
    return !this.range[boundary] || isSameDate(date, this.range[boundary]);
  }

  private getValueToEmit(range: DateRange): DateRange | Date {
    if (!this.currentOptions.selectRange) {
      return new Date(range.start.getTime());
    }

    if (range.end) {
      return createDateRange(range.start, range.end);
    }

    return createDateRange(range.start, range.start);
  }

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };
}
