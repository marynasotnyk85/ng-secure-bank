import { OnInit } from "@angular/core";
import { Account, BankingService } from "../banking.service";

export class DashboardComponent implements OnInit {
    accounts: Account[]=[];
    isLoading = false;

    constructor(private banking: BankingService){}
    
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

}