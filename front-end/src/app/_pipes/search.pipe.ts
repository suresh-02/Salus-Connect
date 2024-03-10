import { Provider } from '../_models';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'providerSearch',
})
export class ProviderSearchPipe implements PipeTransform {
  transform(providers: readonly Provider[], searchValue: string): any {
    if (!providers || !searchValue) {
      return providers;
    }

    return providers.filter(
      // tslint:disable-next-line: no-shadowed-variable
      (provider) =>
        provider.providerName
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        provider.postalCode.toLowerCase().includes(searchValue.toLowerCase()) ||
        provider.city.toLowerCase().includes(searchValue.toLowerCase()) ||
        provider.stateAbbr
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        provider.providerType
          .toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        provider.specialtyName
          .toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase())
    );
  }
}

// For numbers
// employees.phoneNo.toString().toLowerCase().includes(searchValue.toLowerCase());
