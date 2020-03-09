/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { SideMenuComponent } from './side-menu.component';

let component: SideMenuComponent;
let fixture: ComponentFixture<SideMenuComponent>;

describe('dashboard-side-menu component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [SideMenuComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(SideMenuComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});
