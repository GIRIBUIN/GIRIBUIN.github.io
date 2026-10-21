## Background

As ChatGPT conversations accumulate, finding an earlier chat or organizing related topics becomes difficult. I built Convoary to manage conversations like files in an Explorer-style window and open them in the original service when needed.

This personal project currently supports ChatGPT. It manages titles, links, folders, colors, and favorites in a separate window while leaving source conversations unchanged.

## Main features

- Organize conversations with nested folders, favorites, and colors; find them through search, filters, and sorting.
- Work with multiple items using multi-selection, drag and drop, inline rename, and keyboard shortcuts.
- Import conversations from the visible sidebar, the current chat, or open tabs.
- Import and export workspace and theme JSON, with local backups.
- Optionally sync encrypted organization data across browsers and devices through the user's own Dropbox account.

## Implementation and design decisions

The Explorer UI uses TypeScript and React. WebExtensions APIs connect the separate window, browser tabs, and local storage. Content scripts read the source website, the background coordinates imports, and separate modules handle the UI, folder and conversation models, storage, and sync. Vite produces Chromium and Firefox builds.

Organization data saves to extension local storage first. Renaming or moving an item does not alter the original ChatGPT conversation, and conversation bodies are excluded from sync. Imported JSON and stored state are validated, with original-data backups during recovery and migration.

Dropbox sync is optional and connects directly to the user's account without a required sync server. OAuth PKCE authorizes access, while Web Crypto encrypts workspace metadata, the theme, and selected preferences on-device using AES-GCM-256. The Sync Key is kept out of Dropbox and must be entered on other devices.

Revision-conditional writes prevent stale data from overwriting the remote file. Remote changes are validated and backed up locally before application; conflicting edits on both sides require a user choice. Network and authentication failures preserve local data and pending changes.

## Current status and limitations

A v0.1 alpha is available for Chrome, Edge, Firefox, and Zen. Installation currently requires loading an extracted release rather than installing from an extension store. Unsigned temporary installations in Firefox and Zen last until the browser restarts. Convoary is an independent project and is not affiliated with OpenAI.

Imports depend on ChatGPT's interface and may not discover every conversation. Dropbox authorization requests Full Dropbox access; limiting operations to the dedicated sync file is enforced by application code. A lost Sync Key cannot be recovered from Dropbox.

The project includes Vitest unit tests and Playwright browser verification scripts. Automated checks use synthetic data and mocked API responses, so they are separate from real-account OAuth and cross-device sync verification.
