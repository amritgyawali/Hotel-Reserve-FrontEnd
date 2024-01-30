export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdOn: Date;
    userType: string;
    accountStatus: AccountStatus;
}

export enum AccountStatus {

    UNAPPROVED,
    APPROVED
}

export interface Hotel {
  id: number;
  name: string;
  description: string;
  visibility: boolean;
  userId: number;
  image: Uint8Array;
  imageExtension: string;
}

export interface Room {
  id: number;
  hotelId: number;
  image: Uint8Array;
  imageExtension: string;
  description: string;
  roomType: string;
  roomPrice: number;
}

export interface HotelRoom {
  hotel: Hotel;
  rooms: Room[];
  booking: Booking[];
}


export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  bookingFrom: Date;
  bookingTo: Date;
  hotelId: number;
  expAmt: number
}

