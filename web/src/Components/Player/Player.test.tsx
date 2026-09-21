// ABOUTME: Tests for the player's shuffle and repeat toggles.
// ABOUTME: Covers their pressed state and repeat's effect on the audio element.
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { expect, test, vi } from 'vitest';
import Player from './index';
import playlistReducer from '../../reducers/playlistReducer';
import feedbackReducer from '../../reducers/feedbackReducer';
import { PlaylistState } from '../../interfaces';

function renderPlayer(playlist: Partial<PlaylistState> = {}) {
  const store = configureStore({
    reducer: { playlist: playlistReducer, feedback: feedbackReducer },
    preloadedState: {
      playlist: { ...playlistReducer(undefined, { type: '@@INIT' }), ...playlist }
    }
  });

  const { container } = render(
    <Provider store={store}>
      <Player
        id={1}
        title="I Like Killing Flies"
        artist="Jebediah Springfield"
        page_url="https://example.test/track"
        stream_url="https://example.test/stream.m4a"
        streamUrl="https://example.test/stream.m4a"
        handleOnNext={vi.fn()}
        handleOnPrev={vi.fn()}
      />
    </Provider>
  );

  return { store, container };
}

test('offers shuffle and repeat, both off to start', () => {
  renderPlayer();

  expect(screen.getByRole('button', { name: 'Shuffle' })).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByRole('button', { name: 'Repeat' })).toHaveAttribute('aria-pressed', 'false');
});

test('turns shuffle on when pressed, leaving repeat alone', async () => {
  const { store } = renderPlayer();

  await userEvent.click(screen.getByRole('button', { name: 'Shuffle' }));

  expect(store.getState().playlist.shuffle).toBe(true);
  expect(store.getState().playlist.repeat).toBe(false);
  expect(screen.getByRole('button', { name: 'Shuffle' })).toHaveAttribute('aria-pressed', 'true');
});

test('turns repeat on when pressed', async () => {
  const { store } = renderPlayer();

  await userEvent.click(screen.getByRole('button', { name: 'Repeat' }));

  expect(store.getState().playlist.repeat).toBe(true);
  expect(screen.getByRole('button', { name: 'Repeat' })).toHaveAttribute('aria-pressed', 'true');
});

test('loops the audio only while repeat is on', () => {
  expect(renderPlayer().container.querySelector('audio')).not.toHaveAttribute('loop');
  expect(renderPlayer({ repeat: true }).container.querySelector('audio')).toHaveAttribute('loop');
});
