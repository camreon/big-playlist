import { PlayerProps } from '../../interfaces';
import './Player.css';

const Player = ({
  streamUrl,
  handleOnNext,
  handleOnPrev,
  title = '',
  artist = '',
}: PlayerProps) => {
  return (
    <div className="player-container bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4 flex-wrap sm:flex-nowrap">
      {(title || artist) && (
          <div className="player-now-playing flex-shrink-0 max-w-full sm:max-w-xs text-left py-1 px-3 rounded-lg bg-gray-100/80 border border-gray-200/80">
            {title && (
              <p className="text-sm font-medium text-gray-900 truncate" title={title}>
                {title}
              </p>
            )}
            {artist && (
              <p className="text-xs text-gray-600 truncate" title={artist}>
                {artist}
              </p>
            )}
          </div>
        )}
        <div className="player-controls-group flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={handleOnPrev}
            title="Previous track"
            className="player-nav-btn flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <audio
            autoPlay
            controls
            controlsList="nodownload"
            src={streamUrl}
            onEnded={handleOnNext}
            className="player-audio flex-1 min-w-0 h-10"
          />
          <button
            onClick={handleOnNext}
            title="Next track"
            className="player-nav-btn flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
