import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaygroundRoutingModule } from './playground-routing.module';
import { PlaygroundComponent } from './playground.component';

@NgModule({
  declarations: [PlaygroundComponent],
  imports: [CommonModule, PlaygroundRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PlaygroundModule {}
