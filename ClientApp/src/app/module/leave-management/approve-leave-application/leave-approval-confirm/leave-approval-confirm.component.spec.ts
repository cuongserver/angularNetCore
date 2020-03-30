/// <reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { LeaveApprovalConfirmComponent } from './leave-approval-confirm.component';

let component: LeaveApprovalConfirmComponent;
let fixture: ComponentFixture<LeaveApprovalConfirmComponent>;

describe('leave-approval-confirm component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LeaveApprovalConfirmComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(LeaveApprovalConfirmComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});