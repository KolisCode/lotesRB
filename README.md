# LotesRB — Frontend

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

> Frontend del portal inmobiliario LotesRB. **API:** [ApiLotesRB](https://github.com/KolisCode/ApiLotesRB) · **Demo:** [lotesrb.kolisevm.online](https://lotesrb.kolisevm.online)

Aplicación web para la venta de lotes del proyecto Robinson. Sitio público con catálogo, detalle y formulario de contacto, más panel de administración para gestionar lotes y mensajes.

## Stack

- **Angular 21** — standalone components, signals, control flow nativo (`@if`, `@for`)
- **SCSS** — estilos por componente
- **TypeScript 5**

## Requisitos previos

- Node.js 20+
- API corriendo en `http://localhost:3001/api` (ver `../lotes-rb-api`)

## Desarrollo local

```bash
npm install
npm start        # http://localhost:4200
```

## Build de producción

```bash
npm run build    # genera dist/lotes-rb/
```

En producción el `apiUrl` queda como `/api` (relativo al mismo dominio), lo que asume que Nginx hace proxy de `/api` hacia el puerto 3001.

---

## Estructura

```
src/
├── environments/
│   ├── environment.ts           # Dev  → apiUrl: http://localhost:3001/api
│   └── environment.prod.ts      # Prod → apiUrl: /api
│
└── app/
    ├── app.routes.ts            # Rutas con lazy loading
    ├── app.config.ts            # Providers globales (router, http, interceptors)
    │
    ├── core/
    │   ├── config/
    │   │   └── project.constants.ts      # Número WhatsApp ← editar antes de prod
    │   ├── guards/
    │   │   └── auth.guard.ts             # Redirige a /admin/login si no hay JWT válido
    │   ├── interceptors/
    │   │   ├── auth.interceptor.ts       # Adjunta Bearer token en requests a la API
    │   │   └── error.interceptor.ts      # Log de errores de red (status 0)
    │   ├── models/
    │   │   └── lote.model.ts             # Interfaces: Lote, Servicio, EstadoLote
    │   └── services/
    │       ├── lotes.service.ts          # GET público de lotes + filtros/resumen
    │       ├── contacto.service.ts       # POST público del formulario
    │       ├── admin-auth.service.ts     # Login/logout, token en sessionStorage
    │       ├── admin-lotes.service.ts    # CRUD lotes + upload de imagen
    │       └── admin-contacto.service.ts # Mensajes: listar, marcar leído, eliminar
    │                                     # Expone noLeidosCount signal (badge sidebar)
    ├── shared/
    │   ├── components/
    │   │   ├── navbar/                   # Navbar pública con menú móvil
    │   │   ├── footer/                   # Footer ← editar placeholders antes de prod
    │   │   └── lote-card/                # Tarjeta de lote reutilizable
    │   └── pipes/
    │       └── precio-pipe.ts            # Formatea número como $XX.XXX.XXX COP
    │
    └── features/
        ├── home/                         # Landing: hero + stats + lotes destacados
        ├── proyecto/                     # Página estática del proyecto
        ├── lotes/
        │   ├── lista/                    # Catálogo con filtros y ordenamiento
        │   └── detalle/                  # Ficha completa: galería, servicios, CTA
        ├── contacto/                     # Formulario de contacto público
        ├── not-found/                    # 404
        └── admin/
            ├── login/                    # Pantalla de acceso
            ├── layout/                   # Shell: sidebar + header responsive
            ├── dashboard/                # Stats (via /api/lotes/stats) + últimos mensajes
            ├── lotes/                    # Tabla CRUD + panel lateral con form + upload imagen
            └── contactos/               # Lista de mensajes, filtro no leídos, marcar/eliminar
```

---

## Rutas

### Públicas

| Ruta | Descripción |
|------|-------------|
| `/home` | Landing page |
| `/proyecto` | Información del proyecto |
| `/lotes` | Catálogo con filtros por estado, área y precio |
| `/lotes/:id` | Ficha de lote con galería, servicios y CTA WhatsApp |
| `/contacto` | Formulario de contacto |

### Panel admin (`/admin/*` — requiere JWT activo)

| Ruta | Descripción |
|------|-------------|
| `/admin/login` | Login (no requiere auth) |
| `/admin/dashboard` | Resumen de estadísticas + mensajes sin leer |
| `/admin/lotes` | Gestión de lotes: crear, editar, eliminar, subir imagen |
| `/admin/contactos` | Mensajes recibidos: filtrar no leídos, marcar leído, eliminar |

---

## Autenticación

El JWT se guarda en `sessionStorage` (se limpia al cerrar la pestaña). El `auth.interceptor` lo adjunta automáticamente en todas las requests a `environment.apiUrl`. El guard verifica que el token exista y que el campo `exp` no haya vencido; si falla, redirige a `/admin/login`.

---

## Upload de imágenes

El formulario de lotes sube archivos directamente a `POST /api/upload/imagen` (requiere JWT). La API guarda el archivo en `uploads/` y devuelve la URL completa. Formatos aceptados: JPG, PNG, WebP. Tamaño máximo: 5 MB.

---

## Pendiente antes de producción

1. **Número de WhatsApp** — `src/app/core/config/project.constants.ts`:
   ```typescript
   whatsappNumber: '573XXXXXXXXX',
   whatsappBase:   'https://wa.me/573XXXXXXXXX',
   ```

2. **Datos de contacto** — reemplazar placeholders `[...]` en:
   - `src/app/features/contacto/contacto.html`
   - `src/app/shared/components/footer/footer.html`
