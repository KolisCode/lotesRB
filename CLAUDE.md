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
│   ├── services/
│   │   ├── lotes.service.ts        ← catálogo público
│   │   ├── admin-auth.service.ts   ← JWT en sessionStorage (clave: rb_admin_token)
│   │   ├── admin-lotes.service.ts  ← CRUD admin
│   │   └── admin-contacto.service.ts
│   ├── guards/auth.guard.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts     ← inyecta Bearer token
│   │   └── error.interceptor.ts    ← maneja status 0 (sin conexión)
│   └── config/project.constants.ts
├── features/                       ← lazy loaded con loadComponent()
│   ├── home/
│   ├── lotes/lista/ y detalle/
│   ├── proyecto/                   ← tiene mapa-placeholder SVG estático
│   ├── contacto/
│   ├── admin/                      ← protegido por authGuard
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── lotes/
│   │   └── contactos/
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
- Auth: JWT de 2h, header `Authorization: Bearer {token}`
- Token almacenado en `sessionStorage` bajo `rb_admin_token`

## Campos de lote con coordenadas

El modelo tiene `latitud` y `longitud` en DB, DTO y servicio — **mapeados pero no visualizados**.
La vista `proyecto.html` tiene un SVG placeholder. Pendiente: integrar `@angular/google-maps`.

## Estado de tests

9 archivos `.spec.ts` existen pero contienen solo el boilerplate de Angular. Sin cobertura real.

## Deploy

```bash
npm run build           # genera dist/lotes-rb/browser/
# El MCP droplet deploy_project "lotes-rb" hace build + rsync + nginx reload
```

Dominio en producción: `lotesrb.koliscode.com`
