import { Component ,inject, OnInit} from '@angular/core';
import { HelperUser } from './../../models/helper.model';
import { CommonModule } from '@angular/common';
import { HelperDetailComponent } from '../../components/helper-detail/helper-detail.component';
import { HelperListComponent } from '../../components/helper-list/helper-list.component';
import { MaterialModule } from '../../shared/material.module';
import { AddHelperComponent } from '../add-helper/add-helper.component';
import { Router } from '@angular/router'
import { HelpersService } from '../../services/helpers.service';
import { FormControl } from '@angular/forms';
import { serviceTypes,Organization,iconMap } from './../../models/helper.model';
import { FilterMultiselectComponent } from '../../shared/filter-multiselect/filter-multiselect.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,HelperDetailComponent,HelperListComponent,AddHelperComponent,FilterMultiselectComponent,MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  selectedHelper?: HelperUser;
  router = inject(Router);
  helperService = inject(HelpersService);
  helperUsers: HelperUser[] = [];
  totalCount: number = 0;
  sortTerm: string = '';
  searchTerm: string = '';
  serviceTypes: string[] = serviceTypes;
  Organization: string[] = Organization;
  iconMap: {[key: string]: string} = iconMap;
  service = new FormControl<string[]>([]);
  org = new FormControl<string[]>([]);
  showFilter: boolean = false;
  hidden: boolean = true;

  onSelectedHelper(helper: HelperUser){
    this.selectedHelper = helper;
  }
  navigateToAddHelper() {
    this.router.navigate(['/add-helper']);
  }
  getHelperUsers() {
    this.helperService.getHelpers(this.sortTerm,this.searchTerm,this.service.value || [],this.org.value || [])
      .subscribe({
        next: (response: HelperUser[])=>{
          this.helperUsers = response;
          this.selectedHelper = this.helperUsers.length > 0 ? this.helperUsers[0] : undefined;
        },
      });
      this.sortTerm = '';
      this.searchTerm = '';  
  }
  getCount(){
    this.helperService.getCount()
    .subscribe((response)=>{
      this.totalCount = response.count;
    })
  }
  onSortChange(sortTerm: string){
    this.sortTerm = sortTerm;
    this.getHelperUsers();
  }
  applyFilter(){
    this.getHelperUsers();
    this.showFilter = false;
    this.hidden = false;
    
  }
  resetFilter(){
    this.service.reset();
    this.org.reset();
    this.showFilter = false;
    this.hidden = true;
    this.getHelperUsers();
  }
  ngOnInit(){
    this.getHelperUsers();
    this.getCount();
  }

}

