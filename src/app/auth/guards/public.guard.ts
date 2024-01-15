import type { CanMatchFn } from '@angular/router';

export const publicGuard: CanMatchFn = (route, segments) => {
  return true;
};
