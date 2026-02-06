import React, { useState } from 'react';
import { MenuProps } from '../../interfaces';
import './Menu.css';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

const Menu: React.FC<MenuProps> = ({ nextPlaylistId, onSubmit }) => {
  const [input, setInput] = useState('');
  const { addTrackLoading } = useSelector((state: RootState) => state.playlist);

  const supportedSitesUrl = "https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await onSubmit(input);
    setInput('');
  };

  const nextPlaylistUrl = `/${nextPlaylistId}`;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm fixed top-0 left-0 right-0 z-50 navbar">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 space-x-2">
          <div className="flex items-center flex-1 space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <span className="text-xl font-bold hidden md:inline">Big Playlist</span>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="url"
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter a media streaming site URL (YouTube, Bandcamp, Soundcloud, etc.)"
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm transition-all duration-200"
                  required
                />
                <button
                  type="submit"
                  disabled={addTrackLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm"
                >
                  {addTrackLoading ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={supportedSitesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 md:px-4 py-2.5 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white/50 backdrop-blur-sm hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              title="Supported Sites"
            >
              <svg className="w-4 h-6 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden md:inline">Supported Sites</span>
            </a>
            <a
              href={nextPlaylistUrl}
              className="inline-flex items-center px-2 md:px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              title="New Playlist"
            >
              <svg className="w-4 h-6 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden md:inline">New Playlist</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
