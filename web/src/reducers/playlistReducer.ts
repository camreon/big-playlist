import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaylistState } from '../interfaces';
import { 
  FETCH_PLAYLIST, 
  FETCH_TRACK, 
  ADD_TRACK, 
  DELETE_TRACK, 
  FETCH_NEXT_PLAYLIST_ID 
} from '../actions/playlistActions';

const initialState: PlaylistState = {
  playlistId: '1',
  nextPlaylistId: '',
  streamUrl: '',
  currentIndex: -1,
  tracks: [],
  pendingTrackUrls: [],
  shuffle: false,
  repeat: false,
  playlistLoading: false,
  fetchTrackLoading: false,
  addTrackLoading: false
};

function removePendingUrl(state: PlaylistState, pageUrl: string) {
  const index = state.pendingTrackUrls.indexOf(pageUrl);

  if (index !== -1) {
    state.pendingTrackUrls.splice(index, 1);
  }
}

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlaylistId: (state, action: PayloadAction<string>) => {
      state.playlistId = action.payload;
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    setStreamUrl: (state, action: PayloadAction<string>) => {
      state.streamUrl = action.payload;
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    toggleRepeat: (state) => {
      state.repeat = !state.repeat;
    },
    nextTrack: (state, action: PayloadAction<number | undefined>) => {
      if (state.tracks.length === 0) {
        return;
      }

      if (state.shuffle && state.tracks.length > 1) {
        // Offsetting from the next track keeps shuffle off the one already playing.
        const roll = action.payload ?? 0;
        const others = state.tracks.length - 1;
        const offset = Math.min(Math.floor(roll * others), others - 1);

        state.currentIndex = (state.currentIndex + 1 + offset) % state.tracks.length;
        return;
      }

      state.currentIndex = (state.currentIndex + 1) % state.tracks.length;
    },
    prevTrack: (state) => {
      if (state.tracks.length > 0) {
        state.currentIndex = state.currentIndex > 0 
          ? state.currentIndex - 1 
          : state.tracks.length - 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(FETCH_PLAYLIST.pending, (state) => {
        state.playlistLoading = true;
      })
      .addCase(FETCH_PLAYLIST.fulfilled, (state, action) => {
        state.tracks = action.payload;
        state.playlistLoading = false;
      })
      .addCase(FETCH_PLAYLIST.rejected, (state) => {
        state.playlistLoading = false;
      })

      .addCase(FETCH_TRACK.pending, (state) => {
        state.fetchTrackLoading = true;
      })
      .addCase(FETCH_TRACK.fulfilled, (state, action) => {
        state.streamUrl = action.payload.stream_url;
        state.fetchTrackLoading = false;
      })
      .addCase(FETCH_TRACK.rejected, (state) => {
        state.fetchTrackLoading = false;
      })

      .addCase(ADD_TRACK.pending, (state, action) => {
        state.pendingTrackUrls.push(action.meta.arg.pageUrl);
        state.addTrackLoading = true;
      })
      .addCase(ADD_TRACK.fulfilled, (state, action) => {
        removePendingUrl(state, action.meta.arg.pageUrl);
        state.tracks = [...state.tracks, ...action.payload];
        state.addTrackLoading = false;
      })
      .addCase(ADD_TRACK.rejected, (state, action) => {
        removePendingUrl(state, action.meta.arg.pageUrl);
        state.addTrackLoading = false;
      })

      .addCase(DELETE_TRACK.fulfilled, (state, action) => {
        const { trackId } = action.payload;
        state.tracks = state.tracks.filter((track) => track.id !== trackId);
      })

      .addCase(FETCH_NEXT_PLAYLIST_ID.fulfilled, (state, action) => {
        state.nextPlaylistId = action.payload;
      });
  }
});

export const { 
  setPlaylistId, 
  setCurrentIndex, 
  setStreamUrl, 
  nextTrack, 
  prevTrack,
  toggleShuffle,
  toggleRepeat
} = playlistSlice.actions;

export default playlistSlice.reducer; 