import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Session } from './shared/infrastructure/api';
import { I18n } from './shared/application/i18n';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
  ],
  template: `<a class="skip-link" href="#main-content" (click)="focusMain($event)">{{
      i.t('back')
    }}</a
    ><mat-sidenav-container class="shell"
      ><mat-sidenav
        #drawer
        [mode]="mobile() ? 'over' : 'side'"
        [opened]="!!session.user() && !mobile()"
        ><a class="wordmark" routerLink="/overview">AI<span>ToDu</span></a
        ><span class="nav-caption">{{ i.t('workspace') }}</span>
        <nav [attr.aria-label]="i.t('menu')">
          @for (link of links; track link.path) {
            @if (session.can(link.path)) {
              <a
                mat-button
                [routerLink]="'/' + link.path"
                routerLinkActive="selected"
                (click)="mobile() && drawer.close()"
                ><span class="nav-dot" aria-hidden="true"></span>{{ i.t(link.path) }}</a
              >
            }
          }
        </nav>
        <div class="sidebar-note"><span class="demo-dot"></span>{{ i.t('demo') }}</div></mat-sidenav
      ><mat-sidenav-content
        ><header class="topbar">
          @if (session.user()) {
            @if (mobile()) {
              <button mat-icon-button (click)="drawer.toggle()" [attr.aria-label]="i.t('menu')">
                ☰
              </button>
            }
            <div class="workspace-label">
              <strong>{{ i.t('workspace') }}</strong
              ><span>{{ i.t(session.user()!.role) }}</span>
            </div>
          } @else {
            <a class="wordmark small" routerLink="/login">AI<span>ToDu</span></a>
          }
          <div class="top-actions">
            <button mat-stroked-button (click)="i.toggle()" [attr.aria-label]="i.t('language')">
              {{ i.lang() === 'en_US' ? 'ES' : 'EN' }}
            </button>
            @if (session.user()) {
              <span class="user-name">{{ session.user()?.name }}</span
              ><button mat-button (click)="logout()">{{ i.t('logout') }}</button>
            }
          </div>
        </header>
        <main id="main-content" class="main-content" tabindex="-1"><router-outlet /></main>
        <footer>
          <span>AI-ToDu · IA-INNOVATION · 2026</span><span>{{ i.t('demo') }}</span
          ><a routerLink="/legal">{{ i.t('terms') }} · {{ i.t('privacy') }}</a>
        </footer></mat-sidenav-content
      ></mat-sidenav-container
    >`,
})
export class AppComponent {
  focusMain(event: Event) {
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  }
  readonly session = inject(Session);
  readonly i = inject(I18n);
  private router = inject(Router);
  readonly mobile = signal(matchMedia('(max-width: 960px)').matches);
  readonly links = [
    'overview',
    'inventory',
    'movements',
    'purchases',
    'sales',
    'logistics',
    'returns',
    'notifications',
    'team',
  ].map((path) => ({ path }));
  @HostListener('window:resize') resize() {
    this.mobile.set(matchMedia('(max-width: 960px)').matches);
  }
  async logout() {
    await this.session.logout().catch(() => undefined);
    await this.router.navigate(['/login']);
  }
}
