import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, ElementRef, inject, OnInit ,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';
import { Language } from '../../models/language.model';
import { KycUploadComponent } from '../../components/kyc-upload/kyc-upload.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { AddHelperReviewComponent } from '../../components/add-helper-review/add-helper-review.component';
import { HelpersService } from '../../services/helpers.service';
import { Router, RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { SubmissionComponent } from '../../components/submission/submission.component';
import { HelperFormComponent } from '../../components/helper-form/helper-form.component';

@Component({
  selector: 'app-add-helper',
  standalone: true,
  imports: [MatStepperModule,MaterialModule, CommonModule,KycUploadComponent,AddHelperReviewComponent,RouterModule,HelperFormComponent],
  templateUrl: './add-helper.component.html',
  styleUrls: ['./add-helper.component.scss']
})
export class AddHelperComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  helperForm!: FormGroup;
  dialog = inject(MatDialog);
  router = inject(Router);
  constructor(private fb: FormBuilder,
    private toastService: ToastService,
    private helperService : HelpersService,
    ) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  
  initializeForm(): void{
    this.helperForm = this.fb.group({
      photo: [null],
      typeOfService: ['', Validators.required],
      organizationName: ['', Validators.required],
      fullName: ['', Validators.required],
      languages: [[], Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[+]?[91]?[0-9]{10}$|^[+]?[91]?[6-9][0-9]{9}$')]],
      email: ['', [Validators.email]],
      vehicleType: ['',Validators.required],
      kycDocument: [null,Validators.required],
      kycDocumentType: ['',Validators.required],
      additionalDocuments: [null],
      joinedOn: [new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })]
    });

  }
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.helperForm.patchValue({ additionalDocuments: target.files[0] });
    }
  }
  onFormSubmit(){
    if (this.helperForm.invalid) {
      this.toastService.error('Please fill all required fields.');
      return;
    }
    const formData = new FormData();
    const formValue = this.helperForm.value;
    Object.keys(formValue).forEach(key => {
        const value = formValue[key];
        if(value == null || value === undefined) return;
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, value);
        }
      });
    this.helperService.addHelper(formData)
      .subscribe({
        next: (response)=>{
          this.toastService.success('Helper added successfully');
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          const dialogRef = this.dialog.open(SubmissionComponent,{
            width: '600px',
            height: '600px',
            data:{
              helper: response
            }
          })
          dialogRef.afterClosed().subscribe(()=>{
            this.router.navigate(['/home']);
          })
          
        }
      })
  }
}