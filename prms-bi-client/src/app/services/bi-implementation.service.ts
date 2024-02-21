import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as pbi from 'powerbi-client';
import { ExportTablesService } from './export-tables.service';
import { FiltersByDashboardService } from './filters-by-dashboard.service';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { IBDGoogleAnalytics } from 'ibdevkit';
import { VariablesService } from './variables.service';

@Injectable({
  providedIn: 'root',
})
export class BiImplementationService {
  constructor(
    public http: HttpClient,
    private exportTablesSE: ExportTablesService,
    private filtersByDashboardSE: FiltersByDashboardService,
    private variablesSE: VariablesService,
  ) {}

  apiBaseUrl = environment.apiBaseUrl + 'result-dashboard-bi';
  report: any;
  showExportSpinner = false;
  currentReportName = '';
  mainPage = '';
  hideIframe = false;
  showGlobalLoader = true;

  getBiReports() {
    return this.http.get<any>(`${this.apiBaseUrl}/bi-reports`).pipe(
      map((resp) => {
        return resp?.response;
      })
    );
  }

  getBiReportWithCredentialsById(reportId: string) {
    return this.http.get<any>(
      `${this.apiBaseUrl}/bi-reports/report/${reportId}`
    );
  }

  getBiReportWithCredentialsByreportName(body:any) {
    return this.http.post<any>(
      `${this.apiBaseUrl}/bi-reports/reportName`,body
    );
  }

  renderReport(
    accessToken: any,
    infoReport: any,
    reportName: string,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
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
        fullscreen: {
          enabled: true, // Habilitar pantalla completa
        },
      };
      let embedContainer: any = document.getElementById('reportContainer');
      let powerbi = new pbi.service.Service(
        pbi.factories.hpmFactory,
        pbi.factories.wpmpFactory,
        pbi.factories.routerFactory
      );
      this.report = powerbi.embed(embedContainer, config);

      this.report.off('loaded');
      this.report.on('loaded', () => {
        console.log("loaded")
        this.report.getFilters().then((filters: any) => {
          this.filtersByDashboardSE.applyFilters(this.report, reportName);
          this.variablesSE.processes[3].works = true;
        });

        resolve(this.report);

        this.openMainPage();
        this.showGlobalLoader = false;

      });

      this.report.on('pageChanged', (event:any) => {
        const page = event.detail.newPage;
        IBDGoogleAnalytics().trackPageView(this.convertNameToTitle(page.displayName));
      });

      this.report.on('error', (err: any) => {
        console.log('Error detected');
        console.log(err);
        reject(err);
      });
      this.exportButton(this.report);
    });
  }

  convertNameToTitle = (reportPageName: string) =>{
   const ttile= `${this.currentReportName} (${reportPageName})`
   return ttile.replace(/-/g, ' ')?.charAt(0)?.toUpperCase() + ttile?.slice(1);
  }

  openMainPage() {
    console.log("openMainPage")
    this.report.getPages().then((pages:any) => {
      const page = pages.find((p:any) => p.displayName === this.mainPage);
      this.showGlobalLoader = true;

      page && page.setActive();
      this.report.on('rendered', () => {
        this.hideIframe = false;
        this.showGlobalLoader = false;
      });

      this.report.on('error', () => {
        this.showGlobalLoader = false;
      });

    });
  }

  getReportName(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.report
        .getPages()
        .then((pages: pbi.Page[]) => {
          const activePage = pages.find((page) => page.isActive);

          if (activePage) {
            resolve(activePage.displayName);
          } else {
            reject('No se pudo obtener el nombre de la página activa.');
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  exportButton(report: any) {
    // Insert here the code you want to run after the report is rendered
    // report.off removes all event handlers for a specific event
    report.off('bookmarkApplied');
    // report.on will add an event listener.
    report.on('bookmarkApplied', async (event: any) => {
      const bookmarkNameFound = await this.getBookmarkName(
        report,
        event.detail.bookmarkName
      );
      this.detectButtonAndTable(report, bookmarkNameFound);
    });
  }

  async getBookmarkName(report: any, bookmarkId: any) {
    const bookmarks = await report.bookmarksManager.getBookmarks();
    const bookmarkFound = bookmarks.find((bm: any) => bm.name == bookmarkId);
    return bookmarkFound?.displayName;
  }

  async detectButtonAndTable(report: any, bookmarkName: any) {
    if (bookmarkName.search('export_data') < 0) return;
    console.log('Exporting data...\n');
    this.showExportSpinner = true;
    try {
      const pages = await report.getPages();
      let page = pages.filter((page: any) => {
        return page.isActive;
      })[0];

      const visuals = await page.getVisuals();

      let visual = visuals.find(
        (vv: any) => vv.title.search('export_data_table') >= 0
      );
      console.log(visual);

      const result = await visual.exportData(
        pbi.models.ExportDataType.Summarized
      );

      const dateCETTime = new Date().toLocaleString('en-US', {
        timeZone: 'Europe/Madrid',
        hour12: false,
      });

      const dateCET =
        new Date().getFullYear() +
        ('0' + new Date().getDate().toLocaleString('es-ES')).slice(-2) +
        ('0' + (new Date().getMonth() + 1)).slice(-2);

      const dateText1 = dateCETTime.split(',');
      const dateTime = dateText1[1].split(':').join('');

      console.log('export');
      await this.exportTablesSE.exportExcel(
        result.data,
        `export_data_table_results_${dateCET}_${dateTime.trim()}CET`
      );
      console.log('exported');
      console.log('dateCET', dateCET);
      console.log('dateTime', dateTime);
      IBDGoogleAnalytics().trackEvent('download xlsx', 'file name');
    } catch (errors) {
      console.log(errors);
    }

    this.showExportSpinner = false;
  }
}
