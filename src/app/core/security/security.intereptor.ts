import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CsrfService } from './csrf.security';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  constructor(private csrfService: CsrfService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Only process calls to API
    if (!req.url.startsWith(environment.apiBaseUrl)) {
      return next.handle(req);
    }

    // Always send cookies (SESSIONID, XSF_TOKEN)
    let secureReq = req.clone({
      withCredentials: true,
    });

    // For modifying requests, add CSRF header
    const method = req.method.toUpperCase();
    const needsCsfr = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    if (needsCsfr) {
      const token = this.csrfService.getToken();
      if (token) {
        secureReq = secureReq.clone({
          setHeaders: {
            [environment.csrfHeaderName]: token,
          },
        });
      }
    }

    return next.handle(secureReq);
  }
}
