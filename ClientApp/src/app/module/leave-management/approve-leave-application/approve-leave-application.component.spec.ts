/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ApproveLeaveApplicationComponent } from './approve-leave-application.component';

let component: ApproveLeaveApplicationComponent;
let fixture: ComponentFixture<ApproveLeaveApplicationComponent>;

describe('approve-leave-application component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ApproveLeaveApplicationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ApproveLeaveApplicationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});