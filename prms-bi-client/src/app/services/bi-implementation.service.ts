import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as pbi from 'powerbi-client';
import { ExportTablesService } from './export-tables.service';
import { FiltersByDashboardService } from './filters-by-dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class BiImplementationService {
  constructor(
    public http: HttpClient,
    private exportTablesSE: ExportTablesService,
    private filtersByDashboardSE: FiltersByDashboardService
  ) {}

  apiBaseUrl = environment.apiBaseUrl + 'result-dashboard-bi';
  getBiReportsWithCredentials() {
    console.log(`${this.apiBaseUrl}/bi-reports`);
    return this.http.get<any>(`${this.apiBaseUrl}/bi-reports`);
  }

  getBiReportWithCredentialsById(reportId: string) {
    return this.http.get<any>(
      `${this.apiBaseUrl}/bi-reports/report/${reportId}`
    );
  }

  renderReport(accessToken: any, infoReport: any, reportName: string) {
    // Embed URL
    // console.log(infoReport);
    let embedUrl = infoReport.embed_url;
    let embedReportId = infoReport.resport_id;
    let config = {
      type: 'report',
      tokenType: pbi.models.TokenType.Embed,
      accessToken,
      embedUrl: embedUrl,
      id: embedReportId,
      permissions: pbi.models.Permissions.All,
      // pageView: 'fitToWidth',
      settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: false,
      },
    };
    var embedContainer: any = document.getElementById('reportContainer');
    let powerbi = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );
    let report: any = powerbi.embed(embedContainer, config);
    report.off('loaded');
    report.on('loaded', () => {
      // console.log('Loaded');
      report.getFilters().then((filters: any) => {
        console.log(filters);
        this.filtersByDashboardSE.applyFilters(report, reportName);
      });
    });
    report.on('error', (err: any) => {
      console.log(err);
    });
    this.exportButton(report);
  }

  exportButton(report: any) {
    // Insert here the code you want to run after the report is rendered

    // report.off removes all event handlers for a specific event

    report.off('bookmarkApplied');

    // report.on will add an event listener.

    report.on('bookmarkApplied', async (event: any) => {
      this.detectButtonAndTable(
        event,
        report,
        'Bookmarkc25052bc6f133cc544c3',
        'export_data_table'
      );
      this.detectButtonAndTable(
        event,
        report,
        'Bookmark5a3a4ad20979a9aa36ba',
        'export_data_table'
      );
    });
  }

  async detectButtonAndTable(
    event: any,
    report: any,
    bookmarkName: any,
    title: any
  ) {
    console.log(event.detail.bookmarkName);
    if (event.detail.bookmarkName == bookmarkName) {
      console.log('Exporting data...\n');

      try {
        const pages = await report.getPages();
        let page = pages.filter((page: any) => {
          return page.isActive;
        })[0];

        const visuals = await page.getVisuals();

        let visual = visuals.find((vv: any) => vv.title.search(title) >= 0);
        console.log(visual);

        const result = await visual.exportData(
          pbi.models.ExportDataType.Summarized
        );

        this.dataToObject(result.data);
      } catch (errors) {
        console.log(errors);
      }
    }
  }

  dataToObject(data: any) {
    console.log(data);
    this.exportTablesSE.saveAsExcelFile(data, 'file');
  }
}
