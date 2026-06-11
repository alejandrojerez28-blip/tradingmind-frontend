# TradingMind Frontend

UI de operaciones para TradingMind AI (Next.js).

## Requisitos

- Node.js 20+
- npm 10+

## Configuracion

1. Copia variables de entorno:

```bash
cp .env.example .env.local
```

2. Ajusta `NEXT_PUBLIC_API_URL`:

- Local backend con Docker: `http://localhost:8080`
- Backend en DigitalOcean/App Router: `https://<tu-dominio>/api` (si pones dominio sin `/api`, el frontend lo normaliza automaticamente)
- Opcional en despliegue privado: `NEXT_PUBLIC_CRITICAL_API_KEY=<tu-key>` para que el panel pueda consultar endpoints protegidos de scheduler.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre: [http://localhost:3000](http://localhost:3000)

## Build de produccion

```bash
npm run build
npm run start
```

## Deploy en DigitalOcean App Platform

- Tipo: Web Service (Node/Next.js)
- Branch: `master`
- Build command: `npm run build`
- Run command: `npm run start`
- Variables (Run):
  - `NEXT_PUBLIC_API_URL=https://<backend-url>`
  - `NEXT_PUBLIC_CRITICAL_API_KEY=<critical-key>` (opcional, solo dashboard privado)
