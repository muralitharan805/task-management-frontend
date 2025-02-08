import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppService } from './app.service';

export const authGuard: CanActivateFn = (route, state) => {
  const appService: AppService = inject(AppService);
  const router: Router = inject(Router);

  if (appService.isAuthenticated()) {
    return true;
  }
  // Redirect to login page if not authenticated
  router.navigate(['/login']);
  return false;
};
