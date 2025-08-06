import { Component ,inject,Input} from '@angular/core';
import { HelperUser } from '../../models/helper.model';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { DividerComponent } from '../../shared/divider/divider.component';
import { InfoRowComponent } from '../../shared/info-row/info-row.component';
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog';
import { DeleteHelperComponent } from '../delete-helper/delete-helper.component';
import { HelpersService } from '../../services/helpers.service';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-helper-detail',
  standalone: true,
  imports: [CommonModule,MaterialModule,DividerComponent,InfoRowComponent,DeleteHelperComponent],
  templateUrl: './helper-detail.component.html',
  styleUrl: './helper-detail.component.scss'
})
export class HelperDetailComponent {
  @Input() helper?: HelperUser
  router: Router = inject(Router);
  helperService = inject(HelpersService);
  toastService = inject(ToastService);
  readonly dialog = inject(MatDialog);
  constructor() {}
  editHelper() {
    this.router.navigate(['/update',this.helper?.employeeId]);
  }
  deleteHelper(){
    const dialogRef = this.dialog.open(DeleteHelperComponent, {
      data:{fullName: this.helper?.fullName, typeOfService: this.helper?.typeOfService},
    });
    dialogRef.afterClosed().subscribe(result=>{
      if(result === 'Delete' && this.helper?.employeeId !== undefined){
        this.helperService.deleteHelper(this.helper.employeeId)
          .subscribe({
            next: (response)=>{
            this.toastService.success(response.message);
            },
            error: (error)=>{
              this.toastService.error('Failed to delete helper');
            } 
            });
      }
        
    })

  }
  getPhotoUrl(): string{
    if(typeof this.helper?.photo === 'string'){
      const url = this.helper.photo;
      return `https://res.cloudinary.com/dg5aldure/image/upload/w_200,h_200,c_fill/helper_upload/${url.substring(url.lastIndexOf('/')+1)}`;
    }
    return '';
  }


}
