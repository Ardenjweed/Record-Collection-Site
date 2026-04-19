import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAlbumByDiscogsId } from '../../backend/src/discogs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const discogsId = Number(req.query.discogsId);
    const discogsType = req.query.discogsType === 'master' ? 'master' : 'release';

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
}