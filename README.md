# Three.js + TypeScript + Tailwind CSS v4 Starter

A minimal Vite starter with a fullscreen Three.js scene, TypeScript, Tailwind CSS v4, and regular HTML UI layered over the canvas.

## Run

```bash
npm install
npm run dev
```

## Structure

- `src/main.ts` - renderer setup, resize handling, animation loop
- `src/scene/createScene.ts` - cube, lights, grid, scene setup
- `src/scene/camera.ts` - perspective camera and orbit controls
- `src/styles.css` - Tailwind import and overlay button styling

The canvas fills the viewport. The overlay in `index.html` uses `pointer-events-none` on the full-screen wrapper and `pointer-events-auto` on panels/buttons so the 3D scene remains orbitable except where UI controls are placed.
