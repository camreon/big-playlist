import React, { useEffect, useRef, useState } from 'react';
import { TrackComponentProps } from '../../../interfaces';
import './Track.css';
import { PauseIcon, PlayIcon } from '../../Common/Icons';

export const Track: React.FC<TrackComponentProps> = ({
  isLoading,
  isPlaying,
  handleOnClick,
  handleOnDelete,
  track,
  index
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnClickAway = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnClickAway);

    return () => document.removeEventListener('mousedown', closeOnClickAway);
  }, [menuOpen]);

  return (
    <div 
      onClick={handleOnClick}
      className={`group relative px-6 py-4 hover:bg-gray-50/50 cursor-pointer transition-all duration-200 track-item 
        ${isPlaying ? 'playing' : ''}
        ${isLoading && isPlaying ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {isPlaying ? (
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
              <PauseIcon />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 group-hover:bg-amber-700 transition-colors duration-200 track-number">
              <span className="group-hover:hidden">{index + 1}</span>
              <span className="hidden group-hover:block"><PlayIcon /></span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate" title={track.title}>
                {track.title}
              </p>
              {track.artist && (
                <p className="text-sm text-gray-500 truncate" title={track.artist}>
                  {track.artist}
                </p>
              )}
            </div>
            
            <div className="inline-actions hidden md:flex items-center space-x-3 ml-4">
              <a 
                href={track.page_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200 action-button source-button"
                title="Open source"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOnDelete();
                }}
                className="text-gray-400 hover:text-red-600 transition-colors duration-200 action-button delete-button cursor-pointer"
                title={`Delete ${track.title}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="relative md:hidden ml-4" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((open) => !open);
                }}
                className="text-gray-400 track-menu-button cursor-pointer"
                aria-label="Track actions"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-10 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <a
                    role="menuitem"
                    href={track.page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                    }}
                  >
                    Open source
                  </a>
                  <button
                    role="menuitem"
                    className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      handleOnDelete();
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
