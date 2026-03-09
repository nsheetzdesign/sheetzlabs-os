# Sheetz Labs OS - Desktop App

Native macOS desktop app for Sheetz Labs OS.

## Features

- **Native wrapper** pointing to app.sheetzlabs.com
- **Menu bar icon** with quick access to key features
- **Global shortcuts:**
  - `⌘+Shift+K` — Open command palette
  - `⌘+Shift+N` — Quick capture
- **Auto-launch** on login (optional)
- **Native notifications** from AI agents
- **Stays in tray** when closed (click tray icon to reopen)

## Development

```bash
# Prerequisites
# - Rust (brew install rust)
# - Xcode Command Line Tools (xcode-select --install)

# Install Tauri CLI
pnpm install

# Run in dev mode (loads app.sheetzlabs.com)
pnpm dev

# Build for distribution (universal binary)
pnpm build:universal
```

## Distribution

Output: `src-tauri/target/universal-apple-darwin/release/bundle/dmg/`

Currently distributed as direct download. App Store submission planned alongside iOS release.

## Icons

Icons are in `src-tauri/icons/`. To regenerate from a new source image:

```bash
# Place your 1024x1024 source PNG as src-tauri/icons/icon.png
# Then run:
python3 scripts/gen-icons.py
```
