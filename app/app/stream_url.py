# ABOUTME: Works out how long a resolved stream URL stays usable.
# ABOUTME: All times are naive UTC, matching what the tracks table stores.
from datetime import datetime, timedelta, timezone
from urllib.parse import parse_qs, urlparse

# How long to trust a URL that carries no expiry of its own.
DEFAULT_TTL = timedelta(hours=1)

# Refresh a signed URL before it actually lapses, so playback never starts on a dead link.
SAFETY_MARGIN = timedelta(minutes=5)


def expires_at(url, now):
    """Return when a stream URL should stop being trusted."""

    signed = signed_expiry(url)

    if signed is not None:
        return signed - SAFETY_MARGIN

    return now + DEFAULT_TTL


def signed_expiry(url):
    """Return the expiry YouTube signs into a stream URL, or None if there isn't one."""

    expire = parse_qs(urlparse(url).query).get('expire')

    if not expire:
        return None

    try:
        return datetime.fromtimestamp(int(expire[0]), timezone.utc).replace(tzinfo=None)
    except (ValueError, OverflowError, OSError):
        return None
