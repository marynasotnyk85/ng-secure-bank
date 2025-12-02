import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private initialized = false;

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    if (this.initialized && this.auth.isLoggedIn()) {
      return of(true);
    }
    return this.auth.loadCurrentUser().pipe(
      tap(() => (this.initialized = true)),
      switchMap(() => of(true)),
      catchError(() => {
        return of(this.router.parseUrl('/login'));
      })
    );
  }
}
