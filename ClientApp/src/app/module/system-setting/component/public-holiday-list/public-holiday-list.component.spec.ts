/// <reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { PublicHolidayListComponent } from './public-holiday-list.component';

let component: PublicHolidayListComponent;
let fixture: ComponentFixture<PublicHolidayListComponent>;

describe('PublicHolidayList component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PublicHolidayListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(PublicHolidayListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});