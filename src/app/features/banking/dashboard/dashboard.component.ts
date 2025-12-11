import { Component, OnInit } from "@angular/core";
import { Account, BankingService } from "../banking.service";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
 // styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    accounts: Account[]=[];
    isLoading = false;

    constructor(private banking: BankingService, private router: Router){}
    
    ngOnInit(): void {
       this.isLoading = true;
       this.banking.getAccounts().subscribe({
        next: (data) => {
            this.accounts= data ;
            this.isLoading= false;
        },
        error: () => {
            this.isLoading= false;
        }

       })
    }

     goToTransfer() {
    this.router.navigate(['/bank/transfer']);
  }

}