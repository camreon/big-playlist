// ABOUTME: Tests for the playlist body while a submitted track is still resolving.
// ABOUTME: Covers the placeholder row and its effect on the empty state.
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect, test, vi } from 'vitest';
import Playlist from './index';
import playlistReducer from '../../reducers/playlistReducer';
import feedbackReducer from '../../reducers/feedbackReducer';
import { PlaylistState, TrackProps } from '../../interfaces';

const PAGE_URL = 'https://jebediahspringfield.bandcamp.com/track/i-like-killing-flies-2';

const track: TrackProps = {
  id: 1,
  title: 'I Like Killing Flies',
  artist: 'Jebediah Springfield',
  page_url: PAGE_URL,
  stream_url: 'https://example.test/stream.m4a'
};

function renderPlaylist(playlist: Partial<PlaylistState>, tracks: TrackProps[] = []) {
  const store = configureStore({
    reducer: { playlist: playlistReducer, feedback: feedbackReducer },
    preloadedState: {
      playlist: { ...playlistReducer(undefined, { type: '@@INIT' }), ...playlist }
    }
  });

  render(
    <Provider store={store}>
      <Playlist
        playlistId="1"
        tracks={tracks}
        playTrack={vi.fn()}
        deleteTrack={vi.fn()}
      />
    </Provider>
  );
}

test('shows a placeholder row for a track that is still being added', () => {
  renderPlaylist({ pendingTrackUrls: [PAGE_URL] }, [track]);

  const pending = screen.getByRole('status', { name: `Adding ${PAGE_URL}` });

  expect(pending).toBeInTheDocument();
  expect(pending).toHaveClass('opacity-50');
});

test('shows the placeholder instead of the empty state on a new playlist', () => {
  renderPlaylist({ pendingTrackUrls: [PAGE_URL] });

  expect(screen.getByRole('status', { name: `Adding ${PAGE_URL}` })).toBeInTheDocument();
  expect(screen.queryByText('No tracks found')).not.toBeInTheDocument();
});

test('shows the empty state when nothing is pending', () => {
  renderPlaylist({});

  expect(screen.getByText('No tracks found')).toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
