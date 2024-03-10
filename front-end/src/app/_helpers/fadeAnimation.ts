import { animate, style, transition, trigger } from '@angular/animations';

export const Animate = trigger('animate', [
  transition('void => *', [
    style({ opacity: 0 }),
    animate(300, style({ opacity: 1 })),
  ]),
]);
export const InOut = trigger('inOut', [
  transition('void => *', [
    style({ opacity: 0 }),
    animate(300, style({ opacity: 1 })),
  ]),
  transition('* => void', [
    style({ opacity: 1 }),
    animate(300, style({ opacity: 0 })),
  ]),
]);

export const Fader = trigger('fade', [
  transition('* <=> *', [
    style({ opacity: 0 }),
    animate(300, style({ opacity: 1 })),
  ]),
]);
