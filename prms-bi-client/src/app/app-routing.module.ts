import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiModule } from './pages/bi/bi.module';

const routes: Routes = [
  {
    path: 'bi/:id',
    loadChildren: () => import('./pages/bi/bi.module').then((m) => m.BiModule),
  },
  // { path: '**', pathMatch: 'full', redirectTo: 'bi' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
