import { Component } from '@angular/core';
import { Booking, Hotel, HotelRoom, Room } from '../../models/models';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'hotel-view',
  templateUrl: './hotel-view.component.html',
  styleUrl: './hotel-view.component.scss'
})
export class HotelViewComponent {

  today: Date;
  nextDay: Date;

  bookingForm: FormGroup;
  searchDateWise: FormGroup;

  allHomeAndRooms: HotelRoom[] = [];
  hotelAndRooms: HotelRoom[] = [];


  constructor(private sanitizer: DomSanitizer, private apiService: ApiService, private snackBar: MatSnackBar, private fb: FormBuilder) {

    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    this.nextDay = new Date(this.today);
    this.nextDay.setDate(this.today.getDate() + 1);

    this.bookingForm = fb.group({
      fromDate: fb.control(null, [Validators.required, this.dateValidator]),
      toDate: fb.control(null, [Validators.required, this.dateValidator]),
    });

    this.searchDateWise = fb.group({
      fromDate: fb.control(null, [Validators.required, this.dateValidator]),
      toDate: fb.control(null, [Validators.required, this.dateValidator]),
    });

    apiService.getHotels().subscribe({
      next: (resHotel: Hotel[]) => {

        apiService.getRooms().subscribe({
          next: (resRoom: Room[]) => {

            apiService.getBookings().subscribe({

              next: (resBook: Booking[]) => {
                this.allHomeAndRooms = this.combineHotelsAndRooms(resHotel, resRoom, resBook);
                this.hotelAndRooms = [...this.allHomeAndRooms];
              }
            });

          }
        });
      }
    });

  }

  combineHotelsAndRooms(hotels: Hotel[], rooms: Room[], booking: Booking[]): HotelRoom[] {

    const hotelRoomData: HotelRoom[] = [];

    hotels.forEach(hotel => {

      const hotelRooms: Room[] = rooms.filter(room => room.hotelId === hotel.id);
      const bookingInfo: Booking[] = booking.filter(booking => booking.hotelId === hotel.id);

      const hotelRoomInfo: HotelRoom = {
        hotel: hotel,
        rooms: hotelRooms,
        booking: bookingInfo,
      };

      hotelRoomData.push(hotelRoomInfo);
    });

    return hotelRoomData;
  }

  getBase64Image(imageData: string, extension: string): SafeUrl {
    const dataUrl = `data:image/${extension};base64,${imageData}`;
    return this.sanitizer.bypassSecurityTrustUrl(dataUrl);
  }

  dateValidator = (control: any): { [key: string]: boolean } | null => {
    const selectedDate = new Date(control.value);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate < this.today ? { 'dateBeforeToday': true } : null;
  };

  calculateDaysBetweenDates(date1: Date, date2: Date): number {

    const timeDifference = Math.abs(date2.getTime() - date1.getTime());
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    return daysDifference;
  }

  bookNow(hotelId: number, roomId: number, rate: number) {

    const fromDate = this.bookingForm.get('fromDate')?.value;
    const endDate = this.bookingForm.get('toDate')?.value;

    const numberOfDaysDiff = this.calculateDaysBetweenDates(fromDate, endDate);

      console.log(fromDate, endDate, roomId, hotelId);

    const booking = {
      roomId: roomId,
      bookingFrom: fromDate,
      bookingTo: endDate,
      hotelId: hotelId,
      userId: this.apiService.getUserInfo()?.id,
      expAmt: numberOfDaysDiff * rate
    }

    this.apiService.setBooking(booking).subscribe({
      next: res => {
        this.snackBar.open(res.toString(), "Ok");
      }
    });

  }

  filterRoomCategory(value: string) {
    value = value.toLowerCase();
    console.log(value);

    // Create a shallow copy of the original array
    this.hotelAndRooms = [...this.allHomeAndRooms];

    // Filter hotels based on roomTypeMatches
    this.hotelAndRooms = this.hotelAndRooms.filter((eachHotel) => {
      let roomTypeMatches = eachHotel.rooms.some(room => room.roomType.toLowerCase().includes(value));
      return roomTypeMatches;
    });

    // Filter rooms within each hotel
    this.hotelAndRooms.forEach((hotel) => {
      hotel.rooms = hotel.rooms.filter(room => room.roomType.toLowerCase().includes(value));
    });
  }


  filterRoomByDate() {

    const userFromDate: Date = new Date(this.searchDateWise.get('fromDate')?.value);
    const userFromYear = userFromDate.getFullYear();
    const userFromMonth = userFromDate.getMonth();
    const userFromDay = userFromDate.getDate();

    const userToDate: Date = new Date(this.searchDateWise.get('toDate')?.value);
    const userToYear = userToDate.getFullYear();
    const userToMonth = userToDate.getMonth();
    const userToDay = userToDate.getDate();

    this.hotelAndRooms = this.allHomeAndRooms.filter((eachHotels) => {

      if (eachHotels.booking.length > 0) {

        let alreadyBooked = eachHotels.booking.some(eachBookingInfo => {

          let bookFromDate = new Date(eachBookingInfo.bookingFrom);
          let bookToDate = new Date(eachBookingInfo.bookingTo);

          const bookFromYear = bookFromDate.getFullYear();
          const bookFromMonth = bookFromDate.getMonth();
          const bookFromDay = bookFromDate.getDate();

          const bookToYear = bookToDate.getFullYear();
          const bookToMonth = bookToDate.getMonth();
          const bookToDay = bookToDate.getDate();

          const isOverlap =
            (userFromYear <= bookToYear && userToYear >= bookFromYear) &&
            (userFromMonth <= bookToMonth && userToMonth >= bookFromMonth) &&
            (userFromDay <= bookToDay && userToDay >= bookFromDay);

          console.log(isOverlap);
          return isOverlap;
        });

        return !alreadyBooked;
      }

      return true;
    });
  }

}
