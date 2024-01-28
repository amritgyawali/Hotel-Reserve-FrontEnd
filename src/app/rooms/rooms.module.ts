import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomViewComponent } from './room-view/room-view.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    RoomViewComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RoomsModule { }
