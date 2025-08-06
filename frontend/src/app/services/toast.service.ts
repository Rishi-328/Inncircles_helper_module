import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  show(message: string, action: string = 'Close', duration: number = 3000, panelClass: string = '') {
    this.snackBar.open(message, action, {
      duration,
      panelClass: panelClass ? [panelClass] : undefined
    });
  }

  success(message: string, duration: number = 3000) {
    this.show(message, 'Close', duration, 'success-toast');
  }

  error(message: string, duration: number = 3000) {
    this.show(message, 'Close', duration, 'error-toast');
  }

  info(message: string, duration: number = 3000) {
    this.show(message, 'Close', duration, 'info-toast');
  }
}
