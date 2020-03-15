/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ListAllUserComponent } from './list-all-user.component';

let component: ListAllUserComponent;
let fixture: ComponentFixture<ListAllUserComponent>;

describe('list-all-user component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ListAllUserComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ListAllUserComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});