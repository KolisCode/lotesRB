# LotesRB — Frontend Angular

Sistema de catálogo y venta de lotes inmobiliarios. Frontend en Angular 21 + Tailwind 4.
El backend corre en `lotes-rb-api/` (NestJS, puerto 3001).

**Instrucción:** Mantén este archivo actualizado de forma proactiva. Si en una conversación surge información útil — decisiones de arquitectura, convenciones nuevas, cambios de rutas — actualiza la sección correspondiente.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Angular 21, standalone components |
| Estilos | Tailwind 4 (via `@tailwindcss/vite`) |
| Formularios | ReactiveFormsModule |
| HTTP | HttpClient + interceptores |
| Build | Vite (via `@angular/build`) |
| Tests | Vitest (configurado, sin tests reales aún) |

## Estructura

```
src/app/
├── core/
│   ├── models/lote.model.ts        ← interfaces TypeScript
│   ├── models/site-config.model.ts ← interfaz SiteConfig + DEFAULT_SITE_CONFIG (respaldo)
│   ├── services/
│   │   ├── lotes.service.ts        ← catálogo público
│   │   ├── site-config.service.ts  ← config pública (signal `config`, whatsappUrl()); reemplazó project.constants
│   │   ├── admin-auth.service.ts   ← JWT en sessionStorage (clave: rb_admin_token)
│   │   ├── admin-lotes.service.ts  ← CRUD admin
│   │   ├── admin-site-config.service.ts ← PUT config + upload de imagen
│   │   └── admin-contacto.service.ts
│   ├── guards/auth.guard.ts
│   └── interceptors/
│       ├── auth.interceptor.ts     ← inyecta Bearer token
│       └── error.interceptor.ts    ← maneja status 0 (sin conexión)
├── features/                       ← lazy loaded con loadComponent()
│   ├── home/
│   ├── lotes/lista/ y detalle/
│   ├── proyecto/                   ← tiene mapa-placeholder SVG estático
│   ├── contacto/
│   ├── admin/                      ← protegido por authGuard
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── lotes/
│   │   ├── contactos/
│   │   └── configuracion/          ← edita SiteConfig: contacto, marca, hero, ventajas, imagen
│   └── not-found/
└── shared/components/
    ├── navbar/
    ├── footer/
    └── lote-card/                  ← tiene loading="lazy", sin NgOptimizedImage
```

## Convenciones

- Todos los componentes son **standalone** (sin NgModule)
- Rutas con **lazy loading** via `loadComponent()`
- Formularios reactivos con `ReactiveFormsModule`
- Estilos con clases Tailwind + `styles.scss` para globales
- No usar `ng build` para verificar tipos — usar `npx tsc --noEmit`
- Archivo de entorno: `src/environments/environment.ts` (dev) y `environment.prod.ts` (prod, URL relativa `/api`)

## API (backend local)

- Dev: `http://localhost:3001/api`
- Prod: `/api` (relativo — Nginx hace proxy en el servidor)
- Auth: access corto + **refresh token**. `login` guarda ambos en `sessionStorage`
  (`rb_admin_token` / `rb_admin_refresh`). El `authInterceptor` renueva ante 401 (llamada
  compartida) y reintenta; el `authGuard` también renueva si el access expiró pero hay refresh
  válido. Si el refresh falla → `logout()` + redirect a `/admin/login`.

## Mapa

`MapaLote` (`shared/components/mapa-lote/`) usa **Leaflet + tiles OSM** (sin API key). Se muestra
en el detalle de lote cuando hay coordenadas. En prod, si se añade CSP en Nginx hay que permitir
`img-src *.tile.openstreetmap.org`. CSS de Leaflet cargado vía `angular.json` styles.

## Contenido autoadministrable (SiteConfig)

Casi todo el contenido del sitio público se edita desde **admin → Configuración** y se sirve
por `GET /api/site-config` (consumido vía `SiteConfigService`, signal `config`):
contacto/WhatsApp, branding, hero, ventajas, y **toda la página Proyecto** (municipio, nombre,
descripción, `distancias[]`, `infraestructura[]`, `pasos[]`, financiación). Ya no hay textos
`[placeholder]` hardcodeados. Los defaults de respaldo viven en `core/models/site-config.model.ts`.

## Campos de lote con coordenadas

El modelo tiene `latitud` y `longitud` en DB, DTO y servicio — **mapeados pero no visualizados**.
`proyecto.html` tiene un SVG placeholder (el nombre del proyecto sí es dinámico). Pendiente:
integrar un mapa real (`@angular/google-maps` o Leaflet).

## Estado de tests

9 archivos `.spec.ts` existen pero contienen solo el boilerplate de Angular. Sin cobertura real.

## Deploy

```bash
npm run build           # genera dist/lotes-rb/browser/
# El MCP droplet deploy_project "lotes-rb" hace build + rsync + nginx reload
```

Dominio en producción: `lotesrb.koliscode.com`
