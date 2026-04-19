const DISCOGS_TOKEN = process.env['DISCOGS_PERSONAL_TOKEN']!;
const DISCOGS_USER_AGENT = process.env['DISCOGS_USER_AGENT'] || 'RecordCollectionSite/1.0';

type DiscogsTrack = {
  position: string;
  title: string;
  duration: string;
  type_?: string;
};

type DiscogsData = {
  title?: string;
  year?: number | string;
  artists?: { name: string }[];
  tracklist?: DiscogsTrack[];
};

function getHeaders() {
  return {
    'Authorization': `Discogs token=${DISCOGS_TOKEN}`,
    'User-Agent': DISCOGS_USER_AGENT,
  };
}

function parseDurationToSeconds(duration: string): number {
  if (!duration || !duration.includes(':')) return 0;
  const parts = duration.split(':').map(Number);
  if (parts.some(Number.isNaN)) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function formatDurationFromSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function isRealTrack(track: DiscogsTrack): boolean {
  return (
    track.type_ !== 'heading' &&
    !!track.title &&
    (track.position?.trim() !== '' || track.duration?.trim() !== '')
  );
}

module.exports = async function handler(req: any, res: any) {
  try {
    const discogsId = Number(req.query['discogsId']);
    const discogsType = req.query['discogsType'] === 'master' ? 'master' : 'release';

    if (!Number.isInteger(discogsId) || discogsId <= 0) {
      return res.status(400).json({ error: 'valid discogsId is required' });
    }

    const endpoint = discogsType === 'master'
      ? `https://api.discogs.com/masters/${discogsId}`
      : `https://api.discogs.com/releases/${discogsId}`;

    const response = await fetch(endpoint, { headers: getHeaders() });

    if (!response.ok) {
      return res.status(404).json({ error: 'Album not found on Discogs' });
    }

    const data: DiscogsData = await response.json();
    const usableTracks = (data.tracklist ?? []).filter(isRealTrack);

    if (!usableTracks.length) {
      return res.status(404).json({ error: 'No tracks found' });
    }

    const tracks = usableTracks.map((track, index) => ({
      trackNumber: index + 1,
      name: track.title,
      duration: track.duration || '--:--',
    }));

    const totalSeconds = usableTracks.reduce(
      (sum, track) => sum + parseDurationToSeconds(track.duration || ''),
      0
    );

    return res.json({
      title: data.title || '',
      artist: data.artists?.[0]?.name || '',
      year: String(data.year || ''),
      totalTracks: tracks.length,
      totalDuration: totalSeconds > 0 ? formatDurationFromSeconds(totalSeconds) : '--:--',
      tracks,
    });
  } catch (error) {
    console.error('Discogs ID route error:', error);
    return res.status(500).json({ error: 'Failed to fetch Discogs album data' });
  }
}