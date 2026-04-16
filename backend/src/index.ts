import express from 'express';
import { getAlbumByDiscogsId } from './discogs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/discogs/album-by-id', async (req, res) => {
  try {
    const discogsId = Number(req.query.discogsId);
    const discogsType =
      req.query.discogsType === 'master' ? 'master' : 'release';

    if (!Number.isInteger(discogsId) || discogsId <= 0) {
      return res.status(400).json({ error: 'valid discogsId is required' });
    }

    const album = await getAlbumByDiscogsId(discogsId, discogsType);

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    return res.json(album);
  } catch (error) {
    console.error('Discogs ID route error:', error);
    return res.status(500).json({ error: 'Failed to fetch Discogs album data' });
  }
});

app.get('/api/deezer/preview', async (req, res) => {
  try {
    const artist = req.query.artist as string;
    const track = req.query.track as string;

    if (!artist || !track) {
      return res.status(400).json({ error: 'artist and track are required' });
    }

    // Plain query — Deezer doesn't support field qualifier syntax
    const query = `${artist} ${track}`;

    const response = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=10`
    );

    const data = await response.json();

    if (!data.data?.length) {
      return res.json({ preview: null });
    }

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const artistNorm = normalize(artist);
    const trackNorm = normalize(track);

    // Find the best match: prefer results where both artist and track name match
    const best = data.data.find((item: any) => {
      const itemArtist = normalize(item.artist?.name ?? '');
      const itemTitle = normalize(item.title ?? '');
      return itemArtist.includes(artistNorm) || artistNorm.includes(itemArtist)
        && itemTitle.includes(trackNorm) || trackNorm.includes(itemTitle);
    }) ?? data.data[0]; // fall back to top result if nothing matches closely

    return res.json({ preview: best?.preview ?? null });
  } catch (error) {
    console.error('Deezer preview error:', error);
    return res.status(500).json({ error: 'Failed to fetch preview' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});