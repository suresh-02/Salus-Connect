import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { ApiService, TokenStorageService } from 'src/app/_services';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-provider-search',
  templateUrl: './provider-search.component.html',
  styleUrls: ['./provider-search.component.scss'],
})
export class ProviderSearchComponent implements OnInit {
  @Output('search') search = new EventEmitter<any>();
  @Output('searchData') searchData = new EventEmitter<any>();
  @Input('initialSearch') initialSearch: any;
  @Input('isSearch') isSearch = false;

  specialties: any[] = [];
  tempSpecialties: any[] = [];
  speOrProviders: any[] = [];
  searchedProvider: any[] = [];
  cities: any[] = [];

  searchChange$ = new BehaviorSubject('');
  speOrProvidersLoading = false;
  locationSearchChange$ = new BehaviorSubject('');
  cityLoading = false;

  searchForm: FormGroup;

  disabledEndDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) < 0;

  constructor(
    private client: ApiService,
    private fb: FormBuilder,
    private token: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      selectedSpecialtyOrProvider: [null, [Validators.required]],
      selectedCity: [null, [Validators.required]],
      selectedDate: [null, [Validators.required]],
    });
    this.searchForm.controls.selectedSpecialtyOrProvider.valueChanges.subscribe(
      (value: string) => {
        if (value)
          if (!value.startsWith('s-'))
            this.searchForm.controls.selectedCity.disable();
          else this.searchForm.controls.selectedCity.enable();
      }
    );
    if (this.initialSearch) this.token.saveSearched(this.initialSearch);

    let searched = this.token.getSearched();
    if (searched) {
      this.initialSearch = searched;
    }

    if (this.initialSearch) {
      this.locationSearchChange$.next(
        this.initialSearch.selectedCity?.split(',')[0]
      );
      this.searchChange$.next(this.initialSearch.selectedSpecialtyOrProvider);
      this.sf.selectedSpecialtyOrProvider.setValue(
        this.initialSearch.selectedSpecialtyOrProvider
      );

      this.sf.selectedCity.setValue(this.initialSearch.selectedCity);
      this.sf.selectedDate.setValue(new Date(this.initialSearch.selectedDate));
      this.searchData.emit(this.searchForm.value);
      this.token.removeSearched();
      this.token.saveSearched(this.searchForm.value);
    }

    this.searchChange$.pipe(debounceTime(500)).subscribe({
      next: (search) => {
        if (search)
          this.client.getSpecialtyOrProvider(search).subscribe((data) => {
            this.loadSpecialty();
            this.searchedProvider = data;
            this.speOrProviders = [
              ...this.searchedProvider,
              ...this.specialties,
            ];
            this.speOrProvidersLoading = false;
          });
        else {
          this.speOrProviders = [...this.searchedProvider, ...this.specialties];
          if (
            !search &&
            !this.searchForm.controls.selectedSpecialtyOrProvider.value
          )
            this.speOrProviders = this.specialties;
          this.speOrProvidersLoading = false;
        }
      },
      error: (err) => (this.speOrProvidersLoading = false),
    });

    this.locationSearchChange$.pipe(debounceTime(500)).subscribe({
      next: (search) => {
        if (search)
          this.client.getProviderCities(search).subscribe((data) => {
            console.log(data);
            this.cities = data;
            this.cityLoading = false;
          });
        else this.cityLoading = false;
      },
      error: (err) => (this.cityLoading = false),
    });
  }

  get sf(): { [key: string]: AbstractControl } {
    return this.searchForm.controls;
  }

  getSearchBack() {
    let value = this.searchForm.controls.selectedSpecialtyOrProvider.value;
    if (!value?.startsWith('s-')) {
      this.speOrProvidersLoading = true;
      this.searchChange$.next(value);
    }
  }

  searchCity(search: string) {
    if (search) {
      this.cityLoading = true;
      this.locationSearchChange$.next(search);
    }
  }

  loadSpecialty() {
    if (this.speOrProviders.length <= 0)
      this.client.getSpecialtyOrProvider('').subscribe((data) => {
        this.speOrProviders = data;
        this.specialties = data;
        this.tempSpecialties = data;
      });
  }

  searchSpeAndProviders(search: string) {
    this.speOrProvidersLoading = true;
    this.sortSpecialty(search);
    this.searchChange$.next(search);
  }

  sortSpecialty(search: string) {
    let searched = this.tempSpecialties.filter(
      (sp: { value: string; label: string }) =>
        sp.label.toLocaleLowerCase().startsWith(search.toLocaleLowerCase())
    );
    this.specialties = this.specialties.filter(
      (sp) =>
        !sp.label.toLocaleLowerCase().startsWith(search.toLocaleLowerCase())
    );
    this.specialties = [...searched, ...this.specialties];
  }

  emitSearch() {
    if (this.isSearch) {
      this.searchData.emit(this.searchForm.value);
    } else {
      this.search.emit(this.searchForm.value);
    }
  }
}
