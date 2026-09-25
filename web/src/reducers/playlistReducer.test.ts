// ABOUTME: Tests for the playlist slice's handling of tracks being added.
// ABOUTME: Covers the placeholder that stands in for a track while it resolves.
import { describe, expect, test } from 'vitest';
import reducer from './playlistReducer';
import { ADD_TRACK } from '../actions/playlistActions';
import { nextTrack, toggleRepeat, toggleShuffle } from './playlistReducer';
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

describe('shuffle and repeat', () => {
  const threeTracks = [
    { ...resolved, id: 1 },
    { ...resolved, id: 2 },
    { ...resolved, id: 3 }
  ];

  function playing(index: number, overrides: Partial<PlaylistState> = {}) {
    return { ...initialState(), tracks: threeTracks, currentIndex: index, ...overrides };
  }

  test('both start off', () => {
    expect(initialState().shuffle).toBe(false);
    expect(initialState().repeat).toBe(false);
  });

  test('each toggles independently', () => {
    const shuffled = reducer(initialState(), toggleShuffle());

    expect(shuffled.shuffle).toBe(true);
    expect(shuffled.repeat).toBe(false);
    expect(reducer(shuffled, toggleRepeat()).shuffle).toBe(true);
    expect(reducer(shuffled, toggleShuffle()).shuffle).toBe(false);
  });

  test('advances in order and wraps when shuffle is off', () => {
    expect(reducer(playing(0), nextTrack()).currentIndex).toBe(1);
    expect(reducer(playing(2), nextTrack()).currentIndex).toBe(0);
  });

  test('never picks the track already playing when shuffle is on', () => {
    const state = playing(1, { shuffle: true });

    for (const roll of [0, 0.34, 0.5, 0.99]) {
      const next = reducer(state, nextTrack(roll)).currentIndex;

      expect(next).not.toBe(1);
      expect(next).toBeGreaterThanOrEqual(0);
      expect(next).toBeLessThan(threeTracks.length);
    }
  });

  test('reaches every other track across the range of rolls', () => {
    const state = playing(0, { shuffle: true });
    const picked = [0, 0.99].map((roll) => reducer(state, nextTrack(roll)).currentIndex);

    expect(new Set(picked)).toEqual(new Set([1, 2]));
  });

  test('stays put when shuffling a single track playlist', () => {
    const state = { ...initialState(), tracks: [threeTracks[0]], currentIndex: 0, shuffle: true };

    expect(reducer(state, nextTrack(0.99)).currentIndex).toBe(0);
  });
});
