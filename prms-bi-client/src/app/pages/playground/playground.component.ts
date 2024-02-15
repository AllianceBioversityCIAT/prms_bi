import { Component } from '@angular/core';
declare var pbiwidget: any;

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent {
  ngOnInit(): void {
    // pbiwidget.init('dashboard-embed');
    // pbiwidget.setFilters({ resultType: 'Capacity change', year: 2022 });
    pbiwidget.init('dashboard-embed', {
      // resultType: 'Capacity change',
      year: 2022,
      reportName:'type-1-report-dashboard_dev',
      // mainPage:''
      // sectionNumber: 5
    });
    // pbiwidget.setFilters();
  }
}
