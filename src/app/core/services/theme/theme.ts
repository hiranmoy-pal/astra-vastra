import { Injectable, signal, effect } from '@angular/core';
import { Storage } from '../storage/storage';

@Injectable({ providedIn: 'root' })
export class Theme {
  theme = signal<'light' | 'dark'>('light');

  constructor(private storage: Storage) {
    this.initTheme();

    effect(() => {
      const current = this.theme();

      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle(
          'dark-theme',
          current === 'dark'
        );
      }

      this.storage.set('theme', current);

      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', current);
      }
    });
  }

  private async initTheme() {
    let saved: 'light' | 'dark' | null = null;

    if (typeof window !== 'undefined') {
      saved = localStorage.getItem('theme') as any;
    }

    if (!saved) {
      saved = await this.storage.get<'light' | 'dark'>('theme');
    }

    if (saved) {
      this.theme.set(saved);
    }
  }

  toggleTheme() {
    this.theme.update(t => (t === 'light' ? 'dark' : 'light'));
  }
}