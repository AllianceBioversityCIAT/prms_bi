import { Component } from '@angular/core';
import { BiImplementationService } from '../../services/bi-implementation.service';
import { FiltersByDashboardService } from '../../services/filters-by-dashboard.service';
@Component({
  selector: 'app-bi-list',
  templateUrl: './bi-list.component.html',
  styleUrls: ['./bi-list.component.scss'],
})
export class BiListComponent {
  reportsInformation: any[] = [];

  constructor(
    private biImplementationSE: BiImplementationService,
    private filtersByDashboardSE: FiltersByDashboardService
  ) {}
  ngOnInit(): void {
    this.getBiReportsWithCredentials();
  }
  getBiReportsWithCredentials() {
    this.biImplementationSE.getBiReports().subscribe((resp) => {
      this.reportsInformation = resp;
    });
  }

  getFilterData(report: any) {
    let filtersFunded = this.filtersByDashboardSE.filters.filter(
      (filter) => filter.reportName == report.report_name
    );

    let data = `<strong>Quantity of filters:</strong> ${
      filtersFunded?.length || 0
    }<br> <strong>filter names:</strong>`;
    filtersFunded.forEach((filter: any) => {
      data += `<br>${filter?.filterData?.valueAttr}`;
    });
    return data;
  }
}
