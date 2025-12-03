import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthGuard } from './core/auth/auth.guard';
import { DashboardComponent } from './features/banking/dashboard/dashboard.component';
import { TransferComponent } from './features/banking/transfer/transfer.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
 {  
    path: 'bank', 
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transfer', component: TransferComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
 },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
