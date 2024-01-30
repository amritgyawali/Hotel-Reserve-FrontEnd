import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';
import { Booking, Hotel, Room, User } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl: string = "https://localhost:7158/api/Reservation/";
  userStatus: Subject<string> = new Subject();

  constructor(private http: HttpClient, private jwt: JwtHelperService) {

  }
  register(user: any) {

    return this.http.post(this.baseUrl + "Register", user, {
      responseType: 'text',
    })
  }

  login(info: any) {

    let params = new HttpParams().append("email", info.email).append('password', info.password).append('accountType', info.userType);

    return this.http.get(this.baseUrl + 'Login', {
      params: params,
      responseType: 'text',
    })
  }

  isLoggedIn(): boolean {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('access_token') !== null && !this.jwt.isTokenExpired()) {
      return true;
    }

    return false;
  }

  getUserInfo(): User | null {

    if (!this.isLoggedIn()) {
      return null;
    }

    var decodedToken = this.jwt.decodeToken();
    var user: User = {
      id: decodedToken.id,
      firstName: decodedToken.firstName,
      lastName: decodedToken.lastName,
      email: decodedToken.email,
      password: '',
      createdOn: decodedToken.createdOn,
      userType: decodedToken.userType,
      accountStatus: decodedToken.accountStatus,
    };

    return user;
  }

  logOut(){
    localStorage.removeItem("access_token");
    this.userStatus.next("loggedOff");
  }

  getHotels(){
    return this.http.get<Hotel[]>(this.baseUrl + 'GetHotels');
  }

  getRooms(){
    return this.http.get<Room[]>(this.baseUrl + 'GetRooms');
  }

  getBookings(){

    return this.http.get<Booking[]>(this.baseUrl + 'GetBookings');
  }

  getSpecificBookings(userId: number) {
    const params = new HttpParams().append('userId', userId);

    return this.http.get<Booking[]>(this.baseUrl + 'GetSpecificBookings', { params });
  }

  setBooking(booking: any){

    console.log(booking);

    return this.http.post(this.baseUrl + "SetBookings", booking, {
      responseType: 'text',
    });

  }

}
