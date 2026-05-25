import { Button } from './components/Button';

export function App() {
  return (
    <main className="pointer-events-none fixed inset-0 z-10 flex items-start justify-between p-6">
      <section className="pointer-events-auto max-w-sm rounded-2xl border border-white/15 bg-black/45 p-5 text-white shadow-2xl backdrop-blur-md">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-200/80">Starter Scene</p>
        <h1 className="mt-2 text-3xl font-semibold">Three.js Cube</h1>
        <p className="mt-3 text-sm leading-6 text-white/75">
          Drag to orbit, scroll to zoom. This React UI is layered over the 3D canvas.
        </p>
      </section>

      <nav className="pointer-events-auto flex gap-3">
        <Button>About</Button>
        <Button>Action</Button>
      </nav>
    </main>
  );
}
