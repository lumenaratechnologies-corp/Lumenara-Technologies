export default function NoiseOverlay() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.08]" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.35\'/></svg>")' }} />
  )
}


