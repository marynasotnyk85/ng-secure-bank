import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { environment } from '../../environment/environment';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  // in-memory “DB”
  private user = {
    id: '1',
    name: 'Test User',
    roles: ['User']
  };

  private accounts = [
    { id: 'acc1', name: 'Main account', balance: 1234.56, currency: 'EUR' },
    { id: 'acc2', name: 'Savings', balance: 9876.54, currency: 'EUR' }
  ];

  // fake “session” & csrf
  private isLoggedIn = false;
  private csrfToken = 'fake-csrf-token-123';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, body } = req;

    // Only intercept our API calls
    if (!url.startsWith(environment.apiBaseUrl)) {
      return next.handle(req);
    }

    // Small delay to simulate network
    return of(null).pipe(
      delay(300),
      mergeMap(() => {
        // Simulated routes:
        if (url.endsWith('/auth/login') && method === 'POST') {
          return this.login(body);
        }

        if (url.endsWith('/auth/me') && method === 'GET') {
          return this.getCurrentUser();
        }

        if (url.endsWith('/accounts') && method === 'GET') {
          return this.getAccounts();
        }

        if (url.endsWith('/payments/transfer') && method === 'POST') {
          return this.transfer(req);
        }
        if (url.endsWith('/auth/logout') && method === 'POST') {
           return this.logout();
}

        // default: pass through
        return next.handle(req);
      })
    );
  }

  private login(body: any): Observable<HttpEvent<any>> {
    const { username, password } = body;

    // Super simple: accept any non-empty credentials
    if (!username || !password) {
      return this.error(400, 'Username and password are required');
    }

    this.isLoggedIn = true;

    // For simulation: set a fake “cookie” (NOT secure, just to mimic flow)
    document.cookie = `FAKE_SESSION=123; path=/`;
    document.cookie = `XSRF-TOKEN=${this.csrfToken}; path=/`;

    return this.ok({
      user: this.user
    });
  }

  private getCurrentUser(): Observable<HttpEvent<any>> {
    if (!this.isLoggedIn) {
      return this.error(401, 'Not authenticated');
    }
    return this.ok(this.user);
  }

  private getAccounts(): Observable<HttpEvent<any>> {
    if (!this.isLoggedIn) {
      return this.error(401, 'Not authenticated');
    }
    return this.ok(this.accounts);
  }

  private transfer(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    if (!this.isLoggedIn) {
      return this.error(401, 'Not authenticated');
    }

    // Simulate CSRF check
    const csrfHeader = req.headers.get('X-CSRF-Token');
    console.log('[FakeBackend] CSRF header =', csrfHeader); 
    if (csrfHeader !== this.csrfToken) {
      return this.error(403, 'Invalid CSRF token');
    }

     const { fromAccountId, toIban, amount } = req.body;

    if (!fromAccountId || !toIban || !amount || amount <= 0) {
      return this.error(400, 'Invalid transfer data');
    }

    return this.ok({ status: 'ok' });
  }

  // helper methods
  private ok(body?: any) {
    return of(new HttpResponse({ status: 200, body }));
  }

  private error(status: number, message: string) {
    return throwError(
      () => new HttpErrorResponse({ status, error: { message } })
    );
  }

  private logout(): Observable<HttpEvent<any>>{
    // Delete cookies
  document.cookie = 'FAKE_SESSION=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  console.log('[FakeBackend] Logged out');
  return this.ok({ status: 'logged_out' });
  }
}
