export function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      <div
        className="mesh-blob"
        style={{
          width: 700,
          height: 520,
          top: "-18%",
          left: "-8%",
          background:
            "radial-gradient(ellipse, rgba(245,233,212,0.92) 0%, rgba(245,220,180,0.4) 55%, transparent 100%)",
          animation: "mesh-1 22s ease-in-out infinite",
        }}
      />
      <div
        className="mesh-blob"
        style={{
          width: 580,
          height: 440,
          top: "-12%",
          left: "14%",
          background:
            "radial-gradient(ellipse, rgba(83,58,253,0.35) 0%, rgba(83,58,253,0.15) 55%, transparent 100%)",
          animation: "mesh-2 27s ease-in-out infinite",
          animationDelay: "-4s",
        }}
      />
      <div
        className="mesh-blob"
        style={{
          width: 640,
          height: 480,
          top: "-8%",
          left: "33%",
          background:
            "radial-gradient(ellipse, rgba(249,107,238,0.28) 0%, rgba(249,107,238,0.12) 55%, transparent 100%)",
          animation: "mesh-3 20s ease-in-out infinite",
          animationDelay: "-8s",
        }}
      />
      <div
        className="mesh-blob"
        style={{
          width: 520,
          height: 400,
          top: "0%",
          left: "56%",
          background:
            "radial-gradient(ellipse, rgba(234,34,97,0.22) 0%, rgba(234,34,97,0.08) 55%, transparent 100%)",
          animation: "mesh-4 18s ease-in-out infinite",
          animationDelay: "-12s",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-b from-transparent to-background" />
    </div>
  )
}
