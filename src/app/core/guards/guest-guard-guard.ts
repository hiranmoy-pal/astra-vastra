import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { Storage } from '../services/storage/storage';

export const guestGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);
  const storage = inject(Storage);
  const router = inject(Router);

  // On SSR server, allow render; browser will verify immediately on hydration
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = await storage.get('accessToken');
  if (token) {
    // Already logged in -> redirect to landing page
    return router.createUrlTree(['/']);
  }

  return true;
};