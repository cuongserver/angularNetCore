/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { UserListTableComponent } from './user-list-table.component';

let component: UserListTableComponent;
let fixture: ComponentFixture<UserListTableComponent>;

describe('user-list-table component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ UserListTableComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(UserListTableComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});