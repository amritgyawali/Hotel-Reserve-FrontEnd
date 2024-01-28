import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelViewComponent } from './hotel-view/hotel-view.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    HotelViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class HotelsModule { }
