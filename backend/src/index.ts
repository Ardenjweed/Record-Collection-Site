import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { searchAlbum } from './spotify';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/spotify/album', async (req, res) => {
  const { artist, title } = req.query;

  if (!artist || !title) {
    res.status(400).json({ error: 'artist and title query params are required' });
    return;
  }

  const album = await searchAlbum(artist as string, title as string);

  if (!album) {
    res.status(404).json({ error: 'Album not found' });
    return;
  }

  res.json(album);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});