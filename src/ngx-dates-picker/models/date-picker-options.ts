export interface DatepickerOptions {
  includeDays?: 'none' | 'previous-month' | 'next-month' | 'all';
  includeNextMonthsFirstFullWeek?: boolean;
  minYear?: number; // default: current year - 30
  maxYear?: number; // default: current year + 30
  displayFormat?: string; // default: 'MMM D[,] YYYY'
  barTitleFormat?: string; // default: 'MMMM YYYY'
  dayNamesFormat?: string; // default 'ddd'
  barTitleIfEmpty?: string;
  selectRange?: boolean;
  firstCalendarDay?: number; // 0 = Sunday (default), 1 = Monday, ..
  locale?: object;
  minDate?: Date;
  maxDate?: Date;
}
