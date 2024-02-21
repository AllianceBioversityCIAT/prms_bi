import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhitePageRoutingModule } from './white-page-routing.module';
import { WhitePageComponent } from './white-page.component';


@NgModule({
  declarations: [
    WhitePageComponent
  ],
  imports: [
    CommonModule,
    WhitePageRoutingModule
  ]
})
export class WhitePageModule { }
