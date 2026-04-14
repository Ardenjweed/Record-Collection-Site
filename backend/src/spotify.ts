import dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getSpotifyToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return cachedToken!;
}

export async function searchAlbum(artist: string, title: string) {
  const token = await getSpotifyToken();

  const query = encodeURIComponent(`album:${title} artist:${artist}`);
  const searchRes = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=album&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const searchData = await searchRes.json();
  const album = searchData.albums?.items?.[0];

  if (!album) return null;

  const albumRes = await fetch(
    `https://api.spotify.com/v1/albums/${album.id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const albumData = await albumRes.json();

  const tracks = albumData.tracks.items.map((track: any) => ({
    name: track.name,
    duration: formatDuration(track.duration_ms),
    trackNumber: track.track_number,
  }));

  const totalMs = albumData.tracks.items.reduce(
    (sum: number, t: any) => sum + t.duration_ms, 0
  );

  return {
    title: albumData.name,
    artist: albumData.artists[0].name,
    year: albumData.release_date.slice(0, 4),
    totalTracks: albumData.total_tracks,
    totalDuration: formatDuration(totalMs),
    tracks,
  };
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}