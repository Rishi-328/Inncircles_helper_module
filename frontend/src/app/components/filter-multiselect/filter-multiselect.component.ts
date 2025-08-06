import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-multiselect',
  standalone: true,
  imports: [MatSelectModule,CommonModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './filter-multiselect.component.html',
  styleUrl: './filter-multiselect.component.scss'
})
export class FilterMultiselectComponent {
  @Input() label!: string;
  @Input() options: string[] = [];
  @Input() control!: FormControl;
  @Input() iconMap: {[key:string]:string} = {};


}
