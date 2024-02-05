import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BiImplementationService } from '../../services/bi-implementation.service';
import { Title } from '@angular/platform-browser';
import { IBDGoogleAnalytics } from 'ibdevkit';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { TabVisibilityService } from 'src/app/services/tab-visibility.service';
import { VariablesService } from '../../services/variables.service';

@Component({
  selector: 'app-bi',
  templateUrl: './bi.component.html',
  styleUrls: ['./bi.component.scss'],
})
export class BiComponent implements OnInit {
  reportName = '';
  reportDescription = '';
  isFullScreen = false;
  showFullScreen = false;
  wasInactive = false;
  showMonitorPanel = false;

  constructor(
    public biImplementationSE: BiImplementationService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private tabVisibilityService: TabVisibilityService,
    public variablesSE: VariablesService
  ) {}

  async ngOnInit() {
    this.runEvents();
    this.getQueryParams();
    this.getBiReportWithCredentialsByreportName();
    this.tabVisibilityService.tabVisibilityChanged.subscribe(
      (isTabInactiveFor10Minutes: boolean) => {
        if (isTabInactiveFor10Minutes) {
          this.wasInactive = true;
        }
      }
    );
  }

  runEvents() {
    const eventName = this.activatedRoute.snapshot.paramMap.get('event') || '';
    if (eventName == 'monitor') {
      this.showMonitorPanel = true;
    }
  }

  reloadPage() {
    window.location.reload();
  }

  toggleFullScreen() {
    const fullscreenElement =
      document.fullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement ||
      (document as any).webkitFullscreenElement;

    if (!fullscreenElement) {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
      this.isFullScreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }

      this.isFullScreen = false;
    }
  }

  getQueryParams() {
    this.reportName =
      this.activatedRoute.snapshot.paramMap.get('reportName') || '';
  }

  biHeight() {
    const reportDescriptionHtml = document.getElementById('reportDescription');
    return `calc(100vh - 65px - ${reportDescriptionHtml?.clientHeight ?? 0}px)`;
  }

  validateBAckResponseProcess(reportData: any) {
    const { token, azureValidation } = reportData;
    if (token) this.variablesSE.processes[1].works = true;
    this.variablesSE.processes[2].works = true;
    switch (azureValidation) {
      case 1:
        this.variablesSE.processes[0].works = true;
        break;
      case 2:
        this.variablesSE.processes[0].works = 2;
        break;
      default:
        this.variablesSE.processes[0].works = false;
        break;
    }
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
      this.showFullScreen = report?.hasFullScreen;

      this.validateBAckResponseProcess(reportData);

      this.reportDescription = report?.description;
      this.reportDescriptionInnerHtml();

      await this.biImplementationSE.renderReport(
        token,
        report,
        this.reportName
      );
      const reportPageName = await this.biImplementationSE.getReportName();
      this.gATracking(report, reportPageName);
    } catch (error) {
      console.log(error);
      this.reportDescriptionInnerHtml();
      this.variablesSE.processes[2].works = false;
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
