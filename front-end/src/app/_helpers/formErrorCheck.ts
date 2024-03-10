import { ApiService } from 'src/app/_services';
import {
  AbstractControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Error } from '../_models';

export function ErrorChecker(
  element: Error,
  form: any,
  confirmPassword?: Error
) {
  let touched = form.controls[element.name].touched;
  let minLength = form.controls[element.name].errors?.minlength;
  let maxLength = form.controls[element.name].errors?.maxlength;
  let required = form.controls[element.name].errors?.required;
  let inValid = form.controls[element.name].invalid;
  let valid = form.controls[element.name].valid;
  let isValidEmail = form.controls['emailAddress']?.hasError('email');
  let isValidPhoneNumber = form.controls['phoneNumber']?.hasError('pattern');

  element.isError = Boolean(
    (touched && inValid && required) || minLength || maxLength
  );
  element.check = Boolean(valid);
  element.required = required;

  if (required) {
    element.message = `Please type your ${element.label.toLocaleLowerCase()}`;
  } else if (minLength) {
    if (element.name === 'phoneNumber')
      element.message = `${element.label} must have at least ${minLength.requiredLength} number`;
    else
      element.message = `${element.label} must have at least ${minLength.requiredLength} character`;
  } else if (maxLength) {
    if (element.name === 'phoneNumber')
      element.message = `${element.label} must be within ${maxLength.requiredLength} number`;
    else
      element.message = `${element.label} must be within ${maxLength.requiredLength} character`;
  } else if (isValidEmail && element.name === 'emailAddress') {
    element.isError = true;
    element.message = 'Oops! Invalid email';
  } else if (isValidPhoneNumber && element.label === 'Phone Number') {
    element.isError = true;
    element.message = 'Oops! Invalid phone number';
  } else if (confirmPassword) {
    let password = form.controls['password']?.value;
    // if (element.name === 'password') {
    if (form.controls['password'].errors?.pattern) {
      element.isError = true;
      element.check = false;
      element.message =
        'Your Password should be at least 8 characters in length, contain Lowercase letters, Uppercase letters, Numbers and special characters.';
    }
    // }
    let cPassword = form.controls['confirmPassword']?.value;
    if (password !== cPassword) {
      confirmPassword.isError = true;
      confirmPassword.check = false;
      confirmPassword.message = "Oops! Passwords don't match";
      form.controls['confirmPassword'].setErrors({ NoPasswordMatch: true });
    } else {
      confirmPassword.isError = false;
      confirmPassword.check = true;
      confirmPassword.message = '';
      element.message = '';
      form.controls['confirmPassword'].setErrors(null);
    }
  } else {
    element.message = '';
  }
  let data: Error = {
    name: element.name,
    label: element.label,
    isError: element.isError,
    message: element.message,
    check: element.check,
    required: element.required,
  };
  return data;
}

export function clearForm(form: FormGroup, elements: any) {
  form.reset();
  ErrorChecker(elements.firstName, form);
  ErrorChecker(elements.lastName, form);
  ErrorChecker(elements.phoneNumber, form);
  ErrorChecker(elements.emailAddress, form);
  if (elements.bio) {
    ErrorChecker(elements.bio, form);
    ErrorChecker(elements.tags, form);
    elements.speciality.check = false;
    form.controls['isBackgroundCheck'].setValue(false);
  }
}

export function fromToDate(
  startDate: string,
  endDate: string,
  errorName: string = 'startEndDate'
): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const fromDate = formGroup.get(startDate)?.value;
    const toDate = formGroup.get(endDate)?.value;
    if (fromDate !== null && toDate !== null && fromDate > toDate) {
      return { [errorName]: true };
    }
    return null;
  };
}

export function treatmentDaysError(
  treatmentDays: any[],
  errorName: string = 'treatmentDays'
): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    let isValid = false;
    treatmentDays.forEach((d) => {
      if (d.checked) {
        isValid = true;
      }
    });
    if (!isValid) {
      return { [errorName]: true };
    }
    return null;
  };
}
