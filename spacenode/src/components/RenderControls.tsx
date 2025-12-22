type Props = {
  renderDistance: number
  setRenderDistance: (v: number) => void
}

export function RenderControls({ renderDistance, setRenderDistance }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        left: 20,
        padding: '12px',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        fontFamily: 'monospace',
        borderRadius: 8,
        zIndex: 10,
      }}
    >
      <div>Render Distance</div>
      <input
        type="range"
        min={10}
        max={250}
        step={1}
        value={renderDistance}
        onChange={(e) => setRenderDistance(+e.target.value)}
      />
      <div>{renderDistance}</div>
    </div>
  )
}
