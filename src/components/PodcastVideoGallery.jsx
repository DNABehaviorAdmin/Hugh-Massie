import { useState } from 'react';
import SpotlightCard from './SpotlightCard';
import MagneticButton from './MagneticButton';

const PODCAST_VIDEOS = [
  {
    id: "KAa5twIzWgw",
    title: "Solving Money Problems by addressing Root People Problems",
    description: "Hugh Massie explains why traditional financial planning often fails by ignoring the human behavioral element.",
    duration: "45:12"
  },
  {
    id: "3vxDr6mW5ew",
    title: "Founders Keepers – Why Founders Are Built to Fail, and What It Takes to Succeed",
    description: "A deep dive into the psychological challenges founders face and the traits necessary for long-term entrepreneurial success.",
    duration: "38:20"
  },
  {
    id: "CHXV0xbBXvI", // Placeholder
    title: "Using Synthetic Participants for Research",
    description: "Exploring the cutting-edge intersection of Behavioral AI and market research using synthetic personas.",
    duration: "52:05"
  },
  {
    id: "IgSGCCxl2Oc", // Placeholder
    title: "One Nudge Is Not Enough",
    description: "Why small behavioral interventions require a comprehensive strategy to create lasting organizational change.",
    duration: "41:15"
  }
];

export default function PodcastVideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState(PODCAST_VIDEOS[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Main Video Player */}
      <div className="lg:col-span-2 space-y-6">
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black group">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=0&rel=0`}
            title={selectedVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="space-y-4 px-2">
          <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {selectedVideo.title}
          </h3>
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-3xl">
            {selectedVideo.description}
          </p>
        </div>
      </div>

      {/* Playlist */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 px-2 flex items-center gap-2">
          Up Next
          <span className="h-px bg-white/5 flex-grow"></span>
        </h4>
        <div className="space-y-3 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {PODCAST_VIDEOS.map((video) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`w-full text-left transition-all duration-300 group ${
                selectedVideo.id === video.id 
                ? 'scale-[1.02]' 
                : 'hover:scale-[1.01]'
              }`}
            >
              <SpotlightCard 
                className={`p-4 rounded-2xl border transition-all duration-500 ${
                  selectedVideo.id === video.id 
                  ? 'bg-accent/5 border-accent/30 shadow-[0_0_20px_rgba(45,212,191,0.15)]' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex gap-4 items-center">
                  <div className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0 bg-slate-800">
                    <img 
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${selectedVideo.id === video.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <svg className={`w-8 h-8 ${selectedVideo.id === video.id ? 'text-accent' : 'text-white'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h5 className={`font-bold text-sm line-clamp-2 leading-snug transition-colors ${selectedVideo.id === video.id ? 'text-accent' : 'text-white group-hover:text-accent'}`}>
                      {video.title}
                    </h5>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full inline-block">
                      {video.duration}
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            </button>
          ))}
        </div>
        
        <div className="pt-4 px-2">
          <MagneticButton 
            as="a" 
            href="https://youtube.com/@behavioraleconomicstoday?si=QMi0Z2LwYhet0eb6" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 text-sm font-bold bg-white/5 border border-white/10 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
            Watch more on YouTube
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
