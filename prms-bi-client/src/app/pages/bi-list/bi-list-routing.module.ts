import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiListComponent } from './bi-list.component';

const routes: Routes = [{ path: '', component: BiListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BiListRoutingModule {}
