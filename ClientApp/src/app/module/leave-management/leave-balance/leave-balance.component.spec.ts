/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { LeaveBalanceComponent } from './leave-balance.component';

let component: LeaveBalanceComponent;
let fixture: ComponentFixture<LeaveBalanceComponent>;

describe('leave-balance component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LeaveBalanceComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(LeaveBalanceComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});