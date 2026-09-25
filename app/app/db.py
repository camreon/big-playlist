from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError

from app.log import log
from app.stream_url import expires_at


db = SQLAlchemy()


class Playlist(db.Model):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key=True)

    @staticmethod
    def add():
        playlist = Playlist()

        try:
            db.session.add(playlist)
            db.session.commit()
            return playlist.id
        except SQLAlchemyError as e:
            log.error("Error adding playlist -- %s" % str(e))

    @staticmethod
    def delete(id):
        try:
            db.session.delete(Playlist(id))
            db.session.commit()
        except SQLAlchemyError as e:
            log.error("Error deleting playlist -- %s" % str(e))

    @staticmethod
    def getTracks(playlist_id):
        return Track.query.filter_by(playlist_id=playlist_id).all()


class Track(db.Model):
    __tablename__ = 'tracks'

    id = db.Column(db.Integer, primary_key=True)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'))
    stream_url = db.Column(db.String())
    title = db.Column(db.String())
    artist = db.Column(db.String())
    page_url = db.Column(db.String())
    stream_url_expires_at = db.Column(db.DateTime())

    def __init__(self, stream_url, title, artist, page_url, playlist_id):
        self.title = title
        self.artist = artist
        self.page_url = page_url
        self.playlist_id = playlist_id
        self.set_stream_url(stream_url)

    def set_stream_url(self, url):
        """Store a freshly resolved stream URL alongside when it stops being usable."""

        self.stream_url = url
        self.stream_url_expires_at = expires_at(url, datetime.utcnow())

    def stream_url_is_fresh(self):
        """Whether the stored stream URL can still be handed to a player."""

        if not self.stream_url or not self.stream_url_expires_at:
            return False

        return self.stream_url_expires_at > datetime.utcnow()

    def __repr__(self):
        return '{}'.format(self.id)

    def to_json(self):
        return dict(
            id=self.id,
            stream_url=self.stream_url,
            title=self.title,
            artist=self.artist,
            page_url=self.page_url
        )

    @staticmethod
    def from_dict(track_dict):
        track = Track(
            title=track_dict.get('title'),
            artist=track_dict.get('artist'),
            page_url=track_dict.get('webpage_url'),
            stream_url=track_dict.get('url'),
            playlist_id=track_dict.get('playlist_id')
        )

        return track

    @staticmethod
    def add(track):
        try:
            db.session.add(track)
            db.session.commit()
            return track.id
        except SQLAlchemyError as e:
            log.error("Error adding track -- %s" % str(e))

    @staticmethod
    def delete(track):
        try:
            db.session.delete(track)
            db.session.commit()
        except SQLAlchemyError as e:
            log.error("Error deleting track -- %s" % str(e))

    @staticmethod
    def get(id):
        return Track.query.filter_by(id=id).first_or_404()
