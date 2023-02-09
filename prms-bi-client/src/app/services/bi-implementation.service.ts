import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as pbi from 'powerbi-client';
import { ExportTablesService } from './export-tables.service';

@Injectable({
  providedIn: 'root',
})
export class BiImplementationService {
  constructor(
    public http: HttpClient,
    private exportTablesSE: ExportTablesService
  ) {}

  apiBaseUrl = environment.apiBaseUrl + 'result-dashboard-bi';
  getBiReportsWithCredentials() {
    return this.http.get<any>(`${this.apiBaseUrl}/bi-reports`);
  }

  getBiReportWithCredentialsById(reportId: string) {
    return this.http.get<any>(
      `${this.apiBaseUrl}/bi-reports/report/${reportId}`
    );
  }

  renderReport(accessToken: any, infoReport: any) {
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
    let report = powerbi.embed(embedContainer, config);
    report.off('loaded');
    report.on('loaded', () => {
      console.log('Loaded');
    });
    report.on('error', () => {
      console.log('ERROR WEY');
    });
    this.exportButton(report);
  }

  exportButton(report: any) {
    // Insert here the code you want to run after the report is rendered

    // report.off removes all event handlers for a specific event

    report.off('bookmarkApplied');

    // report.on will add an event listener.

    report.on('bookmarkApplied', async (event: any) => {
      if (event.detail.bookmarkName == 'Bookmarkc25052bc6f133cc544c3') {
        console.log('Exporting data...\n');

        try {
          const pages = await report.getPages();
          let page = pages.filter((page: any) => {
            return page.isActive;
          })[0];

          const visuals = await page.getVisuals();
          let visual = visuals.filter((visual: any) => {
            return visual.name === '19eaa2a666788114ee07';
          })[0];

          const result = await visual.exportData(
            pbi.models.ExportDataType.Summarized
          );

          this.dataToObject(result.data);
        } catch (errors) {
          console.log(errors);
        }
      }
    });
  }

  dataToObject(data: any) {
    // console.log(data);
    let list: any[] = [];
    let header = data.split('\r\n')[0].split(',');
    // console.log(header);

    let allRows = data.split('\r\n').map((dataItem: any) => {
      let dataEx: any = {};

      let dataSplited = dataItem.replace(
        /(,)(?=(?:[^"]|"[^"]*")*$)/g,
        '|coma|'
      );
      dataSplited = dataSplited.split('|coma|');
      console.log(dataSplited);
      header.map((head: any, index: any) => {
        dataEx[' ' + head] = dataSplited[index];
      });
      list.push(dataEx);
    });

    console.log(list);
    this.exportTablesSE.exportExcel(list, 'Results detail');
  }
}
