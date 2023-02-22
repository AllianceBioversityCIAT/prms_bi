import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: 'bi',
    loadChildren: () => import('./pages/bi/bi.module').then((m) => m.BiModule),
  },
  {
    path: 'bi-list',
    loadChildren: () =>
      import('./pages/bi-list/bi-list.module').then((m) => m.BiListModule),
  },
  { path: '**', pathMatch: 'full', redirectTo: 'bi' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
