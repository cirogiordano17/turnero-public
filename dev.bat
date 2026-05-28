@echo off
setlocal

echo.
echo =========================================
echo   Turnero - Entorno de Desarrollo Local
echo =========================================
echo.

REM ── Verificar Docker ─────────────────────
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Desktop no esta corriendo.
    echo         Inicialo y volvé a ejecutar este script.
    echo.
    pause
    exit /b 1
)

REM ── Verificar Node.js ────────────────────
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado.
    echo         Descargalo desde https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM ── Instalar dependencias del cliente si faltan ──
if not exist "%~dp0client\node_modules" (
    echo [1/3] Instalando dependencias del frontend...
    cd "%~dp0client" && npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Fallo npm install en /client
        pause
        exit /b 1
    )
    cd "%~dp0"
) else (
    echo [1/3] Dependencias del frontend OK
)

REM ── Levantar backend con Docker ──────────
echo [2/3] Levantando backend ^(Docker Compose^)...
docker compose -f "%~dp0compose.yaml" up -d --build

if %errorlevel% neq 0 (
    echo [ERROR] Fallo docker compose up
    pause
    exit /b 1
)

echo.
echo  Backend:  http://localhost:3000
echo  Health:   http://localhost:3000/health
echo.

REM ── Levantar frontend ────────────────────
echo [3/3] Levantando frontend ^(Vite^)...
echo.
cd "%~dp0client" && npm run dev
