/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ChangeUserPasswordComponent } from './change-user-password.component';

let component: ChangeUserPasswordComponent;
let fixture: ComponentFixture<ChangeUserPasswordComponent>;

describe('ChangeUserPassword component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ChangeUserPasswordComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ChangeUserPasswordComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});