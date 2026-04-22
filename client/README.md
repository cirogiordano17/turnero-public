# Turnero

Sistema de turnos para peluquería y registros akáshicos.

---

# Cómo usar este proyecto (paso a paso)

## Paso 0: Requisitos

Antes de empezar, necesitás tener instalado:

- Docker
- Docker Compose
- Node.js (recomendado v20)
- npm

Verificá que estén instalados:

```bash
docker --version
docker compose version
node -v
npm -v


Paso 1: Clonar el repositorio

git clone https://github.com/cirogiordano17/turnero-public.git
cd turnero-public

Paso 2: Crear archivos de entorno
Backend

Crea:
backend/.env

client/.env


Paso 3:
en backend/.env pone esto:

NODE_ENV=development
PORT=3000

DATABASE_URL=postgres://postgres:postgres@db:5432/peluqueria
FRONTEND_ORIGIN=http://localhost:5173

ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=PEGAR_HASH_ACA

JWT_SECRET=changeme_jwt_secret
JWT_EXPIRES_IN=1d

Paso 4: Generar el hash para la contraseña admin

Parado dentro de la carpeta backend, ejecutá:

cd backend
node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"

Copiá el resultado (empieza con $2b$...)

Pegalo en:ADMIN_PASSWORD_HASH=ACA_EL_HASH en el .env de backend


Paso 5: Configurar el frontend

Abrí:
client/.env

y dejalo asi:
VITE_API_URL=http://localhost:3000/api

Paso 6: Levantar Proyecto

Desde /backend
docker compose up --build


Paso 7: Abrir la aplicación

Cuando termine de levantar:

App: http://localhost:5173
Admin: http://localhost:5173/admin

Paso 8: Login admin

Usuario: admin

Contraseña: admin123


Paso 9: Apagar el proyecto
docker compose down