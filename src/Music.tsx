import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TerminalWindow from './components/TerminalWindow';

/**
 * last.fm api keys are effectively client IDs — safe to expose.
 * The api secret (not used here) is the actual credential.
 */
const API_KEY = 'f3878d8bcb04561fe918bb6f22ba808f';
const USER = 'Ryan5453';
const API = 'https://ws.audioscrobbler.com/2.0/';

interface LfmImage {
  '#text': string;
  size: string;
}

interface TopArtist {
  name: string;
  playcount: string;
  url: string;
}

interface TopTrack {
  name: string;
  playcount: string;
  url: string;
  artist: { name: string };
}

interface TopAlbum {
  name: string;
  playcount: string;
  url: string;
  artist: { name: string };
  image: LfmImage[];
}

interface RecentTrack {
  name: string;
  url: string;
  artist: { '#text': string };
  album: { '#text': string };
  image: LfmImage[];
  date?: { uts: string };
  '@attr'?: { nowplaying?: string };
}

interface MusicData {
  scrobbles: number;
  since: string;
  topArtists: TopArtist[];
  topTracks: TopTrack[];
  topAlbums: TopAlbum[];
  recent: RecentTrack[];
}

const BAR_WIDTH = 24;

const renderBar = (pct: number) => {
  const filled = Math.round((pct / 100) * BAR_WIDTH);
  return '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);
};

// proportional ascii bar for chart rows (width relative to the leader)
const chartBar = (value: number, max: number, width = 14) => {
  const filled = max > 0 ? Math.max(1, Math.round((value / max) * width)) : 0;
  return '█'.repeat(filled);
};

