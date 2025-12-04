import React, { useState, useEffect } from 'react';
import { Mail, Music, Github, Linkedin, Twitter, Split, X, Mic, Key } from 'lucide-react';
import floweryLogo from './assets/flowery.svg';
import tessaImage from './assets/tessa.png';

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
  const [showPopup, setShowPopup] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  useEffect(() => {
    const img = new Image();
    img.src = tessaImage;
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-50 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-200 dark:bg-sky-900 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-200 dark:bg-indigo-900 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative container max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-6 py-16">
        <div className="relative bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-blue-100/50 dark:border-blue-900/50 shadow-xl shadow-blue-100/50 dark:shadow-blue-950/50 hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50 transition-all duration-500">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1
                className="text-3xl sm:text-4xl font-bold text-blue-950 dark:text-blue-50 relative cursor-pointer w-fit"
                onClick={() => setShowPopup(true)}
              >
                Ryan Fahey
              </h1>
              <div className="flex items-center space-x-4">
                <a href="https://github.com/Ryan5453" className="text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-all transform hover:scale-110 hover:rotate-3" title="GitHub">
                  <Github size={20} />
                </a>
                <a href="https://twitter.com/Ryan5453" className="text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-all transform hover:scale-110 hover:rotate-3" title="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="https://linkedin.com/in/Ryan5453" className="text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-all transform hover:scale-110 hover:rotate-3" title="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href="mailto:ryan@ryan.science" className="text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-all transform hover:scale-110 hover:rotate-3" title="Email">
                  <Mail size={20} />
                </a>
                <a href="https://github.com/Ryan5453.gpg" className="text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-all transform hover:scale-110 hover:rotate-3" title="GPG Key">
                  <Key size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="space-y-4">
              <p className="text-lg text-blue-900 dark:text-blue-100 leading-relaxed">
                I'm a software and infrastructure engineer currently pursuing my bachelor's in computer science at Northeastern University.
                I previously worked as an MLOps & Infrastructure Engineer at <a href="https://montai.com" className="no-underline hover:no-underline text-blue-900 dark:text-blue-100">Montai Therapeutics</a> on co-op.
              </p>
              <p className="text-lg text-blue-900 dark:text-blue-100 leading-relaxed">
                I'm passionate about building robust, scalable infrastructure and exploring the world of machine learning, especially in areas like speech synthesis, automatic speech recognition, and large language models.
                I find the intersection of these interests particularly fascinating.
                I have a <a href="/blog" className="no-underline hover:no-underline text-blue-900 dark:text-blue-100 font-bold"> blog </a> where I write about things that interest me.
              </p>
              <p className="text-lg text-blue-900 dark:text-blue-100 leading-relaxed">
                I am looking for co-op opportunities from January 2026 to August 2026.
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-16 pt-8">
          <div className="absolute inset-x-0 top-0 h-px bg-blue-300 dark:bg-blue-700 z-50" />
          <h2 className="text-2xl font-bold text-blue-950 dark:text-blue-50 mb-6 relative inline-block">
            <span className="flex items-center gap-2">
              Projects
            </span>
          </h2>

          <div className="space-y-6">
            <div className="group bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-100/50 dark:border-blue-900/50 shadow-xl shadow-blue-100/50 dark:shadow-blue-950/50 hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50 transition-all duration-500 hover:-translate-y-1">
              <a href="https://flowery.pw" className="block">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <img src={floweryLogo} alt="Flowery Logo" className="w-6 h-6" />
                    <h3 className="text-xl font-bold text-blue-950 dark:text-blue-50 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">Flowery</h3>
                  </div>
                  <span className="text-sm text-blue-600 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/80 px-3 py-1 rounded-full font-medium whitespace-nowrap">Featured</span>
                </div>
                <p className="mt-3 text-blue-800 dark:text-blue-200 leading-relaxed">
                  Free text-to-speech service that simplifies converting text to speech. It connects you with multiple TTS providers, allowing you to access a variety of voices and engines from one convenient platform. With a clean web interface and developer-friendly API, it's built with a focus on simplicity and ease of use. Processes 1M+ requests per month.
                </p>
              </a>
            </div>

            <div className="group bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-100/50 dark:border-blue-900/50 shadow-xl shadow-blue-100/50 dark:shadow-blue-950/50 hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50 transition-all duration-500 hover:-translate-y-1">
              <a href="https://github.com/Ryan5453/demucs" className="block">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Split size={20} className="text-blue-700 dark:text-blue-300" />
                    <h3 className="text-xl font-bold text-blue-950 dark:text-blue-50 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">demucs-inference</h3>
                  </div>
                  <span className="text-sm text-blue-600 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/80 px-3 py-1 rounded-full font-medium whitespace-nowrap">Audio Processing</span>
                </div>
                <p className="mt-3 text-blue-800 dark:text-blue-200 leading-relaxed">
                  Modern fork of Demucs, a Python library for separating audio into isolated stems (vocals, drums, bass, and more). Brings support for Python 3.10+, latest PyTorch & TorchCodec versions, and UV for better dependency management and streamlined CUDA installation.
                </p>
              </a>
            </div>

            <div className="group bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-100/50 dark:border-blue-900/50 shadow-xl shadow-blue-100/50 dark:shadow-blue-950/50 hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50 transition-all duration-500 hover:-translate-y-1">
              <a href="https://github.com/Ryan5453/LyricScribe" className="block">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Mic size={20} className="text-blue-700 dark:text-blue-300" />
                    <h3 className="text-xl font-bold text-blue-950 dark:text-blue-50 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">LyricScribe</h3>
                  </div>
                  <span className="text-sm text-blue-600 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/80 px-3 py-1 rounded-full font-medium whitespace-nowrap">Research</span>
                </div>
                <p className="mt-3 text-blue-800 dark:text-blue-200 leading-relaxed">
                  Exploring accurate lyric transcription from music using ML pipelines. Evaluates and combines different vocal separation and speech recognition models to tackle the unique challenges and complexities of music transcription.
                </p>
              </a>
            </div>
          </div>
        </div>

        <div className="relative mt-12 pt-4">
          <div className="absolute inset-x-0 top-0 h-px bg-blue-300 dark:bg-blue-700 z-50" />
          <div className="mt-4 bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-100/50 dark:border-blue-900/50 shadow-xl shadow-blue-100/50 dark:shadow-blue-950/50 hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50 transition-all duration-500 hover:-translate-y-1">
            <h2 className="text-xl font-bold text-blue-950 dark:text-blue-50 mb-4 flex items-center gap-2">
              <Music size={20} className="text-blue-700 dark:text-blue-300" />
              What I'm Listening To
            </h2>
            {currentTrack && (
              <a href={currentTrack.url} className="block group">
                <div className="flex mt-4">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-300 to-sky-300 dark:from-blue-700 dark:to-sky-700 blur-xl opacity-90 rounded-xl" />
                    <img
                      src={currentTrack.image[3]['#text'] || "/api/placeholder/128/128"}
                      alt="Album Art"
                      className="w-24 h-24 rounded-xl object-cover relative"
                    />
                  </div>
                  <div className="ml-4 flex flex-col justify-center min-w-0">
                    <div className="text-lg font-medium text-blue-950 dark:text-blue-50 truncate group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{currentTrack.name}</div>
                    <div className="text-base text-blue-800 dark:text-blue-200 mt-1 truncate">{currentTrack.artist['#text']}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300 mt-1 truncate">{currentTrack.album['#text']}</div>
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>

      {showPopup && imageLoaded && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="relative w-full max-w-md bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-100/50 dark:border-blue-900/50 overflow-hidden transform transition-all duration-300 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full z-10 bg-white/90 dark:bg-black/60 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 hover:bg-white dark:hover:bg-black/80 transition-all shadow-lg hover:scale-110"
              onClick={() => setShowPopup(false)}
            >
              <X size={20} />
            </button>
            <img
              src={tessaImage}
              alt="Tessa"
              className="w-full h-auto rounded-t-2xl"
            />
            <div className="p-8">
              <p className="text-center text-blue-900 dark:text-blue-100 text-xl font-medium">Meet Tessa, my adorable dog!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;