import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HelperDetailComponent } from './components/helper-detail/helper-detail.component';
import { HomeComponent } from './pages/home/home.component';
import { HelperListComponent } from './components/helper-list/helper-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HomeComponent,HelperDetailComponent,HelperListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'practice';
}
