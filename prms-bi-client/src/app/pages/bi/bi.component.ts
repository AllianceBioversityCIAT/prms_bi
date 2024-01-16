import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BiImplementationService } from '../../services/bi-implementation.service';
import { Title } from '@angular/platform-browser';
import { IBDGoogleAnalytics } from 'ibdevkit';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { TabVisibilityService } from 'src/app/services/tab-visibility.service';

@Component({
  selector: 'app-bi',
  templateUrl: './bi.component.html',
  styleUrls: ['./bi.component.scss'],
})
export class BiComponent implements OnInit {
  reportName = '';
  reportDescription = '';
  isFullScreen = false;
  wasInactive = false;

  constructor(
    public biImplementationSE: BiImplementationService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private tabVisibilityService: TabVisibilityService
  ) {}

  async ngOnInit() {
    this.getQueryParams();
    this.getBiReportWithCredentialsByreportName();
    this.tabVisibilityService.tabVisibilityChanged.subscribe(
      (isTabInactiveFor3Minutes: boolean) => {
        if (isTabInactiveFor3Minutes) {
          this.wasInactive = true;
        }
      }
    );
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
