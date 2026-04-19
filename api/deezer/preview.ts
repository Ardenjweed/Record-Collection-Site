module.exports = async function handler(req: any, res: any) {
  try {
    const artist = req.query['artist'] as string;
    const track = req.query['track'] as string;

    if (!artist || !track) {
      return res.status(400).json({ error: 'artist and track are required' });
    }

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

    const best = data.data.find((item: any) => {
      const itemArtist = normalize(item.artist?.name ?? '');
      const itemTitle = normalize(item.title ?? '');
      return itemArtist.includes(artistNorm) || artistNorm.includes(itemArtist)
        && itemTitle.includes(trackNorm) || trackNorm.includes(itemTitle);
    }) ?? data.data[0];

    return res.json({ preview: best?.preview ?? null });
  } catch (error) {
    console.error('Deezer preview error:', error);
    return res.status(500).json({ error: 'Failed to fetch preview' });
  }
}