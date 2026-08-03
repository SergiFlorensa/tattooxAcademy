# Tatoox Academy

Web visual y editorial para documentar el aprendizaje de un tatuador: dibujos,
ideas, proceso, proyectos y contacto directo.

## Stack

- React 19 + TypeScript
- Next/Vinext
- Tailwind CSS 4 y CSS personalizado
- Vite para desarrollo local
- Despliegue estático compatible con Sites/Cloudflare

## Desarrollo local

Requisitos: Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

La web estará disponible en `http://localhost:5173`.

El comando `npm run dev` funciona directamente desde PowerShell, CMD o la
terminal integrada de Visual Studio Code en Windows.

## Comprobaciones

```bash
npm run lint
npm run test
```

## Contacto

El formulario prepara un correo mediante `mailto:` y no almacena datos en una
base de datos. El email provisional está definido en `app/page.tsx` y deberá
sustituirse por el definitivo antes de publicar la versión final.
