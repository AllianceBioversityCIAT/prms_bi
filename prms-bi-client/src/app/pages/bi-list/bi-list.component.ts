import { Component } from '@angular/core';
import { BiImplementationService } from '../../services/bi-implementation.service';

@Component({
  selector: 'app-bi-list',
  templateUrl: './bi-list.component.html',
  styleUrls: ['./bi-list.component.scss'],
})
export class BiListComponent {
  reportsInformation: any[] = [];
  burnedReportsList: any[] = [
    {
      reportName: 'results-dashboard',
      id: 3,
      queryParams: {
        year: '2022',
      },
    },
    {
      reportName: 'type-1-report-dashboard',
      id: 4,
      queryParams: {
        official_code: 'INIT-03',
      },
    },
    {
      reportName: 'result-dashboard_test',
      id: 5,
      queryParams: {
        year: '2022',
      },
    },
  ];
  constructor(private biImplementationSE: BiImplementationService) {}
  ngOnInit(): void {
    this.getBiReportsWithCredentials();
  }
  getBiReportsWithCredentials() {
    this.biImplementationSE.getBiReportsWithCredentials().subscribe((resp) => {
      console.log(resp);
      const { reportsInformation } = resp;
      this.reportsInformation = reportsInformation;
      this.mapBurnedInfo();
    });
  }
  mapBurnedInfo() {
    this.reportsInformation.map((report) => {
      let burnedReportFunded = this.burnedReportsList.find(
        (bReport) => bReport.id == report.id
      );
      if (!burnedReportFunded) return;
      report.name = burnedReportFunded?.reportName;
      report.queryParams = burnedReportFunded?.queryParams;
    });
    console.log(this.reportsInformation);
  }
}
