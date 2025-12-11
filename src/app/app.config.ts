
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SecurityInterceptor } from './core/security/security.intereptor';
import { ErrorInterceptor } from './core/security/error.interceptor';
import { routes } from './app.routes';
import { FakeBackendInterceptor } from './core/fake-backend.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
     provideHttpClient(withInterceptorsFromDi()),
      { provide: HTTP_INTERCEPTORS, useClass: SecurityInterceptor, multi: true},
      { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}, provideAnimationsAsync()
  ]
};
