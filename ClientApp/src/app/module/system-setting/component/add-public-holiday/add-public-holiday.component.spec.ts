/// <reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AddPublicHolidayComponent } from './add-public-holiday.component';

let component: AddPublicHolidayComponent;
let fixture: ComponentFixture<AddPublicHolidayComponent>;

describe('AddPublicHoliday component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AddPublicHolidayComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AddPublicHolidayComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});