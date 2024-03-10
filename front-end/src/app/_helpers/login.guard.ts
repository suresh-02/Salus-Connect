import { TokenStorageService } from 'src/app/_services';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(public router: Router, private token: TokenStorageService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.token.getToken() === 'null') {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
}
@Injectable({
  providedIn: 'root',
})
export class LoginPageGuard implements CanActivate {
  constructor(public router: Router, private token: TokenStorageService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.token.getToken() === 'null') {
      return true;
    } else {
      let user = this.token.getUser();
      if (user?.role?.roleName === 'Patient') this.router.navigate(['/home']);
      else this.router.navigate(['/provider/home']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class ResetGuard implements CanActivate {
  constructor(public router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (route.queryParams.id) {
      return true;
    } else {
      this.router.navigate(['/forgot-password']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class BookingGuard implements CanActivate {
  constructor(public router: Router, private token: TokenStorageService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.token.getAppointment()) {
      return true;
    } else {
      this.router.navigate(['/search-doctor']);
      return false;
    }
  }
}
