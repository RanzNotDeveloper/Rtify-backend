const express = require('express');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const cors = require('cors');

const app = express();
app.use(cors());

// Endpoint cari lagu
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter required' });
    }
    
    try {
        const result = await yts.search({ query, limit: 15 });
        const songs = result.videos.map(v => ({
            id: v.videoId,
            title: v.title,
            artist: v.author.name,
            thumbnail: v.thumbnail,
            duration: v.duration
        }));
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// Endpoint stream audio
app.get('/stream/:id', (req, res) => {
    const videoId = req.params.id;
    try {
        const stream = ytdl(videoId, { 
            filter: 'audioonly', 
            quality: 'highestaudio' 
        });
        stream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: 'Stream failed' });
    }
});

app.get('/', (req, res) => {
    res.send('Rtify Backend is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Rtify backend running on port ${PORT}`);
});