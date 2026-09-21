// ABOUTME: Tests for the track row's open-source and delete controls.
// ABOUTME: Covers their hit area and that they don't start playback when clicked.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { Track } from './index';
import { TrackProps } from '../../../interfaces';

const track: TrackProps = {
  id: 7,
  title: 'I Like Killing Flies',
  artist: 'Jebediah Springfield',
  page_url: 'https://jebediahspringfield.bandcamp.com/track/i-like-killing-flies-2',
  stream_url: 'https://example.test/stream.m4a'
};

function renderTrack(overrides = {}) {
  const props = {
    isLoading: false,
    isPlaying: false,
    index: 0,
    track,
    handleOnClick: vi.fn(),
    handleOnDelete: vi.fn(),
    ...overrides
  };
  render(<Track {...props} />);
  return props;
}

test('gives both row actions a touch-sized hit area', () => {
  renderTrack();

  const source = screen.getByTitle('Open source');
  const remove = screen.getByTitle(`Delete ${track.title}`);

  expect(source).toHaveClass('action-button');
  expect(remove).toHaveClass('action-button');
  expect(source.querySelector('svg')).toHaveClass('w-6', 'h-6');
  expect(remove.querySelector('svg')).toHaveClass('w-6', 'h-6');
});

test('deleting a track does not also start playing it', async () => {
  const props = renderTrack();

  await userEvent.click(screen.getByTitle(`Delete ${track.title}`));

  expect(props.handleOnDelete).toHaveBeenCalledOnce();
  expect(props.handleOnClick).not.toHaveBeenCalled();
});

test('opening the source does not also start playing the track', async () => {
  const props = renderTrack();

  await userEvent.click(screen.getByTitle('Open source'));

  expect(props.handleOnClick).not.toHaveBeenCalled();
});
