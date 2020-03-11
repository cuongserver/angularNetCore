/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AccountInformationComponent } from './account-information.component';

let component: AccountInformationComponent;
let fixture: ComponentFixture<AccountInformationComponent>;

describe('AccountInformation component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AccountInformationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AccountInformationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});