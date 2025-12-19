import React, { useState, useEffect } from 'react';
import { Mail, Github, Linkedin, Twitter, Mic, Key, ExternalLink, BookOpen } from 'lucide-react';
import floweryLogo from './assets/flowery.svg';
import demucsLogo from '/demucs.svg';

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
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f4' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-12">
          <h1
            className="text-2xl font-bold"
            style={{ color: '#1c1917' }}
          >
            Ryan Fahey
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <a href="https://github.com/Ryan5453" className="hover:opacity-60 transition-opacity" style={{ color: '#1c1917' }} title="GitHub">
              <Github size={18} />
            </a>
            <a href="https://twitter.com/Ryan5453" className="hover:opacity-60 transition-opacity" style={{ color: '#1c1917' }} title="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://linkedin.com/in/Ryan5453" className="hover:opacity-60 transition-opacity" style={{ color: '#1c1917' }} title="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="mailto:ryan@ryan.science" className="hover:opacity-60 transition-opacity" style={{ color: '#1c1917' }} title="Email">
              <Mail size={18} />
            </a>
            <a href="https://github.com/Ryan5453.gpg" className="hover:opacity-60 transition-opacity" style={{ color: '#1c1917' }} title="GPG Key">
              <Key size={18} />
            </a>
            <a href="/blog" className="hover:opacity-60 transition-opacity" style={{ color: '#1c1917' }} title="Blog">
              <BookOpen size={18} />
            </a>
          </div>
        </header>

        {/* About */}
        <section className="mb-12" style={{ color: '#1c1917' }}>
          <p className="mb-4 leading-relaxed">
            I'm a software and infrastructure engineer currently pursuing my bachelor's in computer science at Northeastern University.
            Previously worked as an MLOps & Infrastructure Engineer at <a href="https://montai.com">Montai Therapeutics</a> on co-op.
          </p>
          <p className="leading-relaxed">
            I'm passionate about building robust, scalable systems and machine learning (especially speech synthesis, ASR, and LLMs).
            I find the intersection of these areas particularly fascinating.
          </p>
        </section>

        {/* Projects */}
        <section className="mb-12">
          <h2 className="text-sm uppercase tracking-wide mb-6" style={{ color: '#57534e' }}>Projects</h2>

          <div className="space-y-6">
            <div className="border rounded-lg p-5" style={{ borderColor: '#e7e5e4', backgroundColor: '#ffffff' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img src={floweryLogo} alt="Flowery" className="w-5 h-5" />
                  <h3 className="font-bold" style={{ color: '#1c1917' }}>Flowery</h3>
                </div>
                <div className="flex items-center gap-3">
                  <a href="https://flowery.pw" className="hover:opacity-60 transition-opacity flex items-center gap-1 text-sm" style={{ color: '#57534e' }} title="Website">
                    <ExternalLink size={14} />
                    <span>Website</span>
                  </a>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#57534e' }}>
                Free text-to-speech service that unifies multiple TTS providers into a single platform. Features a developer-first API and clean web interface, with a focus on simplicity and ease of use. Processes 1M+ requests per month.
              </p>
            </div>

            <div className="border rounded-lg p-5" style={{ borderColor: '#e7e5e4', backgroundColor: '#ffffff' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img src={demucsLogo} alt="Demucs" className="w-5 h-5" />
                  <h3 className="font-bold" style={{ color: '#1c1917' }}>demucs-next</h3>
                </div>
                <div className="flex items-center gap-3">
                  <a href="https://demucs.app" className="hover:opacity-60 transition-opacity flex items-center gap-1 text-sm" style={{ color: '#57534e' }} title="Website">
                    <ExternalLink size={14} />
                    <span>Website</span>
                  </a>
                  <a href="https://github.com/Ryan5453/demucs-next" className="hover:opacity-60 transition-opacity flex items-center gap-1 text-sm" style={{ color: '#57534e' }} title="GitHub">
                    <Github size={14} />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#57534e' }}>
                Modern fork of Demucs, a Python library for separating audio into isolated stems (vocals, drums, bass, and more). Brings support for Python 3.10+, latest PyTorch & TorchCodec versions, and UV for better dependency management and streamlined CUDA installation.
              </p>
            </div>

            <div className="border rounded-lg p-5" style={{ borderColor: '#e7e5e4', backgroundColor: '#ffffff' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Mic size={18} style={{ color: '#57534e' }} />
                  <h3 className="font-bold" style={{ color: '#1c1917' }}>LyricScribe</h3>
                </div>
                <div className="flex items-center gap-3">
                  <a href="https://github.com/Ryan5453/LyricScribe" className="hover:opacity-60 transition-opacity flex items-center gap-1 text-sm" style={{ color: '#57534e' }} title="GitHub">
                    <Github size={14} />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#57534e' }}>
                Exploring accurate lyric transcription from music using ML pipelines. Evaluates and combines different vocal separation and speech recognition models to tackle the unique challenges and complexities of music transcription.
              </p>
            </div>
          </div>
        </section>

        {/* Now Playing */}
        {currentTrack && (
          <section>
            <h2 className="text-sm uppercase tracking-wide mb-4" style={{ color: '#57534e' }}>Now Playing</h2>
            <a href={currentTrack.url} className="block group">
              <div className="border rounded-lg p-5 hover:border-stone-400 transition-colors" style={{ borderColor: '#e7e5e4', backgroundColor: '#ffffff' }}>
                <div className="flex items-start gap-4">
                  <img
                    src={currentTrack.image[3]['#text'] || "/api/placeholder/64/64"}
                    alt="Album Art"
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <div className="font-medium truncate" style={{ color: '#1c1917' }}>{currentTrack.name}</div>
                    <div className="text-sm truncate" style={{ color: '#57534e' }}>{currentTrack.artist['#text']}</div>
                    <div className="text-sm truncate" style={{ color: '#78716c' }}>{currentTrack.album['#text']}</div>
                  </div>
                </div>
              </div>
            </a>
          </section>
        )}
      </div>
    </div>
  );
};

export default Portfolio;