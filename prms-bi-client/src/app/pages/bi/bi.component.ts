import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BiImplementationService } from '../../services/bi-implementation.service';
@Component({
  selector: 'app-bi',
  templateUrl: './bi.component.html',
  styleUrls: ['./bi.component.scss'],
})
export class BiComponent {
  public screenHeight!: number;
  constructor(
    private biImplementationSE: BiImplementationService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.getIdByRoutee();
  }

  getIdByRoutee() {
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
    this.screenHeight = window.screen.height;
    this.biImplementationSE.getBiReportsWithCredentials().subscribe((resp) => {
      // console.log(resp);
      const { embed_token, reportsInformation } = resp;
      this.biImplementationSE.renderReport(embed_token, reportsInformation[0]);
    });
  }
}
