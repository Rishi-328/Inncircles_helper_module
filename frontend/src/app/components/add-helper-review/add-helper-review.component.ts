import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InfoRowComponent } from '../../shared/info-row/info-row.component';
import { DividerComponent } from '../../shared/divider/divider.component';
import { MaterialModule } from '../../shared/material.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-helper-review',
  standalone: true,
  imports: [CommonModule, InfoRowComponent, DividerComponent, MaterialModule],
  templateUrl: './add-helper-review.component.html',
  styleUrl: './add-helper-review.component.scss'
})
export class AddHelperReviewComponent implements OnInit, OnDestroy {
  @Input() helperForm?: FormGroup;
  kycFileUrl: string | null = null;

  private kycSub?: Subscription;

  ngOnInit(): void {
    if (this.helperForm?.get('kycDocument')) {
      this.kycSub = this.helperForm.get('kycDocument')!.valueChanges.subscribe((file: File) => {
        if (file) {
          this.kycFileUrl = URL.createObjectURL(file);
        } else {
          this.kycFileUrl = null;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.kycSub?.unsubscribe();
  }
}
