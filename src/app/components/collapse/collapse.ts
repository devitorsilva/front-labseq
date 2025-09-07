import { ChangeDetectionStrategy, Component, Input, signal, SimpleChanges } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'collapse',
  templateUrl: 'collapse.html',
  styleUrl: 'collapse.css',
  imports: [MatExpansionModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionOverviewExample {
  readonly panelOpenState = signal(false);
  isPanelOpen = false;
  result: string | undefined;
  cache: any;
  error: string | undefined;
  searchNumber: any;
  calculateType: string | undefined;
  transactionTime: string | undefined;
  cacheToShow: { key: number; value: string }[] | undefined;

  @Input() set responseData(data: {
    result: string;
    transactionTime: string;
    searchNumber: number;
  }) {
    if (data) {
      this.result = this.toScientificNotation(data.result);
      this.cache = this.cache;
      this.transactionTime = data.transactionTime;
      this.searchNumber = data.searchNumber;
    }
  }

  toScientificNotation(numStr: string, precision = 4): string {
    numStr = numStr.replace(/^0+/, '');

    const length = numStr.length;

    if (length === 0) return '0';
    if (length === 1) return numStr;

    const firstDigit = numStr[0];
    const rest = numStr.slice(1, 1 + precision);

    return `${firstDigit}.${rest}e+${length - 1}`;
  }

  togglePanel() {
    this.isPanelOpen = !this.isPanelOpen;
  }

  openPanel() {
    this.isPanelOpen = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['responseData']) {
      const newData = changes['responseData'].currentValue;
      if (newData) {
        this.result = this.toScientificNotation(newData.result);
        this.transactionTime = newData.transactionTime;
        this.openPanel();
      }
    }
  }
}
