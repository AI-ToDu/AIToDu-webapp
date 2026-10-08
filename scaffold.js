const fs = require('fs');
const path = require('path');

const createStructure = () => {
  console.log('Construyendo la arquitectura DDD para AI-ToDu...');

  // 1. Definir rutas exactas
  const folders = [
    'src/environments',
    'public/i18n',
    'src/app/shared/domain/model',
    'src/app/shared/infrastructure',
    'src/app/shared/presentation/components/base-form',
    'src/app/shared/presentation/components/footer-content',
    'src/app/shared/presentation/components/language-switcher',
    'src/app/shared/presentation/components/layout',
    'src/app/shared/presentation/views/home',
    'src/app/shared/presentation/views/page-not-found',
  ];

  // Módulos de negocio (Bounded Contexts)
  const modules = ['iam', 'inventory', 'sales', 'logistics', 'reporting'];
  const layers = ['application', 'domain/model', 'infrastructure', 'presentation/components', 'presentation/views'];

  modules.forEach(mod => {
    layers.forEach(layer => {
      folders.push(`src/app/${mod}/${layer}`);
    });
  });

  // 2. Crear las carpetas de forma segura
  folders.forEach(folder => {
    const fullPath = path.join(__dirname, folder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  // 3. Crear algunos archivos base críticos vacíos para ahorrar tiempo
  const files = {
    'src/environments/environment.ts': 'export const environment = { production: true };',
    'src/environments/environment.development.ts': 'export const environment = { production: false };',
    'public/i18n/en.json': '{\n  "home": "Home"\n}',
    'public/i18n/es.json': '{\n  "home": "Inicio"\n}',
    'src/app/shared/domain/model/base-entity.ts': 'export interface BaseEntity {\n  id: string;\n}',
    'src/app/shared/infrastructure/base-api.ts': '// Clase base para inyectar HttpClient\n',
    'src/app/shared/infrastructure/base-api-endpoint.ts': '// Clase abstracta para CRUD genérico\n',
    'src/app/shared/presentation/components/layout/layout.html': '<p>Layout Works!</p>\n<router-outlet></router-outlet>',
    'src/app/shared/presentation/components/layout/layout.ts': "import { Component } from '@angular/core';\nimport { RouterOutlet } from '@angular/router';\n\n@Component({\n  selector: 'app-layout',\n  imports: [RouterOutlet],\n  templateUrl: './layout.html',\n  styleUrl: './layout.css'\n})\nexport class Layout {}",
    'src/app/shared/presentation/components/layout/layout.css': '/* Estilos del layout */'
  };

  Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  });

  console.log('✅ ¡Estructura creada con éxito! Todo está en su lugar.');
  console.log('👉 Tip: Haz clic en la carpeta "src" en WebStorm para que se refresque visualmente.');
};

createStructure();
