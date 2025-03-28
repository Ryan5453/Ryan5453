import React, { useState, useEffect } from 'react';
import { Mail, Music, Github, Linkedin, Twitter, AudioLines, Library, X } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-orange-50 dark:from-orange-950 dark:via-rose-950 dark:to-orange-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200 dark:bg-rose-900 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-200 dark:bg-amber-900 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-orange-200 dark:bg-orange-900 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-2000" />
      </div>

      <div className="relative container max-w-2xl mx-auto px-6 py-16">
        <div className="relative bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-orange-100/50 dark:border-orange-900/50 shadow-xl shadow-orange-100/50 dark:shadow-orange-950/50 hover:shadow-2xl hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50 transition-all duration-500">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 
                className="text-3xl sm:text-4xl font-bold text-orange-950 dark:text-orange-50 relative cursor-pointer w-fit"
                onClick={() => setShowPopup(true)}
              >
                Ryan Fahey
              </h1>
              <div className="flex items-center space-x-4">
                <a href="https://github.com/Ryan5453" className="text-orange-700 dark:text-orange-300 hover:text-orange-950 dark:hover:text-orange-100 transition-all transform hover:scale-110 hover:rotate-3">
                  <Github size={20} />
                </a>
                <a href="https://twitter.com/Ryan5453" className="text-orange-700 dark:text-orange-300 hover:text-orange-950 dark:hover:text-orange-100 transition-all transform hover:scale-110 hover:rotate-3">
                  <Twitter size={20} />
                </a>
                <a href="https://linkedin.com/in/Ryan5453" className="text-orange-700 dark:text-orange-300 hover:text-orange-950 dark:hover:text-orange-100 transition-all transform hover:scale-110 hover:rotate-3">
                  <Linkedin size={20} />
                </a>
                <a href="mailto:ryan@ryan.science" className="text-orange-700 dark:text-orange-300 hover:text-orange-950 dark:hover:text-orange-100 transition-all transform hover:scale-110 hover:rotate-3">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="space-y-4">
              <p className="text-lg text-orange-900 dark:text-orange-100 leading-relaxed">
                i currently work as a computational modeling engineer at montai therapeutics on co-op while pursuing my computer science degree at northeastern university.
              </p>
              <p className="text-lg text-orange-900 dark:text-orange-100 leading-relaxed">
                i'm passionate about building robust scalable infrastructure and exploring the fascinating field of machine learning, especially in areas like speech synthesis, automatic speech recognition, and large language models. i find the intersection of these interests particularly fascinating.
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-16 pt-8">
          <div className="absolute inset-x-0 top-0 h-px bg-orange-300 dark:bg-orange-700 z-50" />
          <h2 className="text-2xl font-bold text-orange-950 dark:text-orange-50 mb-6 relative inline-block">
            <span className="flex items-center gap-2">
              Projects
            </span>
          </h2>
          
          <div className="space-y-6">
            <div className="group bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-orange-100/50 dark:border-orange-900/50 shadow-xl shadow-orange-100/50 dark:shadow-orange-950/50 hover:shadow-2xl hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50 transition-all duration-500 hover:-translate-y-1">
              <a href="https://flowery.pw" className="block">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <img src={floweryLogo} alt="Flowery Logo" className="w-6 h-6" />
                    <h3 className="text-xl font-bold text-orange-950 dark:text-orange-50 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">Flowery</h3>
                  </div>
                  <span className="text-sm text-orange-600 dark:text-orange-300 bg-orange-100/80 dark:bg-orange-900/80 px-3 py-1 rounded-full font-medium">Featured</span>
                </div>
                <p className="mt-3 text-orange-800 dark:text-orange-200 leading-relaxed">
                  A free text-to-speech service that simplifies converting text to speech. Flowery connects you with multiple TTS providers, allowing you to access a variety of voices and engines from one convenient platform. With a clean web interface and developer-friendly API, it's built with a focus on simplicity and ease of use.
                </p>
              </a>
            </div>

            <div className="group bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-orange-100/50 dark:border-orange-900/50 shadow-xl shadow-orange-100/50 dark:shadow-orange-950/50 hover:shadow-2xl hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50 transition-all duration-500 hover:-translate-y-1">
              <a href="https://github.com/Ryan5453/SingingWhisper" className="block">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <AudioLines size={20} className="text-orange-700 dark:text-orange-300" />
                    <h3 className="text-xl font-bold text-orange-950 dark:text-orange-50 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">SingingWhisper</h3>
                  </div>
                  <span className="text-sm text-orange-600 dark:text-orange-300 bg-orange-100/80 dark:bg-orange-900/80 px-3 py-1 rounded-full font-medium">Research</span>
                </div>
                <p className="mt-3 text-orange-800 dark:text-orange-200 leading-relaxed">
                  An ambitious research project exploring advanced techniques in music transcription. Combining state-of-the-art audio processing, machine learning models, and novel optimization approaches to transform how we convert music into text.
                </p>
              </a>
            </div>

            <div className="group bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-orange-100/50 dark:border-orange-900/50 shadow-xl shadow-orange-100/50 dark:shadow-orange-950/50 hover:shadow-2xl hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50 transition-all duration-500 hover:-translate-y-1">
              <a href="https://songdata.org" className="block">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Library size={20} className="text-orange-700 dark:text-orange-300" />
                    <h3 className="text-xl font-bold text-orange-950 dark:text-orange-50 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">SongData</h3>
                  </div>
                  <span className="text-sm text-orange-600 dark:text-orange-300 bg-orange-100/80 dark:bg-orange-900/80 px-3 py-1 rounded-full font-medium">Upcoming</span>
                </div>
                <p className="mt-3 text-orange-800 dark:text-orange-200 leading-relaxed">
                  A unified music catalogue that seamlessly integrates with major music streaming platforms. Search for songs, albums, or artists and get direct links to enjoy them on your preferred service. Powered by cutting-edge technology derived from SingingWhisper, SongData offers an unparalleled music discovery experience. SongData will feature an intuitive web interface and a robust API for developers upon its release.
                </p>
              </a>
            </div>
          </div>
        </div>

        <div className="relative mt-12 pt-4">
          <div className="absolute inset-x-0 top-0 h-px bg-orange-300 dark:bg-orange-700 z-50" />
          <div className="mt-4 bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-orange-100/50 dark:border-orange-900/50 shadow-xl shadow-orange-100/50 dark:shadow-orange-950/50 hover:shadow-2xl hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50 transition-all duration-500 hover:-translate-y-1">
            <h2 className="text-xl font-bold text-orange-950 dark:text-orange-50 mb-4 flex items-center gap-2">
              <Music size={20} className="text-orange-700 dark:text-orange-300" />
              What I'm Listening To
            </h2>
            {currentTrack && (
              <a href="https://last.fm/user/Ryan5453" className="block group">
                <div className="flex mt-4">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-300 to-rose-300 dark:from-orange-700 dark:to-rose-700 blur-xl opacity-90 rounded-xl" />
                    <img 
                      src={currentTrack.image[3]['#text'] || "/api/placeholder/128/128"}
                      alt="Album Art"
                      className="w-24 h-24 rounded-xl object-cover relative"
                    />
                  </div>
                  <div className="ml-4 flex flex-col justify-center min-w-0">
                    <div className="text-lg font-medium text-orange-950 dark:text-orange-50 truncate group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">{currentTrack.name}</div>
                    <div className="text-base text-orange-800 dark:text-orange-200 mt-1 truncate">{currentTrack.artist['#text']}</div>
                    <div className="text-sm text-orange-700 dark:text-orange-300 mt-1 truncate">{currentTrack.album['#text']}</div>
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>

      {showPopup && imageLoaded && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowPopup(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 hover:text-orange-950 rounded-full transition-colors z-10"
              onClick={() => setShowPopup(false)}
            >
              <X size={20} />
            </button>
            <img 
              src={tessaImage}
              alt="Tessa"
              className="w-full h-auto"
            />
            <div className="p-6 bg-white dark:bg-black">
              <p className="text-center text-orange-900 dark:text-orange-100 text-xl font-medium">Meet Tessa, my adorable dog!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;