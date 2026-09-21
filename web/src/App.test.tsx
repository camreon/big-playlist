// ABOUTME: Smoke test for the App shell, covering the empty playlist state.
// ABOUTME: Stubs fetch at the network boundary so no real API is called.
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, test, vi } from 'vitest';
import App from './App';
import { store } from './store';

function renderApp() {
  return render(
    <Provider store={store}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    </Provider>
  );
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => ({
    ok: true,
    json: async () => (url.endsWith('/newplaylist/') ? '2' : [])
  })));
});

test('shows the empty state when the playlist has no tracks', async () => {
  renderApp();

  expect(await screen.findByText('No tracks found')).toBeInTheDocument();
  expect(screen.getByText('Playlist 1')).toBeInTheDocument();
});
