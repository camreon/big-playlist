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
  playlistLoading: false,
  fetchTrackLoading: false,
  addTrackLoading: false
};

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
    nextTrack: (state) => {
      if (state.tracks.length > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.tracks.length;
      }
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

      .addCase(ADD_TRACK.pending, (state) => {
        state.addTrackLoading = true;
      })
      .addCase(ADD_TRACK.fulfilled, (state, action) => {
        state.tracks = [...state.tracks, ...action.payload];
        state.addTrackLoading = false;
      })
      .addCase(ADD_TRACK.rejected, (state) => {
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
  prevTrack 
} = playlistSlice.actions;

export default playlistSlice.reducer; 