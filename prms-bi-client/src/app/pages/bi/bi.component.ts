import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BiImplementationService } from '../../services/bi-implementation.service';
import { Title } from '@angular/platform-browser';
import { IBDGoogleAnalytics } from 'ibdevkit';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-bi',
  templateUrl: './bi.component.html',
  styleUrls: ['./bi.component.scss'],
})
export class BiComponent {
  reportName = '';
  reportDescription = '';
  constructor(
    public biImplementationSE: BiImplementationService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}

  async ngOnInit() {
    this.getQueryParams();
    this.getBiReportWithCredentialsByreportName();
  }

  getQueryParams() {
    this.reportName =
      this.activatedRoute.snapshot.paramMap.get('reportName') || '';
  }

  biHeight() {
    const reportDescriptionHtml = document.getElementById('reportDescription');
    return `calc(100vh - 16px - ${reportDescriptionHtml?.clientHeight || 0}px)`;
  }

  convertNameToTitle = (name: string) =>
    name.replace(/-/g, ' ')?.charAt(0)?.toUpperCase() + name?.slice(1);

  async getBiReportWithCredentialsByreportName() {
    if (!this.reportName) return;

    try {
      const reportData = await firstValueFrom(
        this.biImplementationSE.getBiReportWithCredentialsByreportName(
          this.reportName
        )
      );

      const { token, report } = reportData;

      const dateCET = new Date().toLocaleString('en-US', {
        timeZone: 'Europe/Madrid',
        hour12: false,
      });

      const dateText = dateCET.split(',');
      const dateTime = dateText[1].split(':').join('');

      const fullDateText = `${report?.dateText.slice(0, 8)}_${dateTime.trim()}`;

      this.reportDescription = report?.description;
      this.reportDescriptionInnerHtml();

      await this.biImplementationSE.renderReport(
        token,
        report,
        this.reportName,
        fullDateText
      );
      const reportPageName = await this.biImplementationSE.getReportName();
      this.gATracking(report, reportPageName);
    } catch (error) {
      console.log(error);
      this.reportDescriptionInnerHtml();
    }
  }

  gATracking(report: any, reportPageName: string) {
    this.titleService.setTitle(
      this.convertNameToTitle(`${report?.name} (${reportPageName})`)
    );
    IBDGoogleAnalytics().initialize(environment.googleAnalyticsId);
  }

  reportDescriptionInnerHtml() {
    const element: any = document.getElementById('reportDescription');
    if (element) element.innerHTML = this.reportDescription;
  }
}
