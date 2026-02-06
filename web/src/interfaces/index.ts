export interface TrackProps {
  id: number;
  title: string;
  artist?: string;
  page_url: string;
  stream_url: string;
}

export interface PlaylistState {
  playlistId: string;
  nextPlaylistId: string;
  streamUrl: string;
  currentIndex: number;
  tracks: TrackProps[];
  playlistLoading: boolean;
  fetchTrackLoading: boolean;
  addTrackLoading: boolean;
}

export interface MenuProps {
  nextPlaylistId: string;
  onSubmit: (page_url: string) => void;
}

export interface PlayerProps extends TrackProps {
  streamUrl: string;
  handleOnNext: () => void;
  handleOnPrev: () => void;
}

export interface PlaylistProps {
  playlistId: string;
  tracks: TrackProps[];
  playTrack: (track_index: number) => void;
  deleteTrack: (track_id: number) => void;
}

export interface TrackComponentProps {
  isLoading: boolean;
  isPlaying: boolean;
  index: number;
  track: TrackProps;
  handleOnClick: () => void;
  handleOnDelete: () => void;
}

export interface ConfirmationDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ApiResponse {
  ok: boolean;
  json: () => Promise<any>;
} 