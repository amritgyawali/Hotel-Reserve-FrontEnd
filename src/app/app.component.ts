import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from '@angular/common';
import { ApiService } from './shared/services/api.service';
import { BookingsModule } from './bookings/bookings.module';
import { HotelsModule } from './hotels/hotels.module';
import { RoomsModule } from './rooms/rooms.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SharedModule, AuthModule, HotelsModule, RoomsModule, BookingsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit{

  ngOnInit(): void {
    
    let status = this.apiService.isLoggedIn() ? 'loggedIn' : 'loggedOff';
    this.apiService.userStatus.next(status);
  }

  title = 'UI';

  constructor(private apiService: ApiService){}
}
