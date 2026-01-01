import { useState } from 'react'

type Props = {
  renderDistance: number
  setRenderDistance: (v: number) => void
}

export function RenderControls({ renderDistance, setRenderDistance }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          width: 40,
          height: 40,
          borderRadius: '10%',
          border: 'none',
          background: 'rgba(136, 46, 226, 0.6)',
          color: 'white',
          fontSize: 20,
          cursor: 'pointer',
          zIndex: 20,
          padding: 0,
          lineHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Settings"
      >
        ⚙️
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            top: 70,
            left: 20,
            padding: '12px',
            background: 'rgba(112, 27, 197, 1)',
            color: 'white',
            fontFamily: 'monospace',
            borderRadius: 8,
            zIndex: 10,
            width: 200,
          }}
        >
          <div style={{ marginBottom: 8 }}>Render Distance</div>

          <input
            type="range"
            min={10}
            max={250}
            step={1}
            value={renderDistance}
            onChange={(e) => setRenderDistance(+e.target.value)}
            style={{ width: '100%' }}
          />

          <div style={{ marginTop: 6, textAlign: 'right' }}>
            {renderDistance}
          </div>
        </div>
      )}
    </>
  )
}
