import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  transform(array: any, type: boolean): any[] {
    let direction = type ? 1 : -1;

    array.sort((a: any, b: any) => {
      if (a < b) {
        return -1 * direction;
      } else if (a > b) {
        return 1 * direction;
      } else {
        return 0;
      }
    });
    console.log(array);
    return array;
  }
}

@Pipe({
  name: 'sortTime',
})
export class TimePipe implements PipeTransform {
  transform(array: any): any[] {
    array.sort(function (a: any, b: any) {
      a = new Date('1970/01/01 ' + a);
      b = new Date('1970/01/01 ' + b);
      return a - b;
    });
    return array;
  }
}
