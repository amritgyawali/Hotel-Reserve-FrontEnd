import { Component } from '@angular/core';
import { Hotel, HotelRoom, Room } from '../../models/models';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'hotel-view',
  templateUrl: './hotel-view.component.html',
  styleUrl: './hotel-view.component.scss'
})
export class HotelViewComponent {

  hotelAndRooms: HotelRoom[] = [];

  constructor(private sanitizer: DomSanitizer, private apiService: ApiService, private snackBar: MatSnackBar) {

    apiService.getHotels().subscribe({
      next: (resHotel: Hotel[]) => {

        apiService.getRooms().subscribe({
          next: (resRoom: Room[]) => {
            this.hotelAndRooms = this.combineHotelsAndRooms(resHotel, resRoom);
          }
        });
      }

    });

  }

  combineHotelsAndRooms(hotels: Hotel[], rooms: Room[]): HotelRoom[] {

    const hotelRoomData: HotelRoom[] = [];

    hotels.forEach(hotel => {
      const hotelRooms: Room[] = rooms.filter(room => room.hotelId === hotel.id);
      const hotelRoomInfo: HotelRoom = {
        hotel: hotel,
        rooms: hotelRooms
      };

      hotelRoomData.push(hotelRoomInfo);
    });

    return hotelRoomData;
  }

  getBase64Image(imageData: string, extension: string): SafeUrl {
    const dataUrl = `data:image/${extension};base64,${imageData}`;
    return this.sanitizer.bypassSecurityTrustUrl(dataUrl);
  }

}
