import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as pbi from 'powerbi-client';

@Injectable({
  providedIn: 'root',
})
export class BiImplementationService {
  constructor(public http: HttpClient) {}

  apiBaseUrl = environment.apiBaseUrl + 'result-dashboard-bi';
  getBiReportsWithCredentials() {
    return this.http.get<any>(`${this.apiBaseUrl}/bi-reports`);
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
        navContentPaneEnabled: true,
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
  }
}
