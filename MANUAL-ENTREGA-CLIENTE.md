# Manual de Entrega — Vamos Jacó Tours

> Documento de transferencia completa del sitio web al cliente.
> Sitio creado y desarrollado por **Siwakode**.

---

## 1. Resumen del proyecto

Sitio web de **Vamos Jacó Tours** (Costa Rica): catálogo de tours, reservas,
administración interna y módulo de comisiones.

| Dato | Valor |
|---|---|
| Sitio en producción | `https://www.vamosjacotours.com` |
| Framework | [Astro 5](https://astro.build) (modo servidor/SSR) |
| UI | React 19 + Tailwind CSS 4 |
| Bases de datos | [Supabase](https://supabase.com) (PostgreSQL) |
| Hosting / deploy | Vercel |
| Correos | Resend |

---

## 2. Requisitos para trabajar el proyecto

- **Node.js** versión 18 o superior (https://nodejs.org)
- **Git** (https://git-scm.com)
- Una cuenta de **Supabase** (gratis) para la base de datos
- Una cuenta de **Vercel** (gratis) para el deploy
- Editor recomendado: VS Code (https://code.visualstudio.com)

---

## 3. Instalación local

En la terminal:

```bash
# 1. Clonar el repositorio
git clone <URL-del-repositorio>
cd vamosjt

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
cp .env.example .env

# 4. Llenar .env con tus valores (ver sección 4) y guardar

# 5. Levantar el sitio en local
npm run dev
```

Abrir `http://localhost:4321` en el navegador.

> Si el sitio carga pero los tours no aparecen, es porque la variable `PUBLIC_SUPABASE_URL`
> o `PUBLIC_SUPABASE_ANON_KEY` están vacías o mal escritas en el `.env`.

---

## 4. Variables de entorno (`.env`)

Todas las variables para que el sitio funcione se definen en el archivo `.env`
(local) y en el panel de Vercel (producción). Deben ser **idénticas en ambos**.

| Variable | Para qué sirve | ¿Obligatoria? |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase (`https://XXXX.supabase.co`) | ✅ Sí |
| `PUBLIC_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase | ✅ Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (admin) de Supabase. **Nunca** debe exponerse en el navegador | ✅ Sí |
| `RESEND_API_KEY` | Envío de correos de confirmación (Resend) | ✅ Sí (si usas correos) |
| `MAINTENANCE_MODE` | `true` activa el modo mantenimiento del sitio | No |
| `MAINTENANCE_TOKEN` | Token para entrar al sitio mientras está en mantenimiento | No |
| `TILOPAY_*` | Credenciales de pago TiloPay (sistema en desuso) | No |

> ⚠️ **Seguridad:** el archivo `.env` NO se sube al repositorio (está en `.gitignore`).
> No compartirlo con nadie ni publicarlo.

---

## 5. Estructura del proyecto

```
vamosjt/
├── public/            # Imágenes, favicon, videos (se sirven tal cual)
├── src/
│   ├── pages/         # Páginas del sitio (inicio, tours, checkout, admin…)
│   ├── components/    # Componentes React/Astro
│   ├── layouts/       # Layout general (SEO, scripts, GA)
│   ├── lib/           # Lógica: Supabase, correos, reservas, auditoría
│   ├── data/          # Datos locales (FAQs, datos de tours en fallback)
│   ├── store/         # Estado global (idioma EN/ES, etc.)
│   └── styles/        # Estilos globales
├── migration-*.sql    # Migraciones de base de datos (aplicar en Supabase)
├── supabase-schema.sql# Esquema completo de la base de datos
├── astro.config.mjs   # Configuración de Astro (adapter de Vercel)
└── package.json       # Dependencias y comandos
```

### Comandos útiles

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor local de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run preview` | Previsualizar el build localmente |
| `npm run astro check` | Validar tipos y errores |

---

## 6. Panel de administración

- Entra a `https://www.vamosjacotours.com/admin` (o `/admin` en local).
- Inicia sesión con un usuario registrado en Supabase (Auth) que tenga rol `admin`.
- Funciones: gestionar tours, reservas, calendario, comisiones, galería, equipo,
  suscriptores, correos, usuarios y permisos.

### Cómo dar permisos de admin a una cuenta

1. En [supabase.com](https://supabase.com), abre tu proyecto → menú **Authentication** → **Users**.
2. Confirma/crea el usuario con su correo.
3. Copia el GUID (`id`) del usuario.
4. Ve a **SQL Editor** y ejecuta:

```sql
UPDATE public.profiles
SET role = 'admin', full_name = 'Admin'
WHERE email = 'correo@del-cliente.com';
```

(O usa el archivo `migration-set-admin.sql`, cambiando el correo.)

---

## 7. Base de datos (Supabase)

### Qué contiene

- **tours** — catálogo de tours (ES/EN, precios, galería, opciones de precio)
- **bookings** — reservas de clientes y su estado
- **commissions** — comisiones registradas en el módulo de comisiones
- **profiles** — usuarios y roles del panel admin
- **team_members, subscribers, blocked_dates, tour_reviews, audit_log, rate_limits, role_permissions** — soporte del sitio

### Cómo acceder

1. Entra a [supabase.com](https://supabase.com) con la cuenta dueña del proyecto.
2. Abre el proyecto.
3. **Table Editor** — ver/editar filas (como una hoja de cálculo).
4. **SQL Editor** — ejecutar consultas o migraciones.

### Cómo aplicar una migración

1. Abre el archivo `migration-*.sql` del proyecto.
2. Copia todo el contenido.
3. Pégalo en **SQL Editor** de Supabase y pulsa **Run**.

### Pasarla/tranferirla al cliente

Hay dos opciones, según lo que quieran recibir:

**Opción A — Transferencia de propiedad (recomendada):**
1. En [supabase.com](https://supabase.com) → **Organization Settings** del proyecto.
2. Sección **Members** (o **Transfer project**).
3. Agrega el correo del cliente como propietario/Owner del proyecto.
4. El cliente aceptará la invitación y tendrá control total.

**Opción B — Respaldo manual (dumps):**
1. En el proyecto → **Database** → **Backups** → crear un respaldo (o "Download backup").
2. Para una copia exacta en otro proyecto:
   ```bash
   pg_dump --dbname="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres" -f backup.sql
   ```
   (Los datos de conexión están en **Project Settings → Database → Connection string**.)
3. Restaurar en el proyecto destino con `psql`.

> ⚠️ Al transferir, también se entregan las variables del `.env` relacionadas con
> Supabase (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
> Si el cliente regenera las claves en **Project Settings → API Keys**, debe actualizarlas
> en Vercel y en el `.env`. **No regenerarlas** antes de actualizar la deploy, o el sitio dejará de funcionar.

---

## 8. Deploy en Vercel

El proyecto se despliega automáticamente con cada `push` al repositorio conectado.

### Cómo está configurado

- Adapter de Astro: `@astrojs/vercel` (ver `astro.config.mjs`)
- Configuración extra en `vercel.json`: headers de seguridad (CSP, HSTS, etc.)
- Build: `npm run build`, output en `dist/client`

### Quitar el proyecto de la cuenta actual de Vercel y pasarlo al cliente

1. Entra a [vercel.com](https://vercel.com) con la cuenta que tiene el proyecto.
2. Abre el proyecto (`vamosjt`).
3. **Settings → General → Danger Zone:**
   - *Transfer Project*: ingresa el correo de la cuenta Vercel del cliente. El cliente
     debe aceptar la transferencia desde su cuenta.
   - (Alternativa) *Delete Project*: si el cliente prefiere crear el proyecto desde cero
     conectando el repo a su cuenta.
4. Tras transferir/crear, configurar las **variables de entorno en Vercel**:
   - **Settings → Environment Variables** → agregar la MISMA tabla de la sección 4
     (con los valores reales), para máquinas **Production**, **Preview** y **Development**.
5. Verificar el redeploy en **Deployments**. El sitio recién levantado tardará ~2–3 min.

### Conectar el repositorio a la cuenta del cliente

Si el cliente además quiere adueñarse del código:
1. En **GitHub/GitLab/Bitbucket**, transferir o entregar acceso al repositorio.
2. En Vercel → **New Project → Import** → seleccionar el repo fuente.

---

## 9. Correos (Resend)

El sitio envía correos de confirmación de reserva con **Resend**.

- Panel: [resend.com](https://resend.com)
- La clave estará en la variable `RESEND_API_KEY`.
- Para cambiar el remitente/dominio: Resend → **Domains** (verificar el dominio del correo que quieras usar).

---

## 10. Modo mantenimiento

Para poner el sitio "fuera de servicio" temporalmente:

1. En Vercel → **Settings → Environment Variables** → `MAINTENANCE_MODE=true`.
2. Redeploy (los cambios de variables hacen redeploy automático).
3. Para volver: `MAINTENANCE_MODE=false` (o borrar la variable).

Para ver el sitio en mantenimiento como administrador, usa `?maintenance_token=<MAINTENANCE_TOKEN>`.

---

## 11. Propiedad intelectual y marca

El sitio fue **diseñado y desarrollado por Siwakode**.

Marca incluida en el pie de página (footer):

```
Copyright © Vamos Jacó. Todos los derechos reservados.
Diseñado y Desarrollado por Siwakode
```

- La atribución "Diseñado y Desarrollado por Siwakode"
  está en `src/components/Footer.tsx` (líneas del Bottom Bar).
- Contiene además una marca visible en el código fuente (comentario) que identifica
  a Siwakode como autor del desarrollo.
- **Protección técnica:** el build valida automáticamente la atribución. Si se elimina
  la marca, el comando `npm run build` falla (`scripts/verify-credit.mjs`) y el sitio no
  se puede desplegar hasta restablecerla.
- **Importante para el cliente:** mantener el crédito a Siwakode en el footer y en el
  código es parte del acuerdo de desarrollo; no debe eliminarse sin autorización de Siwakode.

### Cómo cambiar la URL de Siwakode

En `src/components/Footer.tsx`:

```ts
credit: "Designed & Developed by",   // versión EN
credit: "Diseñado y Desarrollado por", // versión ES
creditLink: "https://siwakode.com",   // ← cambiar aquí el enlace
```

---

## 12. Solución de problemas comunes

| Problema | Causa probable | Solución |
|---|---|---|
| Los tours no cargan | `PUBLIC_SUPABASE_URL` / anon key mal | Revisar `.env` y vars en Vercel |
| El panel admin no admite | Usuario sin rol `admin` | Ejecutar el UPDATE de la sección 6 |
| El sitio muestra "mantenimiento" | `MAINTENANCE_MODE=true` | Poner en `false` y redeploy |
| No llegan correos | `RESEND_API_KEY` inválida | Validar en panel de Resend |
| 404 / se cae el deploy | URL del repo o proyecto Vercel desconectado | Re-conectar repo en Vercel |

---

## 13. Entregables finales

- ☐ Código fuente completo (repositorio Git)
- ☐ Archivo `.env` con todas las claves reales
- ☐ Acceso a Supabase (transferencia de propiedad) + repo de migraciones SQL
- ☐ Proyecto Vercel transferido + variables de entorno configuradas
- ☐ Acceso a Resend (o transferencia de dominio de correos)
- ☐ Exportación de datos: `tours-export.json` + `tour-export/images` (catálogo completo, 17 tours)

---

*Documento generado por **Siwakode** · Entrega oficial del proyecto Vamos Jacó Tours.*