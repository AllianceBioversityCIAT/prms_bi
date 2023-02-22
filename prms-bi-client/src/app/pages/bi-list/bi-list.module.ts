import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BiListRoutingModule } from './bi-list-routing.module';
import { BiListComponent } from './bi-list.component';


@NgModule({
  declarations: [
    BiListComponent
  ],
  imports: [
    CommonModule,
    BiListRoutingModule
  ]
})
export class BiListModule { }
