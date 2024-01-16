import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: 'bi/:reportName',
    loadChildren: () => import('./pages/bi/bi.module').then((m) => m.BiModule),
  },
  {
    path: 'bi/:reportName/:event',
    loadChildren: () => import('./pages/bi/bi.module').then((m) => m.BiModule),
  },
  {
    path: 'bi-list',
    loadChildren: () =>
      import('./pages/bi-list/bi-list.module').then((m) => m.BiListModule),
  },
  {
    path: 'playground',
    loadChildren: () =>
      import('./pages/playground/playground.module').then(
        (m) => m.PlaygroundModule
      ),
  },
  { path: '**', pathMatch: 'full', redirectTo: 'bi-list' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
