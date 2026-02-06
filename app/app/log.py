import logging
import sys

log = logging.getLogger(__name__)
handler = logging.StreamHandler(sys.stdout)
log.addHandler(handler)
log.setLevel(logging.DEBUG)
