import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-row',
  standalone: true,
  imports: [],
  templateUrl: './info-row.component.html',
  styleUrl: './info-row.component.scss'
})
export class InfoRowComponent {
  @Input() label?: string;
  @Input() value?: string | number | null | {};

}
