export function Crosshair() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 16,
        height: 16,
        pointerEvents: 'none',
        zIndex: 30,
        opacity: 1,
      }}
    >
      {/* Vertical line */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 2,
          height: '100%',
          background: 'rgba(255,255,255,0.8)',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Horizontal line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: 2,
          background: 'rgba(255,255,255,0.8)',
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  )
}
