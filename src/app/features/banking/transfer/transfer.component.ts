import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Account, BankingService } from '../banking.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule
  ],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnInit {
  isLoadingAccounts  = false;
  isSubmitting = false;
  success: string | null = null;
  error: string | null = null;
  form!: FormGroup;

  accounts: Account[] = [];

  constructor(
    private fb: FormBuilder,
    private banking: BankingService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAccounts();

    this.form = this.fb.group({
      fromAccountId: ['', Validators.required],
      toIban: ['', [Validators.required]],
      amount: [
        null as number | null,
        [Validators.required, Validators.min(0.01)],
      ],
      description: [''],
    });
  }

  loadAccounts() {
    this.isLoadingAccounts  = true;
    this.error = null;

    this.banking.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.isLoadingAccounts  = false;
      },
      error: () => {
        this.isLoadingAccounts  = false;
        this.error = 'Unable to load accounts. Please try again.';
      },
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error = null;
    this.isSubmitting = true;

    this.banking.makeTransfer(this.form.value as any).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.snackBar.open('Transfer completed successfully.', 'Close', {
          duration: 3000,
        });
        this.form.patchValue({ amount: null, desciprion: '' });
        this.router.navigate(['/bank/dashboard']);
      },
      error: (err) => {
        console.error('Transfer error:', err);
        this.isSubmitting = false;
        this.error = 'Transfer failed. Please check the data and try again.';
      },
    });
  }
}
