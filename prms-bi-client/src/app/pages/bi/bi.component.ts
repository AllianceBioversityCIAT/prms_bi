import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BiImplementationService } from '../../services/bi-implementation.service';
@Component({
  selector: 'app-bi',
  templateUrl: './bi.component.html',
  styleUrls: ['./bi.component.scss'],
})
export class BiComponent {
  reportsInformation: any[] = [];
  paramId: any = null;
  constructor(
    private biImplementationSE: BiImplementationService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.paramId = this.activatedRoute.snapshot.paramMap.get('id');

    this.getBiReportsWithCredentials();
    this.getBiReportWithCredentialsById();
  }

  getBiReportWithCredentialsById() {
    if (!this.paramId) return;
    this.biImplementationSE
      .getBiReportWithCredentialsById(this.paramId)
      .subscribe((resp) => {
        const { token, report } = resp;
        const filtervalue: any =
          this.activatedRoute.snapshot.paramMap.get('filtervalue');
        this.biImplementationSE.renderReport(token, report, filtervalue);
      });
  }

  getBiReportsWithCredentials() {
    if (this.paramId) return;
    this.biImplementationSE.getBiReportsWithCredentials().subscribe((resp) => {
      const { reportsInformation } = resp;
      this.reportsInformation = reportsInformation;
    });
  }
}
