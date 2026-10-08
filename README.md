# 🚀 AI-ToDu - Sistema Nervioso Logístico B2B

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white)

**AI-ToDu** es una plataforma integral SaaS (Software as a Service) B2B diseñada para optimizar y conectar en tiempo real las ventas, los inventarios y los despachos logísticos de empresas y comercios.

### 🌍 [Ver Demo en Vivo (GitHub Pages)](https://ai-todu.github.io/AIToDu-webapp/)

> **Nota para evaluación:** Este repositorio contiene la capa Frontend (MVP). Actualmente utiliza un entorno de simulación (Mock/Fake API) implementado con Angular Signals para manejar el estado en memoria. La arquitectura está 100% preparada para consumir servicios REST de un Backend (Spring Boot/Azure) en la siguiente fase.

---

## 🏗️ Arquitectura del Proyecto

El proyecto ha sido construido utilizando **Domain-Driven Design (DDD)** y los estándares más modernos de **Angular 17+** (Standalone Components, Signals, y Control Flow).

La aplicación está dividida en 5 **Bounded Contexts** (Módulos de Negocio) totalmente desacoplados, más un *Shared Kernel*:

*   🔐 **IAM (Identity & Access Management):** Gestión de usuarios, autenticación y protección de rutas (Auth Guards).
*   📊 **Reporting:** Dashboard gerencial interactivo con KPIs financieros y operativos.
*   📦 **Inventory:** Catálogo central (Core Domain). Gestión de SKUs, entradas de mercadería y control de stock físico.
*   🛒 **Sales:** Módulo POS (Punto de Venta). Carrito de compras dinámico, validación de stock en tiempo real y generación de boletas electrónicas.
*   🚚 **Logistics:** Tablero Kanban interactivo para el control de manifiestos, asignación de vehículos y seguimiento de entregas.
*   ⚙️ **Shared Kernel:** Motor base (Manejo de errores, adaptadores HTTP genéricos, Layouts y sistema i18n).

### Estructura de Directorios (DDD)
Cada módulo implementa una estricta separación por capas:
```text
src/app/
 ├── {modulo}/
 │   ├── application/     # Stores (Manejo de estado reactivo con Signals)
 │   ├── domain/          # Entidades puras y reglas de negocio
 │   ├── infrastructure/  # Consumo de APIs, DTOs y Traductores (Assemblers)
 │   └── presentation/    # Vistas y Componentes UI (HTML/CSS embebido)
```

---

## 🛠️ Tecnologías y Prácticas Implementadas

*   **Framework:** Angular (v17+) con Standalone Components.
*   **Reactividad:** Angular Signals (para el manejo de estado sincrónico y libre de RxJS overhead).
*   **Diseño:** UI/UX corporativo, Responsive, Modal interactions (sin alerts nativos).
*   **Internacionalización (i18n):** Soporte multi-idioma estructurado.

---

## 🚀 Despliegue Local (Para Desarrolladores)

Si deseas clonar y correr este proyecto en tu entorno local:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/AI-ToDu/AIToDu-webapp.git
   ```
2. Instala las dependencias:
   ```bash
   cd AIToDu-webapp
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   ng serve
   ```
4. Abre tu navegador en `http://localhost:4200/`.

---

## 👥 Equipo de Desarrollo

Este proyecto fue desarrollado colaborativamente por:

*   **Kevin** - Arquitectura Base, Shared Kernel y Enrutamiento.
*   **Fernando** - Módulo de Inventario.
*   **Darikson** - Módulo POS (Ventas) y Dashboard Gerencial.
*   **Luis** - Módulo de Logística (Despachos).
*   **Carlos** - Módulo IAM (Seguridad), i18n y Documentación.

---
*Powered by AI-ToDu Platform © 2024*
