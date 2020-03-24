import * as res from '@app/module/system-setting/module-resource';
import {
  Component, Renderer2, ElementRef,
  Directive, EventEmitter, Input, Output, QueryList, ViewChildren, HostBinding, HostListener, OnInit, AfterViewInit, ViewChild, OnDestroy
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { JsonToCsvService } from '@app/_common/json-to-csv/json-to-csv.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { DialogService, DialogController, MessageBoxButton, MessageBoxStyle } from '@app/_common/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@app/_common/loader/loader.service';

@Component({
  selector: 'app-leave-limit-summary',
  templateUrl: './leave-limit-summary.component.html',
  styleUrls: ['./leave-limit-summary.component.css'],
  animations: res.fadeAnimation
})
/** LeaveLimitSummary component*/
export class LeaveLimitSummaryComponent {
  private transitionState: string = 'in';
    constructor() {
    }
}
