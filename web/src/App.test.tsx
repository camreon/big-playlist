// ABOUTME: Tests for the App shell's playlist loading and track selection.
// ABOUTME: Stubs fetch at the network boundary so no real API is called.
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import App from './App';
import playlistReducer from './reducers/playlistReducer';
import feedbackReducer from './reducers/feedbackReducer';
import { PlaylistState, TrackProps } from './interfaces';

const tracks: TrackProps[] = [1, 2, 3].map((id) => ({
  id,
  title: `Track ${id}`,
  artist: 'Jebediah Springfield',
  page_url: `https://example.test/track/${id}`,
  stream_url: `https://example.test/stream/${id}.m4a`
}));

function renderApp(playlist: Partial<PlaylistState> = {}) {
  const fetchMock = vi.fn(async (url: string) => {
    const track = url.match(/\/api\/\d+\/(\d+)$/);

    if (url.endsWith('/newplaylist/')) {
      return { ok: true, json: async () => '2' };
    }
    if (track) {
      return { ok: true, json: async () => tracks.find((t) => t.id === Number(track[1])) };
    }
    return { ok: true, json: async () => playlist.tracks ?? [] };
  });
  vi.stubGlobal('fetch', fetchMock);

  const store = configureStore({
    reducer: { playlist: playlistReducer, feedback: feedbackReducer },
    preloadedState: {
      playlist: { ...playlistReducer(undefined, { type: '@@INIT' }), ...playlist }
    }
  });

  render(
    <Provider store={store}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    </Provider>
  );

  return { store, fetchMock };
}

test('shows the empty state when the playlist has no tracks', async () => {
  renderApp();

  expect(await screen.findByText('No tracks found')).toBeInTheDocument();
  expect(screen.getByText('Playlist 1')).toBeInTheDocument();
});

test('fetches the stream for whichever track the store selected', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.99);
  const { store, fetchMock } = renderApp({ tracks, currentIndex: 0, shuffle: true });

  await screen.findByText('Track 1');
  await userEvent.click(screen.getByRole('button', { name: 'Next track' }));

  const selected = store.getState().playlist.currentIndex;

  expect(selected).not.toBe(0);
  await waitFor(() =>
    expect(fetchMock).toHaveBeenCalledWith(`http://localhost/api/1/${tracks[selected].id}`)
  );
});
