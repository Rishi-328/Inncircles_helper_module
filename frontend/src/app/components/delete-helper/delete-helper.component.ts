import { Component ,inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-helper',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './delete-helper.component.html',
  styleUrl: './delete-helper.component.scss'
})
export class DeleteHelperComponent {
  readonly diaglogRef = inject(MatDialogRef<DeleteHelperComponent>);
  readonly fullName = inject(MAT_DIALOG_DATA).fullName;
  readonly typeOfService = inject(MAT_DIALOG_DATA).typeOfService;
  onNoClick(): void{
    this.diaglogRef.close();
  }

}
