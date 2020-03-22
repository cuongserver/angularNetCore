"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/common/http");
var animations_1 = require("@angular/animations");
exports.moduleHttpOptions = {
    headers: new http_1.HttpHeaders({ 'Content-Type': 'application/json' })
};
exports.fadeAnimation = [
    // the fade-in/fade-out animation.
    animations_1.trigger('fadeAnimation', [
        // the "in" style determines the "resting" state of the element when it is visible.
        animations_1.state('in', animations_1.style({ opacity: 1 })),
        // fade in when created. this could also be written as transition('void => *')
        animations_1.transition(':enter', [
            animations_1.style({ opacity: 0 }),
            animations_1.animate(300)
        ]),
        // fade out when destroyed. this could also be written as transition('void => *')
        animations_1.transition(':leave', animations_1.animate(300, animations_1.style({ opacity: 0 })))
    ])
];
//# sourceMappingURL=module-resource.js.map