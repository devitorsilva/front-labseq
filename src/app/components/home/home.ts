import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpansionOverviewExample } from '../collapse/collapse';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ExpansionOverviewExample,
    HttpClientModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  numberInput: any;
  searchNumber: any;
  isSubmitting: boolean = false;
  labseqForm: FormGroup;
  myService: HttpClient;
  result: any;
  transactionTime: any;
  panelOpenState: boolean = false;
  responseData: any = {};
  errorMessage: any;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    myService: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.labseqForm = this.fb.group({
      input: ['', [Validators.required]],
    });

    this.myService = myService;
  }

  updateResponseData(newData: { result: string; transactionTime: string }) {
    this.responseData = {
      ...newData,
      searchNumber: this.numberInput,
    };
  }

  onNumberChange(e: { target: { value: string } }) {
    this.numberInput = e.target.value;
  }

  onSubmit() {
    this.isSubmitting = true;
    const url = `/labseq/${this.numberInput}`;

    this.myService.get(url).subscribe({
      next: (res: any) => {
        this.updateResponseData({
          result: res.result,
          transactionTime: res.transactionTime,
        });
        this.errorMessage = res.error;
      },
      error: (err) => {
        console.error('An error occurred:', err);
        this.errorMessage = err.statusText;
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }

  cleanCache() {
    this.isSubmitting = true;
    const url = '/labseq/clean-cache';

    this.myService.get(url).subscribe({
      error: (err) => {
        console.error('An error occurred:', err);
        this.errorMessage = err.statusText;
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.snackBar.open('Cache was cleaned!', 'OK', { duration: 500 });
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}
