
import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Booking, User } from '../../models/models';

import { jsPDF } from 'jspdf';

@Component({
  selector: 'booking-view',
  templateUrl: './booking-view.component.html',
  styleUrls: ['./booking-view.component.scss']
})

export class BookingViewComponent {

  userTransactionList: Booking[] = [];

  constructor(private apiService: ApiService) {
    let user = apiService.getUserInfo();

    if (user) {
      this.apiService.getSpecificBookings(user?.id).subscribe({
        next: (res: Booking[]) => {
          this.userTransactionList = res;
          console.log(this.userTransactionList);
        }
      });
    }
  }

  generatePdf() {
    const user = this.apiService.getUserInfo();

    // Check if there are transactions
    if (this.userTransactionList.length === 0) {
      console.warn('No transactions to generate invoice for.');
      return;
    }

    const doc = new jsPDF();

    // Customer information
    doc.text(`Customer Information: ${user?.firstName} ${user?.lastName}`, 10, 10);
    
    let yOffset = 30; 
    this.userTransactionList.forEach((transaction, index) => {
      const bookingDetails = `Booking ${index + 1}:
        Room ID: ${transaction.roomId}
        Booking From: ${transaction.bookingFrom}
        Booking To: ${transaction.bookingTo}
        Hotel ID: ${transaction.hotelId}
        Expense Amount: ${transaction.expAmt}`;

      doc.text(bookingDetails, 10, yOffset);
      yOffset += 50; 
    });

    const totalCost = this.calculateTotalCost();
    if (this.userTransactionList.length > 2) {

      doc.text(`Total Cost With 5% Discount: ${totalCost}`, 10, yOffset + 20);
    }
    else {
      doc.text(`Total Cost: ${totalCost}`, 10, yOffset + 20);
    }

    doc.save('invoice.pdf');
  }

  private calculateTotalCost(): number {

    const numberOfRooms = this.userTransactionList.length;
    const totalCost = this.userTransactionList.reduce((acc, transaction) => acc + transaction.expAmt, 0);

    return numberOfRooms >= 3 ? totalCost * 0.95 : totalCost;
  }
}