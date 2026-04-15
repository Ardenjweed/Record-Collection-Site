import dotenv from 'dotenv';
dotenv.config();

const DISCOGS_TOKEN = process.env.DISCOGS_PERSONAL_TOKEN!;
const DISCOGS_USER_AGENT =
  process.env.DISCOGS_USER_AGENT || 'RecordCollectionSite/1.0 +http://localhost';

type DiscogsTrack = {
  position: string;
  title: string;
  duration: string;
  type_?: string;
};

type DiscogsRelease = {
  id: number;
  title: string;
  year?: number;
  artists?: { name: string }[];
  tracklist?: DiscogsTrack[];
};

type DiscogsMaster = {
  id: number;
  title: string;
  year?: number;
  artists?: { name: string }[];
  tracklist?: DiscogsTrack[];
};

export interface DiscogsAlbumTrack {
  trackNumber: number;
  name: string;
  duration: string;
}

export interface DiscogsAlbum {
  title: string;
  artist: string;
  year: string;
  totalTracks: number;
  totalDuration: string;
  tracks: DiscogsAlbumTrack[];
}

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

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

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

function buildAlbumResponse(data: {
  title?: string;
  artist?: string;
  year?: number | string;
  tracklist?: DiscogsTrack[];
}): DiscogsAlbum | null {
  const usableTracks = (data.tracklist ?? []).filter(isRealTrack);
  if (!usableTracks.length) return null;

  const tracks: DiscogsAlbumTrack[] = usableTracks.map((track, index) => ({
    trackNumber: index + 1,
    name: track.title,
    duration: track.duration || '--:--',
  }));

  const totalSeconds = usableTracks.reduce(
    (sum, track) => sum + parseDurationToSeconds(track.duration || ''),
    0
  );

  return {
    title: data.title || '',
    artist: data.artist || '',
    year: String(data.year || ''),
    totalTracks: tracks.length,
    totalDuration: totalSeconds > 0 ? formatDurationFromSeconds(totalSeconds) : '--:--',
    tracks,
  };
}

export async function getAlbumByDiscogsId(
  discogsId: number,
  discogsType: 'release' | 'master' = 'release'
): Promise<DiscogsAlbum | null> {
  const endpoint =
    discogsType === 'master'
      ? `https://api.discogs.com/masters/${discogsId}`
      : `https://api.discogs.com/releases/${discogsId}`;

  const res = await fetch(endpoint, {
    headers: getHeaders(),
  });

  const text = await res.text();
  console.log(`Discogs ${discogsType} ${discogsId} status:`, res.status);
  // console.log(`Discogs ${discogsType} ${discogsId} body:`, text);

  if (!res.ok) {
    throw new Error(`Discogs ${discogsType} fetch failed: ${res.status} ${text}`);
  }

  const data: DiscogsRelease | DiscogsMaster = JSON.parse(text);

  return buildAlbumResponse({
    title: data.title,
    artist: data.artists?.[0]?.name,
    year: data.year,
    tracklist: data.tracklist,
  });
}