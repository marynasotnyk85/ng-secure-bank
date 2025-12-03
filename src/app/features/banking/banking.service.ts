import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environment/environment";

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

export interface TransferRequest {
  fromAccountId: string;
  toIban: string;
  amount: number;
  description?: string;
}

export class BankingService {
    constructor(private http: HttpClient){}

    getAccounts(): Observable<Account[]> {
        return this.http.get<Account[]>(`${environment.apiBaseUrl}/accounts`);
    }

    makeTransfer(dto: TransferRequest): Observable<void> {
    // CSRF header will be attached by interceptor
    return this.http.post<void>(`${environment.apiBaseUrl}/payments/transfer`, dto);
  }
}