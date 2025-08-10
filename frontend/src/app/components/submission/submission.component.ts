import { Component ,inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';
import { InfoRowComponent } from '../../shared/info-row/info-row.component';
@Component({
  selector: 'app-submission',
  standalone: true,
  imports: [MaterialModule,CommonModule,InfoRowComponent],
  templateUrl: './submission.component.html',
  styleUrl: './submission.component.scss'
})
export class SubmissionComponent {
  readonly dialogRef = inject(MatDialogRef<SubmissionComponent>);
  readonly helper = inject(MAT_DIALOG_DATA).helper;
  close(): void{
    this.dialogRef.close();
  }
  download(){
    window.print();
  }


}
