import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

export interface NavigationItem {
  value: string;
  link: string;
}

@Component({
  selector: 'page-side-nav',
  templateUrl: './page-side-nav.component.html',
  styleUrl: './page-side-nav.component.scss'
})
export class PageSideNavComponent {

  panelName: string = '';
  userName: string = '';
  navItems: NavigationItem[] = [];
  userLoggedIn: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {

    apiService.userStatus.subscribe({

      next: status => {
        if (status === 'loggedIn') {

          this.userLoggedIn = true;
          let user = apiService.getUserInfo();
          this.userName = `${user?.firstName} ${user?.lastName}`;

          if (user !== null) {

            if (user.userType === "USER") {

              this.panelName = "CUSTOMER";
              this.navItems = [
                { value: 'Hotel Detail', link: '/hotel-detail' },
                { value: 'My Booking', link: '/my-booking' },
              ];
              router.navigateByUrl("/hotel-detail");
            }
          }
        }
        else if (status === 'loggedOff') {

          this.userLoggedIn = false;
          this.userName = '';
          this.panelName = "GUEST VIEW";

          this.navItems = [];
          router.navigateByUrl("/login");
        }
      }
    })
  }

  logout() {
    this.apiService.logOut();
  }

}
