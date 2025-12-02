import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  getToken(): string | null {
    const cookieName = environment.csrfCookieName + '=';
    const cookies = document.cookie ? document.cookie.split('; ') : [];

    for (const c of cookies) {
      if (c.startsWith(cookieName)) {
        return decodeURIComponent(c.substring(cookieName.length));
      }
    }

    return null;
  }
}
