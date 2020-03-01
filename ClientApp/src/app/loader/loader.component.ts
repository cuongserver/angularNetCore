import { Component } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})
/** loader component*/
export class LoaderComponent {
  private loaderActive: boolean = false;
  constructor() {

  }

  public Activate() {
    this.loaderActive = true;
  }

  public DeActivate() {
    this.loaderActive = false;
  }
}
