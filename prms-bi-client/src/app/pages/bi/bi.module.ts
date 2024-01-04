import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BiRoutingModule } from './bi-routing.module';
import { BiComponent } from './bi.component';
import { LoaderModule } from 'src/app/components/loader/loader.module';

@NgModule({
  declarations: [BiComponent],
  imports: [CommonModule, BiRoutingModule, LoaderModule],
})
export class BiModule {}
