import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css',
    '../../font/fontawesome-free-5.12.1-web/css/all.css',
    '../../font/montserrat/montserrat.css'
  ]
})
/** dashboard component*/
export class DashboardComponent {
  private year: string = new Date().getFullYear().toString();
    constructor() {

    }
}
