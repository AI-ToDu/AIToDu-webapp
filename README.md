# 🚀 AI-ToDu - Sistema Nervioso Logístico B2B

![Angular](https://img.shields.io/badge/Angular_22-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular_Material-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)

**AI-ToDu** es una plataforma SaaS B2B diseñada para conectar las ventas, los inventarios y los despachos logísticos de pequeños negocios. Este repositorio contiene el **Frontend**, desarrollado con Angular y Angular Material.

### 🌍 [Ver Demo en Vivo (GitHub Pages)](https://ai-todu.github.io/ai-todu-webapp/)

> **Nota para evaluación:** la revisión TB1 **v0.2.0** utiliza una **Fake REST API persistente**. El recorrido local usa HTTP y almacenamiento JSON; la alternativa estática usa Service Worker e IndexedDB. Se trabaja con datos ficticios, sin pagos reales ni comprobantes fiscales. Java/Spring Boot, PostgreSQL y seguridad de producción pertenecen a una fase posterior. La versión pública debe contrastarse con la rama de revisión antes de presentarla.

---

## 🏗️ Arquitectura del Proyecto

La aplicación organiza sus responsabilidades siguiendo principios de **Domain-Driven Design (DDD)**, con **Angular 22**, Standalone Components, Signals, HttpClient y rutas con carga por área. Los módulos agrupan capacidades de negocio; su grado de separación se documenta en el informe.

* 📦 **Inventory:** catálogo de SKUs, conservación del producto, entradas, salidas e historial de movimientos.
* 🚚 **Logistics:** manifiestos vinculados a ventas, conductor, vehículo, destino, estados y confirmación del receptor.
* 📥 **Procurement:** órdenes de compra y recepción física parcial.
* 🛒 **Sales:** POS, validación de stock, recibo histórico de demostración y devoluciones.
* 🔔 **Notifications:** bandeja de avisos operativos.
* 🔐 **IAM:** acceso, perfiles demo, autorización y protección de rutas.
* 📊 **Reporting:** indicadores derivados de operaciones registradas.
* ⚙️ **Shared:** modelos, adaptador HTTP, componentes comunes e internacionalización.

### Estructura de Directorios (DDD)

```text
src/app/
 ├── inventory/         # Inventario y movimientos
 ├── logistics/         # Despachos y entrega
 ├── procurement/       # Compras y recepción
 ├── sales/             # POS, recibos y devoluciones
 ├── notifications/     # Bandeja operativa
 ├── iam/               # Acceso y equipo
 ├── reporting/         # Resumen operativo
 └── shared/
     ├── application/   # Internacionalización
     ├── domain/        # Modelos compartidos
     ├── infrastructure/# Adaptador HTTP
     └── presentation/  # UI y páginas comunes

public/mock/            # Copia trazable del motor canónico
tools/                  # Servidor demo, sincronización y pruebas
database/               # Modelo relacional de referencia
```

Los módulos funcionales contienen sus vistas en `presentation/`. El motor de demostración y sus reglas se mantienen en el repositorio canónico de la Fake API; el árbol no implica que todos los módulos tengan cuatro capas ya implementadas.

---

## 🛠️ Tecnologías y Prácticas Implementadas

* **Framework:** Angular 22 con Standalone Components, Signals y HttpClient.
* **Interfaz:** Angular Material, diseño responsive, diálogos y controles etiquetados.
* **Internacionalización:** inglés predeterminado (`en_US`) y español latinoamericano (`es_419`).
* **Persistencia demo:** JSON por HTTP local o IndexedDB en el navegador, según el transporte elegido.
* **Reglas operativas:** recepción parcial, rechazo de sobreventa, conservación de productos, anulación y devoluciones con validaciones.
* **Calidad:** pruebas de dominio, permisos/tenant, concurrencia HTTP, persistencia tras reinicio, migración de recibos y cobertura de traducciones.

---

## 🚀 Despliegue Local (Para Desarrolladores)

**Requisito:** Node.js 24 o posterior.

1. Clona la rama de revisión:

   ```sh
   git clone --branch fix/tb1-readiness https://github.com/AI-ToDu/ai-todu-webapp.git
   cd ai-todu-webapp
   ```

2. Instala las dependencias desde el lockfile:

   ```sh
   npm ci
   ```

3. Ejecuta la demostración integrada:

   ```sh
   npm run demo
   ```

4. Abre [http://127.0.0.1:8850/?api=http](http://127.0.0.1:8850/?api=http). El comando compila la interfaz y sirve el adaptador HTTP en el mismo puerto.

El estado se conserva en `.demo-data/state.json`, excluido de Git. La recarga y el reinicio del servidor conservan las transacciones aceptadas. La selección HTTP persiste al navegar o recargar dentro de la pestaña.

### Publicación estática

```sh
npm run build:pages
```

En HTTPS o localhost, un Service Worker intercepta las solicitudes del mismo origen a `/api/v1` y guarda el estado en IndexedDB. La información pertenece a ese navegador/origen, puede eliminarse y no se comparte entre dispositivos. La URL de Pages no es un backend remoto consultable con curl. La primera carga requiere inicializar los recursos y el worker; los fallos se muestran en la interfaz.

---

## 🔐 Cuentas de Demostración

| Rol | Correo | Acceso demo |
| --- | --- | --- |
| Administrador | admin@demo.ai-todu.test | Secciones de la demo e indicadores. |
| Almacén | warehouse@demo.ai-todu.test | Inventario, movimientos, compras y avisos. |
| Ventas | sales@demo.ai-todu.test | Inventario, ventas, devoluciones y avisos. |
| Logística | logistics@demo.ai-todu.test | Inventario, despachos y avisos. |

Las cuatro cuentas usan la contraseña de prueba intencionalmente pública **DemoOnly2026!**. Las identidades, hashes y sesiones son infraestructura de demostración, sin equivalencia con seguridad de producción.

## 🔄 Recorrido Integrado de Ejemplo

Con el estado inicial de demostración:

1. Crear una compra de cuatro unidades de arroz y recibir dos: el stock cambia de **8 a 10** y la orden queda parcialmente recibida.
2. Vender dos unidades: el stock cambia de **10 a 8** y el recibo histórico registra **PEN 290**.
3. Seleccionar la venta, conductor, vehículo y destino; iniciar ruta y confirmar receptor. El despacho no descuenta stock por segunda vez.
4. Consultar el resumen: ventas netas **PEN 290**, contribución bruta **PEN 70** y existencias al costo registrado **PEN 1,510**. La recarga conserva el resultado.
5. Comprobar rechazo de exceso de recepción, sobreventa, producto bloqueado, anulación repetida, recursos ocupados y consulta no autorizada de indicadores.

Son datos sintéticos de prueba, no resultados comerciales reales.

![Recorrido HTTP local con datos ficticios](docs/evidence/overview.jpg)

## ✅ Verificación y Alcance

```sh
npm test
npm run build
npm run build:pages
```

Las pruebas cubren reglas, aislamiento por empresa/rol, concurrencia HTTP real, persistencia, recibos, el diseño SQL de 35 tablas, traducciones e integridad de las fuentes copiadas. La compilación mantiene el presupuesto original del bundle. La investigación con usuarios y una auditoría completa de accesibilidad siguen pendientes.

El [DDL de 35 tablas](database/schema.sql), validado en SQLite, es un destino de migración relacional; la demo usa 35 colecciones JSON. Aún faltan flujos completos de lotes/ubicaciones/variantes, múltiples paradas e intentos, administración de clientes, activación/recuperación de empleados, suscripciones, integraciones fiscales/de pago y servicios productivos Java/PostgreSQL.

### Fuente Canónica de la Fake API

[ai-todu-fake-api](https://github.com/AI-ToDu/ai-todu-fake-api/tree/fix/tb1-readiness) mantiene el motor, adaptador HTTP, OpenAPI y base relacional. [mock-provenance.json](mock-provenance.json) fija el commit y los hashes normalizados. Tras modificar y confirmar el motor allí, sincronizar desde este repositorio:

```sh
npm run mock:sync -- ../ai-todu-fake-api
```

Después ejecutar pruebas y compilación. Las copias del motor se actualizan mediante esa sincronización. El [OpenAPI incluido](public/mock/openapi.json) describe el contrato demo implementado.

### Ramas y Publicación

La revisión se mantiene en `fix/tb1-readiness`. `develop` conserva la base inicial y la publicación del frontend revisado se realiza desde `main` tras la integración. El workflow verifica fix/PR y restringe Pages a main. La configuración pública registrada utilizaba `gh-pages`; comprobar su origen y el cambio a Actions antes de dar por publicada esta revisión. Consultar [REVIEW.md](REVIEW.md).

---

## 🔗 Ecosistema del Proyecto

* **[Landing Page](https://github.com/AI-ToDu/ai-todu-platform/tree/fix/tb1-readiness):** presentación del producto y acceso a la demo.
* **[Frontend](https://github.com/AI-ToDu/ai-todu-webapp/tree/fix/tb1-readiness):** espacio de trabajo Angular.
* **[Fake REST API](https://github.com/AI-ToDu/ai-todu-fake-api/tree/fix/tb1-readiness):** motor canónico de demostración y contrato OpenAPI.
* **[Informe](https://github.com/AI-ToDu/ai-todu-report/tree/fix/tb1-readiness):** requisitos, arquitectura, diseño de datos y evidencias.

---

## 👥 Equipo de Desarrollo

Proyecto desarrollado por **IA-INNOVATION**:

* **Kevin Junior Salazar Marquina:** arquitectura base, recursos compartidos y enrutamiento del frontend inicial.
* **Fernando André Condezo Pacheco:** módulo de inventario del frontend inicial.
* **Darikson Bill Salazar Quiche:** POS y dashboard del frontend inicial.
* **Luis Carlos Chui Kcomt:** módulo de logística del frontend inicial.
* **Carlos Alberto Bernal Torres:** IAM y documentación del frontend inicial.

Las contribuciones históricas y sus fuentes se registran en el informe. Las mejoras posteriores se acreditan con sus commits y revisiones correspondientes.

---
*Desarrollado por el equipo IA-INNOVATION · AI-ToDu · UPC · 2026.*
