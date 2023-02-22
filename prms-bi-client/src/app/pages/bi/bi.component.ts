import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BiImplementationService } from '../../services/bi-implementation.service';
@Component({
  selector: 'app-bi',
  templateUrl: './bi.component.html',
  styleUrls: ['./bi.component.scss'],
})
export class BiComponent {
  reportName = '';
  reportId = null;
  burnedReportsList: any[] = [
    { reportName: 'results-dashboard', id: 3 },
    { reportName: 'type-1-report-dashboard', id: 4 },
    { reportName: 'result-dashboard_test', id: 5 },
  ];
  constructor(
    private biImplementationSE: BiImplementationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.getQueryParams();
    this.getBiReportWithCredentialsById();
    this.example();
  }

  getQueryParams() {
    this.reportName = this.activatedRoute.snapshot.queryParams['reportName'];
    // if (!this.reportName) this.router.navigate(['/bi-list']);
    this.reportId = this.getReportId(this.reportName);
  }

  example() {
    const jsonExample = [
      {
        target: {
          table: 'fact_results',
          column: 'reported_year_id',
        },
        values: [],
      },
    ];
    console.log(JSON.stringify(jsonExample));
  }

  getReportId(reportName: string) {
    const reportFounded = this.burnedReportsList.find(
      (reportItem) => reportItem.reportName == reportName
    );
    return reportFounded?.id;
  }

  getBiReportWithCredentialsById() {
    if (!this.reportId) return;

    this.biImplementationSE
      .getBiReportWithCredentialsById(this.reportId)
      .subscribe((resp) => {
        const { token, report } = resp;
        const filtervalue: any =
          this.activatedRoute.snapshot.paramMap.get('filtervalue');
        console.log(this.activatedRoute.snapshot.queryParams);

        this.biImplementationSE.renderReport(token, report, this.reportName);
      });
  }
}
