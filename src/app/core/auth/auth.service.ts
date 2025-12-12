import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { User } from './user.model';
import { Router } from '@angular/router';

interface LoginResponse {
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  get user() {
    return this.currentUser$.asObservable();
  }

  get currentUserValue(): User | null {
    return this.currentUser$.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.roles.includes(role) ?? false;
  }

  login(username: string, password: string) {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          // Cookies (SESSIONID, XSRF-TOKEN) are set by backend,
          // I just store the user info in memory
          this.currentUser$.next(res.user);
        })
      );
  }

  loadCurrentUser() {
    return this.http
      .get<User>(`${environment.apiBaseUrl}/auth/me`)
      .pipe(tap((user) => this.currentUser$.next(user)));
  }

  /* logout() {
    return this.http
      .post<void>(`${environment.apiBaseUrl}/auth/logout`, {})
      .pipe(
        tap(() => {
          this.currentUser$.next(null);
          // Cookie is invalidated on backend
        })
      );
  }*/

  logout(): Observable<void> {
    // Remove cookies
    document.cookie =
      'FAKE_SESSION=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie =
      'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // clear in-memory user
    this.currentUser$.next(null);

    // Redirect to login
    this.router.navigate(['/login']);

    return of();
  }
}