const relativeTime = (uts?: string) => {
  if (!uts) return 'now';
  const diff = Date.now() / 1000 - Number(uts);
  if (diff < 60) return 'just now';
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const Music: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MusicData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // loader: `progress` eases toward `target`; target advances as calls resolve
  const [progress, setProgress] = useState(0);
  const [target, setTarget] = useState(0);
  const targetRef = useRef(0);
  const bump = (to: number) => {
    targetRef.current = Math.max(targetRef.current, to);
    setTarget(targetRef.current);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'h') navigate('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // smoothly fill the bar toward the current target (~60fps, fast)
  useEffect(() => {
    if (progress >= target) return;
    const t = setTimeout(() => setProgress((p) => Math.min(target, p + 6)), 16);
    return () => clearTimeout(t);
  }, [progress, target]);

  // once the bar is full and the data is in, drop the loader
  useEffect(() => {
    if (progress >= 100 && data) {
      const t = setTimeout(() => setLoading(false), 120);
      return () => clearTimeout(t);
    }
  }, [progress, data]);

  useEffect(() => {
    const call = (method: string, extra = '') =>
      fetch(`${API}?method=${method}&user=${USER}&api_key=${API_KEY}&format=json${extra}`)
        .then((r) => r.json());

    const load = async () => {
      try {
        const tasks: Array<Promise<unknown>> = [
          call('user.getinfo'),
          call('user.gettopartists', '&period=7day&limit=8'),
          call('user.gettoptracks', '&period=7day&limit=8'),
          call('user.gettopalbums', '&period=7day&limit=6'),
          call('user.getrecenttracks', '&limit=10'),
        ];
        // advance the bar (to a max of 90%) as each request lands
        let done = 0;
        tasks.forEach((p) =>
          p.then(() => {
            done += 1;
            bump(Math.round((done / tasks.length) * 90));
          })
        );

        const [info, artists, tracks, albums, recent] = await Promise.all(tasks);

        setData({
          scrobbles: Number((info as any).user.playcount),
          since: (info as any).user.registered.unixtime,
          topArtists: (artists as any).topartists.artist ?? [],
          topTracks: (tracks as any).toptracks.track ?? [],
          topAlbums: (albums as any).topalbums.album ?? [],
          recent: (recent as any).recenttracks.track ?? [],
        });
        bump(100);
      } catch (err) {
        console.error('Error fetching music stats:', err);
        setError(true);
        bump(100);
      }
    };

    load();
  }, []);

  const statusBar = (
    <>
      <Link to="/" className="shortcut-link">
        <span className="text-tui-yellow">[h]</span>ome
      </Link>
      <span className="text-tui-dim hidden sm:inline">last 7 days · via last.fm</span>
    </>
  );

  if (loading) {
    return (
      <TerminalWindow title="ryan@ryan.science: ~/lastfm" statusBar={statusBar}>
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-tui-dim text-sm mb-2">
              <span className="text-tui-green">$</span> lastfm-stats --user {USER} --period 7day
            </div>
            <div className="text-tui-text">loading stats...</div>
            <div className="mt-1 whitespace-nowrap">
              <span className="text-tui-dim">[</span>
              <span className="text-tui-green">{renderBar(progress)}</span>
              <span className="text-tui-dim">]</span>
              <span className="text-tui-bright ml-2">{progress}%</span>
              <span className="cursor-block">█</span>
            </div>
            {error && (
              <div className="text-tui-red text-sm mt-3">
                ! could not reach last.fm — try refreshing
              </div>
            )}
          </div>
        </div>
      </TerminalWindow>
    );
  }

  if (error || !data) {
    return (
      <TerminalWindow title="ryan@ryan.science: ~/lastfm" statusBar={statusBar}>
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-tui-red">! could not load music stats. try refreshing.</div>
        </div>
      </TerminalWindow>
    );
  }

  const sinceYear = new Date(Number(data.since) * 1000).getFullYear();
  const daysSince = Math.max(1, Math.floor((Date.now() / 1000 - Number(data.since)) / 86400));
  const perDay = (data.scrobbles / daysSince).toFixed(1);

  const maxArtist = Math.max(...data.topArtists.map((a) => Number(a.playcount)), 1);
  const maxTrack = Math.max(...data.topTracks.map((t) => Number(t.playcount)), 1);

  return (
    <TerminalWindow title="ryan@ryan.science: ~/lastfm" statusBar={statusBar}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-tui-bright">last.fm</h1>
        <p className="text-tui-dim mt-1 text-sm">what i've been listening to · last 7 days</p>
      </div>

      {/* Totals — neofetch style */}
      <div className="tui-panel">
        <span className="tui-panel-title">stats</span>
        <div className="flex gap-6">
          <pre className="hidden md:block text-tui-green text-sm leading-tight select-none mt-1">{`┌──┐\n│♫ │\n└──┘`}</pre>
          <div className="space-y-1 text-sm">
            <a
              href={`https://www.last.fm/user/${USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              <span className="text-tui-cyan font-bold">{USER}</span>
              <span className="text-tui-dim">@</span>
              <span className="text-tui-cyan font-bold">last.fm</span>
            </a>
            <div className="text-tui-border select-none">─────────────────────</div>
            <div>
              <span className="text-tui-magenta">scrobbles </span>
              <span className="text-tui-dim">~</span> {data.scrobbles.toLocaleString()}
            </div>
            <div>
              <span className="text-tui-magenta">per day   </span>
              <span className="text-tui-dim">~</span> {perDay} tracks
            </div>
            <div>
              <span className="text-tui-magenta">since     </span>
              <span className="text-tui-dim">~</span> {sinceYear}
            </div>
          </div>
        </div>
      </div>

      {/* Top Artists */}
      <div className="tui-panel">
        <span className="tui-panel-title">top artists</span>
        <div className="space-y-1">
          {data.topArtists.map((artist, i) => (
            <a
              key={artist.url}
              href={artist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-item flex items-center gap-3 text-sm"
            >
              <span className="text-tui-dim w-5 text-right shrink-0">{i + 1}</span>
              <span className="text-tui-bright truncate flex-1 min-w-0">{artist.name}</span>
              <span className="text-tui-green hidden sm:inline shrink-0">
                {chartBar(Number(artist.playcount), maxArtist)}
              </span>
              <span className="text-tui-dim w-12 text-right shrink-0">{artist.playcount}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Top Tracks */}
      <div className="tui-panel">
        <span className="tui-panel-title">top tracks</span>
        <div className="space-y-1">
          {data.topTracks.map((track, i) => (
            <a
              key={track.url}
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-item flex items-center gap-3 text-sm"
            >
              <span className="text-tui-dim w-5 text-right shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="text-tui-bright truncate">{track.name}</div>
                <div className="text-tui-dim text-xs truncate">{track.artist.name}</div>
              </div>
              <span className="text-tui-green hidden sm:inline shrink-0">
                {chartBar(Number(track.playcount), maxTrack)}
              </span>
              <span className="text-tui-dim w-12 text-right shrink-0">{track.playcount}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Top Albums */}
      <div className="tui-panel">
        <span className="tui-panel-title">top albums</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.topAlbums.map((album) => {
            const cover = album.image?.[3]?.['#text'];
            return (
              <a
                key={album.url}
                href={album.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                {cover ? (
                  <img
                    src={cover}
                    alt=""
                    className="w-full aspect-square border border-tui-border group-hover:border-tui-cyan transition-colors"
                  />
                ) : (
                  <div className="w-full aspect-square border border-tui-border bg-tui-bg flex items-center justify-center text-tui-dim">
                    ♫
                  </div>
                )}
                <div className="text-tui-bright text-xs truncate mt-1">{album.name}</div>
                <div className="text-tui-dim text-xs truncate">{album.artist.name}</div>
                <div className="text-tui-green text-xs">{album.playcount} plays</div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Recent */}
      <div className="tui-panel">
        <span className="tui-panel-title">recent</span>
        <div className="space-y-1">
          {data.recent.map((track, i) => {
            const nowPlaying = track['@attr']?.nowplaying === 'true';
            return (
              <a
                key={`${track.url}-${i}`}
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-item flex items-center gap-3 text-sm"
              >
                <span className={`shrink-0 ${nowPlaying ? 'text-tui-green' : 'text-tui-dim'}`}>
                  {nowPlaying ? '▶' : '·'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-tui-bright truncate">{track.name}</div>
                  <div className="text-tui-dim text-xs truncate">{track.artist['#text']}</div>
                </div>
                <span className={`text-xs shrink-0 ${nowPlaying ? 'text-tui-green' : 'text-tui-dim'}`}>
                  {nowPlaying ? 'now' : relativeTime(track.date?.uts)}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </TerminalWindow>
  );
};

export default Music;
