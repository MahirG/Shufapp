# Shuf

Shuf is an interactive social entertainment app that turns matchmaking and audience-panel formats into polished, playable experiences.

## Experiences

- **Pop the Balloon** — eliminate five hidden personalities and reveal the final match.
- **Blind Match** — answer four instinctive questions and receive a compatibility result.
- **The Panel** — judge five date stories and discover your panel personality.
- **Messages** — local-first conversations with search, unread states, reactions, emoji, attachments, voice notes, call overlays and conversation controls.
- **Discover** — search people, follow profiles, filter personalities and join community topics.
- **Progression** — earn Shuf points, build streaks and unlock achievements.

## Interaction coverage

Every visible control is connected to a real frontend behavior: navigation, game state, search, filters, polls, likes, sharing, following, bookmarks, notifications, settings, achievements, messaging or persisted preferences.

The current chat implementation is local-first and persists in the browser through `localStorage`. It is ready to be connected to a realtime database and authentication layer for production multi-user messaging.

## Stack

- Next.js App Router
- React + TypeScript
- Motion for React
- Lucide icons
- Responsive CSS with mobile bottom navigation and desktop app shell

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validate

```bash
npm run lint
npm run build
```
