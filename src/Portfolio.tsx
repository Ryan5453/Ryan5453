import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TerminalWindow from './components/TerminalWindow';

interface TrackImage {
  '#text': string;
  size: string;
}

interface Artist {
  '#text': string;
  mbid?: string;
}

interface Album {
  '#text': string;
  mbid?: string;
}

interface Track {
  name: string;
  artist: Artist;
  album: Album;
  image: TrackImage[];
  url: string;
}

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [displayedTrackName, setDisplayedTrackName] = useState('');
  const [displayedTrackArtist, setDisplayedTrackArtist] = useState('');
  const [trackCursor, setTrackCursor] = useState(false);
  const prevTrackRef = useRef('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const shortcuts: Record<string, string> = {
        g: 'https://github.com/Ryan5453',
        t: 'https://twitter.com/Ryan5453',
        l: 'https://linkedin.com/in/Ryan5453',
        m: 'mailto:ryan@ryan.science',
        k: 'https://github.com/Ryan5453.gpg',
        b: '/blog',
        s: '/lastfm',
      };

      const url = shortcuts[e.key];
      if (!url) return;

      if (url.startsWith('/')) {
        navigate(url);
      } else {
        window.open(url, '_blank');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        /**
         * last.fm api keys are effectively client IDs — safe to expose.
         * The api secret (not used here) is the actual credential.
         */
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=Ryan5453&api_key=f3878d8bcb04561fe918bb6f22ba808f&format=json`
        );
        const data = await response.json();
        setCurrentTrack(data.recenttracks.track[0]);
      } catch (error) {
        console.error('Error fetching track:', error);
      }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 30000);
    return () => clearInterval(interval);
  }, []);

  const trackName = currentTrack ? `♫ ${currentTrack.name}` : '';
  const trackArtist = currentTrack
    ? `${currentTrack.artist['#text']} — ${currentTrack.album['#text']}`
    : '';
  const trackKey = currentTrack
    ? `${currentTrack.name}|${currentTrack.artist['#text']}`
    : '';

  useEffect(() => {
    if (trackKey && trackKey !== prevTrackRef.current) {
      prevTrackRef.current = trackKey;
      setDisplayedTrackName('');
      setDisplayedTrackArtist('');
      setTrackCursor(true);
    }
  }, [trackKey]);

  useEffect(() => {
    if (!trackName || displayedTrackName.length >= trackName.length) return;
    const timeout = setTimeout(() => {
      setDisplayedTrackName(trackName.slice(0, displayedTrackName.length + 1));
    }, 40);
    return () => clearTimeout(timeout);
  }, [displayedTrackName, trackName]);

  useEffect(() => {
    if (!trackName || displayedTrackName.length < trackName.length) return;
    if (!trackArtist || displayedTrackArtist.length >= trackArtist.length) return;
    const timeout = setTimeout(() => {
      setDisplayedTrackArtist(trackArtist.slice(0, displayedTrackArtist.length + 1));
    }, 40);
    return () => clearTimeout(timeout);
  }, [displayedTrackArtist, trackArtist, displayedTrackName, trackName]);

  useEffect(() => {
    if (!trackArtist || displayedTrackArtist.length < trackArtist.length) return;
    const timeout = setTimeout(() => setTrackCursor(false), 3000);
    return () => clearTimeout(timeout);
  }, [displayedTrackArtist, trackArtist]);

  const isTypingName = trackName.length > 0 && displayedTrackName.length < trackName.length;

  const statusBar = (
    <>
      <div className="flex items-center gap-4 flex-wrap">
        <a href="https://github.com/Ryan5453" target="_blank" rel="noopener noreferrer" className="shortcut-link">
          <span className="text-tui-yellow">[g]</span>ithub
        </a>
        <a href="https://twitter.com/Ryan5453" target="_blank" rel="noopener noreferrer" className="shortcut-link">
          <span className="text-tui-yellow">[t]</span>witter
        </a>
        <a href="https://linkedin.com/in/Ryan5453" target="_blank" rel="noopener noreferrer" className="shortcut-link">
          <span className="text-tui-yellow">[l]</span>inkedin
        </a>
        <a href="mailto:ryan@ryan.science" className="shortcut-link">
          <span className="text-tui-yellow">[m]</span>ail
        </a>
        <a href="https://github.com/Ryan5453.gpg" target="_blank" rel="noopener noreferrer" className="shortcut-link">
          <span className="text-tui-yellow">[k]</span>ey
        </a>
        <a href="/blog" className="shortcut-link">
          <span className="text-tui-yellow">[b]</span>log
        </a>
      </div>
      <span className="text-tui-dim hidden sm:inline">ryan.science</span>
    </>
  );

  return (
    <TerminalWindow statusBar={statusBar}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-tui-bright">Ryan Fahey</h1>
        <p className="text-tui-dim mt-1 text-sm">software & infrastructure engineer</p>
      </div>

      {/* About — neofetch style */}
      <div className="tui-panel">
        <span className="tui-panel-title">about</span>
        <div className="flex gap-6">
          <pre className="hidden md:block text-tui-green text-sm leading-tight select-none mt-1">{`┌──┐\n│>_│\n└──┘`}</pre>
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-tui-cyan font-bold">ryan</span>
              <span className="text-tui-dim">@</span>
              <span className="text-tui-cyan font-bold">ryan.science</span>
            </div>
            <div className="text-tui-border select-none">─────────────────────</div>
            <div>
              <span className="text-tui-magenta">edu  </span>
              <span className="text-tui-dim">~</span> northeastern university (cs, ai concentration){' '}
              <span className="text-tui-dim">· expected 2027</span>
            </div>
            <div>
              <span className="text-tui-magenta">work </span>
              <span className="text-tui-dim">~</span>{' '}
              <a href="https://philips.com" className="text-tui-cyan hover:underline">philips</a>{' '}
              (swe)
            </div>
            <div>
              <span className="text-tui-magenta">prev </span>
              <span className="text-tui-dim">~</span>{' '}
              <a href="https://montai.com" className="text-tui-cyan hover:underline">montai therapeutics</a>{' '}
              (mlops/infra & swe)
            </div>
            <div>
              <span className="text-tui-magenta">blog </span>
              <span className="text-tui-dim">~</span>{' '}
              <a href="/blog" className="text-tui-cyan hover:underline">ryan.science/blog</a>
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="tui-panel">
        <span className="tui-panel-title">projects</span>
        <div className="space-y-1">
          {/* Flowery */}
          <div className="project-item">
            <div className="flex items-start gap-3">
              <span className="text-tui-yellow mt-0.5">▸</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-tui-bright font-bold">Flowery</span>
                  <span className="text-tui-dim text-xs">·</span>
                  <a href="https://flowery.pw" target="_blank" rel="noopener noreferrer" className="text-tui-cyan hover:underline text-xs">
                    flowery.pw
                  </a>
                </div>
                <p className="text-sm text-tui-dim mt-1 leading-relaxed">
                  Unified TTS API aggregating 1,400+ voices from 16 providers. Uses custom SSML parser with real-time translation and audio mixing. Processes 1M+ requests/month.
                </p>
              </div>
            </div>
          </div>

          {/* demucs-next */}
          <div className="project-item">
            <div className="flex items-start gap-3">
              <span className="text-tui-yellow mt-0.5">▸</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-tui-bright font-bold whitespace-nowrap">demucs-next</span>
                  <span className="text-tui-dim text-xs">·</span>
                  <a href="https://demucs.app" target="_blank" rel="noopener noreferrer" className="text-tui-cyan hover:underline text-xs">
                    demucs.app
                  </a>
                  <a href="https://github.com/Ryan5453/demucs-next" target="_blank" rel="noopener noreferrer" className="text-tui-dim hover:text-tui-text text-xs">
                    github
                  </a>
                </div>
                <p className="text-sm text-tui-dim mt-1 leading-relaxed">
                  Modern fork of Meta's audio source separation model. Faster, with modern dependencies, includes a Python library (CLI, API, and REST support) and a web app with WebGPU inference. 
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Research */}
      <div className="tui-panel">
        <span className="tui-panel-title">research</span>
        <div className="space-y-1">
          <div className="project-item">
            <div className="flex items-start gap-3">
              <span className="text-tui-yellow mt-0.5">▸</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-tui-bright font-bold">CacheProbe</span>
                  <span className="text-tui-dim text-xs">·</span>
                  <a href="https://github.com/Ryan5453/cacheprobe" target="_blank" rel="noopener noreferrer" className="text-tui-dim hover:text-tui-text text-xs">
                    github
                  </a>
                  <span className="text-tui-dim text-xs">·</span>
                  <a href="https://arxiv.org/abs/2605.30613" target="_blank" rel="noopener noreferrer" className="text-tui-dim hover:text-tui-text text-xs">
                    arxiv
                  </a>
                </div>
                <div className="text-xs text-tui-yellow mt-1">
                  presented @{' '}
                  <a href="https://sites.google.com/view/sagai-2026" target="_blank" rel="noopener noreferrer" className="hover:underline">SAGAI 2026</a>{' '}
                  (IEEE S&amp;P workshop)
                </div>
                <p className="text-sm text-tui-dim mt-1 leading-relaxed">
                  Auditing prompt cache isolation in API gateways. Demonstrates that shared organizational credentials in OpenRouter enable cross-user cache side-channel attacks across major LLM providers.
                </p>
              </div>
            </div>
          </div>

          <div className="project-item">
            <div className="flex items-start gap-3">
              <span className="text-tui-yellow mt-0.5">▸</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-tui-bright font-bold">LyricScribe</span>
                  <span className="text-tui-dim text-xs">·</span>
                  <a href="https://github.com/Ryan5453/LyricScribe" target="_blank" rel="noopener noreferrer" className="text-tui-dim hover:text-tui-text text-xs">
                    github
                  </a>
                </div>
                <p className="text-sm text-tui-dim mt-1 leading-relaxed">
                  Cross-architecture error analysis for automatic lyric transcription. Shows that Whisper, Canary, and Parakeet TDT produce distinct insertion/deletion failure modes at similar WERs, exposing what the single-number metric hides.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Now Playing */}
      <Link to="/lastfm" className="tui-panel block group">
        <span className="tui-panel-title">now-playing</span>
        {currentTrack ? (
          <div className="flex items-center gap-4">
            <img
              src={currentTrack.image[3]['#text'] || ''}
              alt=""
              className="w-12 h-12 border border-tui-border group-hover:border-tui-cyan transition-colors"
            />
            <div className="min-w-0 flex-1">
              <div className="text-tui-green truncate">
                {displayedTrackName}
                {trackCursor && isTypingName && <span className="cursor-block">█</span>}
              </div>
              <div className="text-sm text-tui-dim truncate">
                {displayedTrackArtist || '\u00A0'}
                {trackCursor && !isTypingName && <span className="cursor-block">█</span>}
              </div>
            </div>
            <span className="text-tui-dim text-xs whitespace-nowrap shrink-0 group-hover:text-tui-cyan transition-colors">
              <span className="text-tui-yellow">[s]</span> stats →
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border border-tui-border bg-tui-bg" />
            <div className="text-tui-dim text-sm flex-1">
              listening<span className="cursor-block">█</span>
            </div>
            <span className="text-tui-dim text-xs whitespace-nowrap shrink-0 group-hover:text-tui-cyan transition-colors">
              <span className="text-tui-yellow">[s]</span> stats →
            </span>
          </div>
        )}
      </Link>
    </TerminalWindow>
  );
};

export default Portfolio;
