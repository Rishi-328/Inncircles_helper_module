import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AddHelperComponent } from './pages/add-helper/add-helper.component';
import { UpdateHelperComponent } from './pages/update-helper/update-helper.component';

export const routes: Routes = [
    {path:'', redirectTo:'/home',pathMatch:'full'},
    {path:'home',component: HomeComponent},
    {path:'add-helper',component:AddHelperComponent},
    {path:'update/:id',component:UpdateHelperComponent}
];
