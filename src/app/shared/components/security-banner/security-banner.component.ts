import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-security-banner',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatListModule],
  templateUrl: './security-banner.component.html',
  styleUrls: ['./security-banner.component.scss']
})
export class SecurityBannerComponent {
  @Input() title = 'Security tips';
  @Input() messages: string[] = [];
}
