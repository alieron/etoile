# Three.js + React + TypeScript + Tailwind CSS v4 Starter

A minimal Vite starter with a fullscreen Three.js scene, TypeScript, Tailwind CSS v4, and reusable React UI layered over the canvas.

## Run

```bash
npm install
npm run dev
```

## Structure

- `src/main.tsx` - React mount, renderer setup, resize handling, animation loop
- `src/App.tsx` - overlay UI composition
- `src/components/Button.tsx` - reusable button component
- `src/scene/createScene.ts` - cube, lights, grid, scene setup
- `src/scene/camera.ts` - perspective camera and orbit controls
- `src/styles.css` - Tailwind import and shared styling

The canvas fills the viewport. The React overlay uses `pointer-events-none` on the full-screen wrapper and `pointer-events-auto` on panels/buttons so the 3D scene remains orbitable except where UI controls are placed.
