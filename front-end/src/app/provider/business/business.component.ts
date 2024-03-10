import { trigger, transition, style, animate } from '@angular/animations';
import { Doctor } from './../../_models';
import { ApiService } from './../../_services/api.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { TokenStorageService } from 'src/app/_services';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
  animations: [
    trigger('fade', [
      transition('* <=> *', [style({ opacity: 0 }), animate(600)]),
    ]),
  ],
})
export class BusinessComponent implements OnInit {
  doctor = this.token.getDoctor();
  user = this.token.getUser();

  providers: Doctor[] = [];
  facilityId = -1;

  tab = 0;

  openMap: { [name: string]: boolean } = {
    sub1: true,
    sub2: false,
  };

  isAllSelected: boolean;

  isActive = (path: string): boolean => {
    return this.router.url.includes(path);
  };

  constructor(
    private client: ApiService,
    private token: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((qp) => {
      if (Number(qp.docId) === -1) this.isAllSelected = true;
      else this.isAllSelected = false;
    });
    this.router.events.subscribe((r) => {
      if (r instanceof NavigationEnd) {
        if (this.isActive('appointment')) {
          this.openMap.sub1 = true;
          this.openMap.sub2 = false;
        }
        if (this.isActive('revenue')) {
          this.openMap.sub2 = true;
          this.openMap.sub1 = false;
        }
        if (this.isActive('subscription')) this.tab = 1;
        if (this.isActive('dashboard')) this.tab = 0;
      }
    });
  }

  ngOnInit(): void {
    if (this.user.role.roleName === 'SupportStaff')
      this.client.getStaffDoctor(this.user.userId).subscribe((res) => {
        this.providers = res.data;
        if (res.data[0].facilityId) this.facilityId = res.data[0].facilityId;
      });
  }

  prepareRoute(outlet: RouterOutlet) {
    if (outlet.activatedRoute.snapshot.url.length >= 1)
      return outlet.activatedRoute.snapshot.url;
    return false;
  }

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }
}
