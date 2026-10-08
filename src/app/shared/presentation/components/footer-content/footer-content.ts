import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-content',
  standalone: true,
  styles: [`
    .footer {
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 24px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
      margin-top: auto;
    }
    .footer strong {
      color: #0F172A;
    }
  `],
  template: `
    <footer class="footer">
      <p>Powered by <strong>AI-ToDu Platform</strong> &copy; 2024</p>
      <p style="font-size: 12px; margin-top: 4px;">Optimizando la logística inteligente empresarial.</p>
    </footer>
  `
})
export class FooterContent {}
