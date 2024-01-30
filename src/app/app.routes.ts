import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { HotelViewComponent } from './hotels/hotel-view/hotel-view.component';
import { BookingViewComponent } from './bookings/booking-view/booking-view.component';

export const routes: Routes = [
    {path: "register", component: RegisterComponent},
    {path: "login", component: LoginComponent},
    {path: "hotel-detail", component: HotelViewComponent},
    {path: "my-booking", component: BookingViewComponent},
    {path: "**", component: PageNotFoundComponent}
];
