import { useEffect, useState } from 'react'

export type VideoNode = {
  id: string
  platform: 'youtube' | 'twitch'
  videoId: string
  title: string
  channelName: string
  thumbnail: string
  url: string
  position: [number, number, number]
}

export function useNodes() {
  const [nodes, setNodes] = useState<VideoNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3000/api/nodes')
      .then((res) => res.json())
      .then((data) => {
        setNodes(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load nodes', err)
      })
  }, [])

  return { nodes, loading }
}
