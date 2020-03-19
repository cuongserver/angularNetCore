/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { EditUserInfoComponent } from './edit-user-info.component';

let component: EditUserInfoComponent;
let fixture: ComponentFixture<EditUserInfoComponent>;

describe('EditUserInfo component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditUserInfoComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(EditUserInfoComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});