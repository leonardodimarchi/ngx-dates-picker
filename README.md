# ngx-dates-picker-calendar

Angular 2+ calendar datepicker component (With range select), forked from [martre3/ngx-dates-picker](https://github.com/martre3/ngx-dates-picker).

<p align="center">
  <img style="display: inline-block" src="https://user-images.githubusercontent.com/32035250/64512878-033faf00-d2f0-11e9-9fcb-5cbef6112cde.png" width="300">
  <img style="display: inline-block" src="https://user-images.githubusercontent.com/32035250/64523368-d4800380-d304-11e9-8ddf-528216634d98.png" width="300">
  <img style="display: inline-block" src="https://user-images.githubusercontent.com/32035250/64523552-38a2c780-d305-11e9-83ba-7833b2f51e4a.png" width="300">
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/32035250/64512970-384c0180-d2f0-11e9-9bc8-53a8cb77c615.png" width="300">
  <img src="https://user-images.githubusercontent.com/32035250/64591250-0ac78c80-d3b2-11e9-8df5-17cb9c4f51b9.png" width="300">
</p>

## Installation
1. Install package from `npm`.

```sh
npm install ngx-dates-picker-calendar --save
```

| Angular| ngx-dates-picker-calendar |
| ------|:------:|
| >=13.0.0 <14.0.0 | v2.x |
| >=12.0.0 <13.0.0 | v1.x |

2. Include NgxDatesPickerCalendarModule into your application.

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDatesPickerCalendarModule } from 'ngx-dates-picker-calendar';

@NgModule({
  imports: [
    BrowserModule,
    NgxDatesPickerCalendarModule
  ],
  declarations: [ AppComponent ],
  exports: [ AppComponent ]
})
export class AppModule {}
```

## Example
```html
  <ngx-dates-picker-calendar [(ngModel)]="date"></ngx-dates-picker-calendar>
```

## NgModel
Accepted types are date `string`, javascript `Date` object and `DateRange` object (`{start: Date, end: Date}`).
If `selectRange` is `false`, a javascript `Date` object will be returned for selected date, else - `DateRange` object, 
where `range.start` will be equal to `range.end` if one day is selected. 

## Attributes
|Name|Type|Default|Description|
| --- | --- | --- | --- |
|`previousMonthButtonTemplate`|`TemplateRef`|`undefined`|Overrides left arrow used to go one month back.|
|`nextMonthButtonTemplate`|`TemplateRef`|`undefined`|Overrides right arrow used to go to next month.| 
|`options`|object|see [options](#options)||

## <a name="options"></a>Options
```ts
defaultOptions: DatepickerOptions = {
  showNavigationIfMonthIsClicked: false,
  selectRange: true,
  includeDays: 'previous-month', // 'none', 'previous-month', 'next-month', 'all'. Should it render days outside current month.
  minYear: 1970,
  maxYear: 2030,
  barTitleFormat: 'MMMM yyyy',
  dayNamesFormat: 'EEEEE',
  firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
};
```

For available `format` options check out [here](https://date-fns.org/docs/format).

## Locale

To change the locale import it from `date-fns`. For example `import { pt } from 'date-fns/locale'` and pass it to options `options={ locale: pt }`. 

## Run Included Demo

1. Clone this repository

```sh
git clone https://github.com/leonardodimarchi/ngx-dates-picker-calendar.git
cd ngx-dates-picker-calendar
```

2. Install packages

```sh
npm install
```

3. Run Demo

```sh
npm start
```

## Licence

MIT
