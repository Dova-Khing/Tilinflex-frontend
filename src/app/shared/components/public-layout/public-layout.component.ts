import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AnimeService } from '../../../core/services/anime.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  searchQuery = '';
  suggestions: any[] = [];
  showSuggestions = false;
  scrolled = false;

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private anime: AnimeService, private router: Router) {}

  ngOnInit() {
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe(q => {
      if (q.length >= 2) {
        this.anime.suggest(q).subscribe({ next: (r: any) => { this.suggestions = r?.data?.suggestions ?? []; this.showSuggestions = true; } });
      } else {
        this.suggestions = [];
        this.showSuggestions = false;
      }
    });
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  @HostListener('window:scroll')
  onScroll() { this.scrolled = window.scrollY > 50; }

  onSearchInput() { this.search$.next(this.searchQuery); }

  goSearch() {
    if (!this.searchQuery.trim()) return;
    this.showSuggestions = false;
    this.router.navigate(['/browse'], { queryParams: { q: this.searchQuery } });
  }

  selectSuggestion(s: any) {
    this.searchQuery = s.name ?? s.jname ?? '';
    this.showSuggestions = false;
    this.router.navigate(['/anime', s.id]);
  }

  hideSuggestions() { setTimeout(() => this.showSuggestions = false, 150); }
}
