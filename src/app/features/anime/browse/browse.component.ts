import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule],
  template: `<div style="padding:6rem 3rem;color:#fff">Browse — próximamente</div>`,
})
export class BrowseComponent {}
