"""Constants for Scorebugs."""

from __future__ import annotations

DOMAIN = "scorebugs"
NAME = "Scorebugs"

# The plug other code (the card, Glass Panes) calls: kit.js `mount(root, host, opts)`. Changes only when the plug changes.
API = 1

# The browser files (kit.js, card.js, bugs/, fonts/, catalogue.json) are served from here, without a login: code and fonts only.
URL_BASE = f"/{DOMAIN}/frontend"
CARD_URL = f"{URL_BASE}/card.js"
