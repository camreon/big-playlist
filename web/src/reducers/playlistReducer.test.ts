// ABOUTME: Tests for the playlist slice's handling of tracks being added.
// ABOUTME: Covers the placeholder that stands in for a track while it resolves.
import { describe, expect, test } from 'vitest';
import reducer from './playlistReducer';
import { ADD_TRACK } from '../actions/playlistActions';
import { PlaylistState, TrackProps } from '../interfaces';

const PAGE_URL = 'https://jebediahspringfield.bandcamp.com/track/i-like-killing-flies-2';

const resolved: TrackProps = {
  id: 1,
  title: 'I Like Killing Flies',
  artist: 'Jebediah Springfield',
  page_url: PAGE_URL,
  stream_url: 'https://example.test/stream.m4a'
};

function initialState(): PlaylistState {
  return reducer(undefined, { type: '@@INIT' });
}

const arg = { playlistId: '1', pageUrl: PAGE_URL };

describe('adding a track', () => {
  test('shows the url as pending before the server answers', () => {
    const state = reducer(initialState(), ADD_TRACK.pending('req-1', arg));

    expect(state.pendingTrackUrls).toEqual([PAGE_URL]);
    expect(state.addTrackLoading).toBe(true);
  });

  test('replaces the pending url with the resolved tracks', () => {
    const pending = reducer(initialState(), ADD_TRACK.pending('req-1', arg));
    const state = reducer(pending, ADD_TRACK.fulfilled([resolved], 'req-1', arg));

    expect(state.pendingTrackUrls).toEqual([]);
    expect(state.tracks).toEqual([resolved]);
  });

  test('drops the pending url when the add fails', () => {
    const pending = reducer(initialState(), ADD_TRACK.pending('req-1', arg));
    const state = reducer(pending, ADD_TRACK.rejected(new Error('nope'), 'req-1', arg));

    expect(state.pendingTrackUrls).toEqual([]);
    expect(state.tracks).toEqual([]);
  });

  test('keeps pending urls separate when two are added at once', () => {
    const other = { playlistId: '1', pageUrl: 'https://example.test/other' };

    let state = reducer(initialState(), ADD_TRACK.pending('req-1', arg));
    state = reducer(state, ADD_TRACK.pending('req-2', other));
    state = reducer(state, ADD_TRACK.fulfilled([resolved], 'req-1', arg));

    expect(state.pendingTrackUrls).toEqual([other.pageUrl]);
  });
});
