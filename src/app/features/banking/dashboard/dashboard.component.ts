import { Component, OnInit, ViewChild } from "@angular/core";
import { Account, BankingService, Transaction } from "../banking.service";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SecurityBannerComponent } from "../../../shared/components/security-banner/security-banner.component";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, 
    RouterLink,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatToolbarModule,
    SecurityBannerComponent,
  MatTooltip],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    accounts: Account[]=[];
    isLoading = false;
    error: string | null = null;
    
    displayedColumns: string[] = ['date', 'from', 'to', 'amount', 'description'];
  dataSource = new MatTableDataSource<Transaction>([]);

   @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

   securityMessages = [
    'Never share your password or one-time codes with anyone.',
    'Always check the URL: it must start with https:// and be your official bank domain.',
    'If an email or SMS asks you to log in from a link, go to the site manually instead.',
    'Log out after using online banking on shared or public devices.'
  ];

    constructor(private banking: BankingService, private router: Router){}
    
    ngOnInit(): void {
       this.loadAccounts();   
         this.loadTransactions();
    }

    ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

    loadAccounts() {
    this.isLoading = true;
    this.error = null;

    this.banking.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Unable to load accounts. Please try again.';
      }
    });
  }

  loadTransactions() {
    this.banking.getRecentTransactions().subscribe({
      next: (tx) => {
        this.dataSource.data = tx;
      },
      error: () => { }
    });
  }

     goToTransfer() {
    this.router.navigate(['/bank/transfer']);
  }

}