import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { SecurityInterceptor } from "./core/security/security.intereptor";
import { ErrorInterceptor } from "./core/security/error.interceptor";
import { NgModule } from "@angular/core";

@NgModule({
    providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SecurityInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
    ]
})

export class AppModule{}