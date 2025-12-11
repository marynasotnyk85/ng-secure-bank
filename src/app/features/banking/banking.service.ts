import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { environment } from "../../../environment/environment";
import { Injectable } from "@angular/core";

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

export interface Transaction {
  id: string;
  date: string;       
  fromAccountId: string;
  toIban: string;
  amount: number;
  currency: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class BankingService {
    constructor(private http: HttpClient){}

    getAccounts(): Observable<Account[]> {
        return this.http.get<Account[]>(`${environment.apiBaseUrl}/accounts`);
    }

    makeTransfer(dto: TransferRequest): Observable<void> {
    // CSRF header will be attached by interceptor
    return this.http.post<void>(`${environment.apiBaseUrl}/payments/transfer`, dto);
  }

  getRecentTransactions(): Observable<Transaction[]> {
    const dummy: Transaction[] = [
      {
        id: 'tx1',
        date: new Date().toISOString(),
        fromAccountId: 'acc1',
        toIban: 'IT00TEST000000000000000001',
        amount: -120.5,
        currency: 'EUR',
        description: 'Grocery store'
      },
      {
        id: 'tx2',
        date: new Date(Date.now() - 86400000).toISOString(),
        fromAccountId: 'acc1',
        toIban: 'IT00TEST000000000000000002',
        amount: -45.0,
        currency: 'EUR',
        description: 'Online subscription'
      },
      {
        id: 'tx3',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        fromAccountId: 'acc2',
        toIban: 'IT00TEST000000000000000003',
        amount: 500.0,
        currency: 'EUR',
        description: 'Salary'
      }
    ];

    return of(dummy);
  }
}