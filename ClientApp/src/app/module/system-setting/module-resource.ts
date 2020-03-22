import { HttpHeaders } from '@angular/common/http';
import { trigger, style, state, transition, animate } from '@angular/animations';

export const moduleHttpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}



export const fadeAnimation = [
  // the fade-in/fade-out animation.
  trigger('fadeAnimation', [

    // the "in" style determines the "resting" state of the element when it is visible.
    state('in', style({ opacity: 1 })),

    // fade in when created. this could also be written as transition('void => *')
    transition(':enter', [
      style({ opacity: 0 }),
      animate(300)
    ]),

    // fade out when destroyed. this could also be written as transition('void => *')
    transition(':leave',
      animate(300, style({ opacity: 0 })))
  ])
]
