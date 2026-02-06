import { TrackProps } from '../interfaces';

const BASE_URL = import.meta.env.DEV ? 'http://localhost' : '';
const API_URL = `${BASE_URL}/api`;

async function assertOk(response: Response) {
  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message);
  }
}

export async function getPlaylist(id: string): Promise<TrackProps[]> {
  const response = await fetch(`${API_URL}/${id}`);
  
  await assertOk(response);
  return response.json();
}

export async function getTrack(playlist_id: string, track_id: number): Promise<TrackProps> {
  const response = await fetch(`${API_URL}/${playlist_id}/${track_id}`);
  
  await assertOk(response);
  return response.json();
}

export async function addTrack(playlist_id: string, page_url: string): Promise<TrackProps[]> {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page_url: page_url })
  };
  const response = await fetch(`${API_URL}/${playlist_id}`, options);
  
  await assertOk(response);
  return response.json();
}

export async function deleteTrack(playlist_id: string, track_id: number): Promise<TrackProps[]> {
  const options = {
    method: 'DELETE',
  };
  const response = await fetch(`${API_URL}/${playlist_id}/${track_id}`, options);
  
  await assertOk(response);
  return response.json();
}

export async function getNextPlaylistId(): Promise<string> {
  const response = await fetch(`${API_URL}/newplaylist/`);
  
  await assertOk(response);
  return response.json();
} 