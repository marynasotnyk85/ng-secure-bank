import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankingService } from '../banking.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
})
export class TransferComponent implements OnInit {
  isLoading = false;
  success: string | null = null;
  error: string | null = null;
  form!: FormGroup;

  constructor(private fb: FormBuilder, private banking: BankingService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fromAccountId: ['', Validators.required],
      toIban: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      description: [''],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.isLoading = true;
     this.success = null;
    this.error = null;

    this.banking.makeTransfer(this.form.value as any).subscribe({
        next: () => {
            this.isLoading= false;
            this.success = 'Transfer completed successfully.';
            this.form.patchValue({ amount: 0, desciprion: ''})
        },
        error: () => {
        this.isLoading = false;
        this.error = 'Transfer failed. Please check the data and try again.';
      }
    })

  }
}
