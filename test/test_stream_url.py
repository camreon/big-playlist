# ABOUTME: Tests for working out when a resolved stream URL stops being usable.
# ABOUTME: Covers signed YouTube URLs and sources that carry no expiry at all.
from datetime import datetime, timedelta

from app.stream_url import DEFAULT_TTL, SAFETY_MARGIN, expires_at

NOW = datetime(2026, 9, 21, 12, 0, 0)
SIGNED = 'https://rr7---sn-bvv.googlevideo.com/videoplayback?expire=1790041868&itag=140&mime=audio%2Fmp4'


def test_uses_the_expiry_youtube_signed_into_the_url():
    # 1790041868 is 2026-09-22 01:51:08 UTC
    expected = datetime(2026, 9, 22, 1, 51, 8) - SAFETY_MARGIN

    assert expires_at(SIGNED, NOW) == expected


def test_leaves_a_safety_margin_before_the_signed_expiry():
    assert expires_at(SIGNED, NOW) < datetime(2026, 9, 22, 1, 51, 8)


def test_falls_back_to_a_default_when_the_url_is_not_signed():
    assert expires_at('https://bandcamp.example/track/stream.mp3', NOW) == NOW + DEFAULT_TTL


def test_falls_back_when_the_expiry_is_not_a_timestamp():
    assert expires_at('https://x.example/v?expire=whenever', NOW) == NOW + DEFAULT_TTL


def test_falls_back_when_the_expiry_is_out_of_range():
    assert expires_at('https://x.example/v?expire=999999999999999', NOW) == NOW + DEFAULT_TTL


def test_default_is_short_enough_to_be_safe():
    assert DEFAULT_TTL <= timedelta(hours=1)
