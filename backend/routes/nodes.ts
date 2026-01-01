import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
    const nodes = Array.from({ length: 200 }, (_, i) => ({
        id: String(i),
        platform: i%2 == 0? 'youtube' : 'twitch',
        videoId: `mock-${i}`,
        title: `Video ${i}`,
        channelName: i%2 === 0 ? 'MockYT' : 'MockTwitch',
        thumbnail: 'https://via.placeholder.com/320x180',
        url:
            i%2 === 0 ? `https://youtube.com/watch?v=mock-${i}`
            : `https://twitch.tv/mock-${i}`,
        position: [
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        ]
    }))

    res.json(nodes);
})

export default router