/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AddNewUserComponent } from './add-new-user.component';

let component: AddNewUserComponent;
let fixture: ComponentFixture<AddNewUserComponent>;

describe('add-new-user component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AddNewUserComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AddNewUserComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});