import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { HotelViewComponent } from './hotels/hotel-view/hotel-view.component';

/*
              this.navItems = [
                { value: 'My Hotels', link: '/my-hotel' },
                { value: 'Pending Room', link: '/pending-room' },
                { value: 'Conformed Room', link: '/conform-room' },
              ];
              router.navigateByUrl("/my-hotel");
            }
            else if (user.userType === "USER") {
              this.panelName = "CUSTOMER"
              this.navItems = [
                { value: 'Hotel Detail', link: '/hotel-detail' },
                { value: 'Pending Booking', link: '/pending-order' },
                { value: 'Conformed Booking', link: '/conform-order' },
              ];
              router.navigateByUrl("/hotel-detail");
            }
          }
*/
export const routes: Routes = [
    {path: "register", component: RegisterComponent},
    {path: "login", component: LoginComponent},
    {path: "hotel-detail", component: HotelViewComponent},
    {path: "**", component: PageNotFoundComponent}
];
