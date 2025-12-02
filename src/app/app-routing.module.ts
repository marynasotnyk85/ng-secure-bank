import { Routes } from "@angular/router";
import { AuthGuard } from "./core/auth/auth.guard";
import { LoginComponent } from "./features/auth/login/login.component";

const routes: Routes = [
 { path: 'login', component: LoginComponent},
 {  
    path: 'bank', 
    canActivate: [AuthGuard],
    children: [
      //{ path: 'dashboard', component: DashboardComponent },
      //{ path: 'transfer', component: TransferComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]

 },
  { path: '**', redirectTo: 'login' }
]