import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: 'bi',
    loadChildren: () => import('./pages/bi/bi.module').then((m) => m.BiModule),
  },
  {
    path: 'bi/:id',
    loadChildren: () => import('./pages/bi/bi.module').then((m) => m.BiModule),
  },
  {
    path: 'bi/:id/:filtervalue',
    loadChildren: () => import('./pages/bi/bi.module').then((m) => m.BiModule),
  },
  { path: '**', pathMatch: 'full', redirectTo: 'bi' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
