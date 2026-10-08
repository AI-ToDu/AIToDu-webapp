// RUTA EXACTA: src/app/app.routes.ts
import { Routes } from '@angular/router';
import { iamGuard } from './iam/infrastructure/iam.guard';

// Vistas Generales
import { Home } from './shared/presentation/views/home/home';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';

// Vistas IAM (Seguridad)
import { Login } from './iam/presentation/views/login';
import { Register } from './iam/presentation/views/register';

// Vistas Modulares
import { Dashboard } from './reporting/presentation/views/dashboard';
import { ProductList } from './inventory/presentation/views/product-list';
import { ProductForm } from './inventory/presentation/views/product-form';
import { Pos } from './sales/presentation/views/pos';
import { DispatchList } from './logistics/presentation/views/dispatch-list';

const baseTitle = 'AI-ToDu';

export const routes: Routes = [
  // Públicas
  { path: 'home', component: Home, title: `${baseTitle} - Bienvenida` },
  { path: 'login', component: Login, title: `${baseTitle} - Ingreso Seguro` },
  { path: 'register', component: Register, title: `${baseTitle} - Crear Cuenta` }, // NUEVA RUTA DE REGISTRO

  // Privadas (Protegidas por iamGuard)
  { path: 'reporting/dashboard', component: Dashboard, title: `${baseTitle} - Panel Gerencial`, canActivate: [iamGuard] },
  { path: 'inventory/products', component: ProductList, title: `${baseTitle} - Catálogo`, canActivate: [iamGuard] },
  { path: 'inventory/products/new', component: ProductForm, title: `${baseTitle} - Registro de Producto`, canActivate: [iamGuard] },
  { path: 'sales/pos', component: Pos, title: `${baseTitle} - Punto de Venta`, canActivate: [iamGuard] },
  { path: 'logistics/dispatches', component: DispatchList, title: `${baseTitle} - Despachos`, canActivate: [iamGuard] },

  // Fallbacks
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFound, title: `${baseTitle} - Extraviado` }
];
