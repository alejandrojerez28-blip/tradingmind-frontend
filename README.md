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
- Backend en DigitalOcean: `https://<tu-backend-do>`

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
