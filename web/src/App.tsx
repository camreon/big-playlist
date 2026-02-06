import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { 
  FETCH_PLAYLIST, 
  FETCH_TRACK, 
  ADD_TRACK, 
  DELETE_TRACK, 
  FETCH_NEXT_PLAYLIST_ID,
} from './actions/playlistActions';
import Menu from './Components/Menu';
import Player from './Components/Player';
import Playlist from './Components/Playlist';
import './App.css';
import { nextTrack, prevTrack, setCurrentIndex, setPlaylistId } from './reducers/playlistReducer';

const DEFAULT_PLAYLIST_ID = '1';

const App: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { 
    playlistId, 
    nextPlaylistId, 
    streamUrl, 
    currentIndex, 
    tracks, 
  } = useSelector((state: RootState) => state.playlist);
  
  const { error } = useSelector((state: RootState) => state.feedback);

  useEffect(() => {
    const targetPlaylistId = id || DEFAULT_PLAYLIST_ID;
    dispatch(setPlaylistId(targetPlaylistId));
    dispatch(FETCH_PLAYLIST(targetPlaylistId));
    dispatch(FETCH_NEXT_PLAYLIST_ID());
  }, [dispatch, id]);

  const handleAddTrack = (pageUrl: string) => {
    dispatch(ADD_TRACK({ playlistId, pageUrl }));
  };

  const handlePlayTrack = (trackIndex: number) => {
    if (trackIndex === currentIndex) return;
    
    dispatch(setCurrentIndex(trackIndex));
    const track = tracks[trackIndex];
    dispatch(FETCH_TRACK({ playlistId, trackId: track.id }));
  };

  const handleDeleteTrack = (trackId: number) => {
    dispatch(DELETE_TRACK({ playlistId, trackId }));
  };

  const handleNextTrack = () => {
    dispatch(nextTrack());
    if (tracks.length > 0) {
      const nextIndex = (currentIndex + 1) % tracks.length;
      const track = tracks[nextIndex];
      dispatch(FETCH_TRACK({ playlistId, trackId: track.id }));
    }
  };

  const handlePrevTrack = () => {
    dispatch(prevTrack());
    if (tracks.length > 0) {
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
      const track = tracks[prevIndex];
      dispatch(FETCH_TRACK({ playlistId, trackId: track.id }));
    }
  };

  const currentTrack = tracks[currentIndex] || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      <Menu 
        nextPlaylistId={nextPlaylistId}
        onSubmit={handleAddTrack}
      />
      
      <main className="flex-1 pt-24 pb-36">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <Playlist 
              playlistId={playlistId}
              tracks={tracks} 
              playTrack={handlePlayTrack}
              deleteTrack={handleDeleteTrack}
            />
          </div>
        </div>
      </main>
      
      <Player 
        handleOnNext={handleNextTrack}
        handleOnPrev={handlePrevTrack}
        streamUrl={streamUrl}
        {...currentTrack} 
      />
    </div>
  );
};

export default App;
