import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                let userMessage = 'Unexpected error. Please try again later';

                if(err.status ===  0) {
                      userMessage = 'Network error. Check your connection.';
                } else if (err.status === 401) {
                    userMessage = 'Session expired. Please login again.';
                }

                 // TODO: show snackbar/toast with userMessage
                 console.error('API error (sanitized):', err.status, err.url);

                 return throwError(() => err);
            })
          
        )
    }

}