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
  const { container } = render(<Track {...props} />);
  return { ...props, container };
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

test('keeps the inline actions for wide screens only', () => {
  const { container } = renderTrack();

  const inline = container.querySelector('.inline-actions');

  expect(inline).toHaveClass('hidden', 'md:flex');
});

test('offers a narrow screen menu holding the same actions', async () => {
  renderTrack();

  const menuButton = screen.getByRole('button', { name: 'Track actions' });

  expect(menuButton.parentElement).toHaveClass('md:hidden');
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();

  await userEvent.click(menuButton);

  expect(screen.getByRole('menuitem', { name: 'Open source' })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
});

test('opening the menu does not start playing the track', async () => {
  const props = renderTrack();

  await userEvent.click(screen.getByRole('button', { name: 'Track actions' }));

  expect(props.handleOnClick).not.toHaveBeenCalled();
});

test('deleting from the menu closes it without starting playback', async () => {
  const props = renderTrack();

  await userEvent.click(screen.getByRole('button', { name: 'Track actions' }));
  await userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

  expect(props.handleOnDelete).toHaveBeenCalledOnce();
  expect(props.handleOnClick).not.toHaveBeenCalled();
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});

test('closes the menu when clicking elsewhere', async () => {
  renderTrack();

  await userEvent.click(screen.getByRole('button', { name: 'Track actions' }));
  expect(screen.getByRole('menu')).toBeInTheDocument();

  await userEvent.click(document.body);

  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});
