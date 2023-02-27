import { Component } from '@angular/core';
declare var pbiwidget: any;

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent {
  ngOnInit(): void {
    pbiwidget.init('dashboard-embed', 2022, 'Capacity change');
    pbiwidget.setFilters(2023, 'example2');
  }
}
