from flask import (
    abort, Blueprint, flash, jsonify, request, render_template, redirect
)
from app.db import db, Track, Playlist
from app.log import log
from app.errors import JsonException
from app.stream_service import StreamService


bp = Blueprint("index", __name__, url_prefix='/api')


@bp.route('/<int:id>/<int:track_id>')
def get_track_info(id, track_id, stream_service: StreamService):
    """Return a track, re-resolving its stream URL only once the stored one has expired."""

    track = Track.get(track_id)

    if track.stream_url_is_fresh():
        return jsonify(track.to_json())

    try:
        tracks = stream_service.extract_info(track.page_url)
    except Exception as error:
        abort(400, error)

    resolved = tracks[0]

    track.title = resolved.get('title')
    track.artist = resolved.get('artist')
    track.set_stream_url(resolved.get('url', track.page_url))

    db.session.commit()

    log.info('REFRESHED stream url for track {0}'.format(track.id))

    return jsonify(track.to_json())


@bp.route('/', methods=['GET'])
@bp.route('/<int:id>', methods=['GET'])
def get_playlist_tracks(id=1):

    tracks = Playlist.getTracks(id)

    log.info('{} track(s) found.'.format(len(tracks)))

    if len(tracks) == 0:
        flash('Looks like you haven\'t added any tracks yet. Try this one:')

    json_tracks = [t.to_json() for t in tracks]

    return jsonify(json_tracks)


@bp.route('/newplaylist/')
def get_next_playlist_id():
    """Return next available playlist id"""
    return jsonify(Playlist.query.count() + 1)


@bp.route('/', methods=['POST'])
@bp.route('/<int:id>', methods=['POST'])
def add(stream_service: StreamService, id=1):
    """Get track info from a URL and add it to the playlist."""

    data = request.get_json()

    if not isinstance(data, dict) or not (data.get('page_url') or '').strip():
        abort(400, 'A page_url is required.')

    url = data['page_url'].strip()

    try:
        tracks = stream_service.extract_info(url)
    except Exception as error:
        abort(400, error)

    # create playlist when the first track is added
    if len(Playlist.getTracks(id)) == 0:
        Playlist.add()
        log.info('ADDED playlist {0}'.format(id))

    added_tracks = []

    for t in tracks:
        # print('Adding new track: ', json.dumps(t, indent=4, sort_keys=True))
        new_track = Track(
            title=t.get('title'),
            artist=t.get('artist'),
            page_url=url,
            stream_url=t.get('url', url),
            playlist_id=id
        )

        new_id = Track.add(new_track)
        new_track.id = new_id
        added_tracks.append(new_track)

        log.info('ADDED track: {0} (id: {1})'.format(new_track.title, new_track.id))

    return jsonify([t.to_json() for t in added_tracks])


@bp.route('/<int:id>/<int:track_id>', methods=['DELETE'])
def delete(id=None, track_id=None):
    """Delete a track by ID."""

    track = Track.get(track_id)
    Track.delete(track)

    log.info('DELETED: {0} - {1}'.format(track.title, track.page_url))

    return jsonify(track.to_json())


@bp.app_errorhandler(400)
def custom400(error):
    log.error(error)

    #TODO: want both the youtube-dl error and url here
    description = error.description

    if isinstance(description, Exception) and description.args:
        message = description.args[0]
    else:
        message = str(description)

    json_exception = JsonException(message)

    response = jsonify(json_exception.to_dict())
    response.status_code = json_exception.status_code

    return response
