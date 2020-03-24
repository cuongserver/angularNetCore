/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { LeaveLimitSummaryComponent } from './leave-limit-summary.component';

let component: LeaveLimitSummaryComponent;
let fixture: ComponentFixture<LeaveLimitSummaryComponent>;

describe('LeaveLimitSummary component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LeaveLimitSummaryComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(LeaveLimitSummaryComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});