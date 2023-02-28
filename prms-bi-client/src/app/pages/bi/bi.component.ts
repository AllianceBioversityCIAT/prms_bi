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
  constructor(
    private biImplementationSE: BiImplementationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.getQueryParams();
    this.getBiReportWithCredentialsByreportName();
    this.example();
  }

  getQueryParams() {
    this.reportName =
      this.activatedRoute.snapshot.paramMap.get('reportName') || '';
    // if (!this.reportName) this.router.navigate(['/bi-list']);
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
    // console.log(JSON.stringify(jsonExample));
  }

  getBiReportWithCredentialsByreportName() {
    if (!this.reportName) return;

    this.biImplementationSE
      .getBiReportWithCredentialsByreportName(this.reportName)
      .subscribe((resp) => {
        const { token, report } = resp;
        const filtervalue: any =
          this.activatedRoute.snapshot.paramMap.get('filtervalue');
        // console.log(this.activatedRoute.snapshot.queryParams);

        this.biImplementationSE.renderReport(token, report, this.reportName);
      });
  }
}
