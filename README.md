# Turnero — Sistema de Reservas para Salón

Aplicación web para gestión de turnos de peluquería/salón. Los clientes reservan online eligiendo servicio, fecha y horario. El dueño administra todo desde un panel privado con actualizaciones en tiempo real.

---

## Stack tecnológico

### Backend
| Tecnología | Versión | Rol |
|---|---|---|
| Node.js | 20 | Runtime |
| Express | 5 | Framework HTTP |
| PostgreSQL | 17 | Base de datos |
| pg | 8 | Cliente PostgreSQL |
| jsonwebtoken | 9 | Autenticación JWT |
| bcryptjs | 3 | Hash de contraseñas |
| helmet | 8 | Headers de seguridad HTTP |
| express-rate-limit | 8 | Rate limiting |
| cors | 2 | Control de CORS |
| dotenv | 17 | Variables de entorno |
| nodemon | 3 | Hot reload en desarrollo |

### Frontend
| Tecnología | Versión | Rol |
|---|---|---|
| React | 19 | UI |
| Vite | 8 | Build tool / dev server |
| React Router | 7 | Routing SPA |
| react-day-picker | 9 | Selector de fechas |
| Motion | 12 | Animaciones |
| lucide-react | 1 | Iconografía |
| axios | 1 | Cliente HTTP |
| ESLint | 9 | Linting |

### Infraestructura
| Servicio | Uso |
|---|---|
| Docker + Docker Compose | Entorno local (DB + backend) |
| Vercel | Deploy frontend (producción) |
| Render | Deploy backend (producción) |
| Supabase | PostgreSQL en producción |

---

## Levantar el proyecto localmente

### Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y **corriendo**
- [Node.js 20+](https://nodejs.org/) instalado

### Setup (primera vez y siguientes)

**Windows:**
```
dev.bat
```

**Linux / macOS / Git Bash:**
```bash
bash dev.sh
```

Eso es todo. El script:
1. Verifica que Docker y Node estén disponibles
2. Instala dependencias del frontend si no existen (`npm install`)
3. Levanta la base de datos y el backend con Docker Compose
4. Arranca el servidor de desarrollo de Vite

Una vez levantado:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Health check: http://localhost:3000/health

### Detener el entorno

Cerrá la terminal de Vite con `Ctrl+C`, luego:
```bash
docker compose down
```

---

## Variables de entorno

### Backend — `backend/.env`

Copiá el archivo de ejemplo y completá los valores:
```bash
cp backend/.env.example backend/.env
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://postgres:1234@localhost:5432/peluqueria` |
| `FRONTEND_ORIGIN` | Origen permitido por CORS (solo producción) | `https://tu-app.vercel.app` |
| `ADMIN_USERNAME` | Usuario del panel admin | `admin` |
| `ADMIN_PASSWORD_HASH` | Contraseña hasheada con bcrypt | Ver nota abajo |
| `JWT_SECRET` | Clave secreta para firmar tokens | String aleatorio largo |
| `JWT_EXPIRES_IN` | Duración del token | `1d` |

**Para generar el hash de la contraseña:**
```bash
node -e "const b = require('bcryptjs'); b.hash('tu-contraseña', 10).then(console.log)"
```

### Frontend — `client/.env`

```bash
cp client/.env.example client/.env
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:3000/api` |

> En producción apunta a la URL de Render: `https://tu-backend.onrender.com/api`

---

## Estructura del proyecto

```
peluqueria/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Manejo de requests/responses HTTP
│   │   ├── services/         # Lógica de negocio
│   │   ├── repositories/     # Acceso a base de datos (SQL)
│   │   ├── routes/           # Definición de rutas Express
│   │   ├── middleware/        # Auth JWT, etc.
│   │   └── utils/            # Helpers (tiempo, validación, JWT)
│   ├── db/
│   │   ├── schema.sql         # Esquema inicial
│   │   ├── seed.sql           # Datos de ejemplo
│   │   └── migrations/        # Migraciones incrementales
│   └── Dockerfile
├── client/
│   └── src/
│       ├── components/        # Componentes React reutilizables
│       ├── pages/             # Vistas principales
│       ├── hooks/             # Custom hooks
│       ├── api/               # Funciones de llamada a la API
│       ├── utils/             # Helpers de fecha, formato, etc.
│       ├── admin/             # Todo lo relacionado al panel admin
│       └── config/            # Configuración de contacto, etc.
├── compose.yaml               # Docker Compose (local)
├── dev.bat                    # Script de inicio (Windows)
└── dev.sh                     # Script de inicio (Linux/macOS)
```

---

## Deploy en producción

El proyecto usa tres servicios gratuitos que se conectan entre sí:

```
Vercel (frontend) ──HTTP──▶ Render (backend) ──SQL──▶ Supabase (PostgreSQL)
```

### Variables a configurar en producción

**Render (backend):**
- Todas las variables de `backend/.env`
- `DATABASE_URL` apunta a Supabase
- `FRONTEND_ORIGIN` apunta al dominio de Vercel
- `NODE_ENV=production`

**Vercel (frontend):**
- `VITE_API_URL` apunta al dominio de Render

### Migraciones

Las migraciones se ejecutan automáticamente al iniciar el backend (`npm run start:with-migrations`). No requieren intervención manual.
