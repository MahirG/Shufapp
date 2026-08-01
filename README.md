# Shuf

**Shuf — Ethiopia's place to talk, connect and belong.**

Shuf is a multilingual Ethiopian social network built around community Circles, creator discovery, local conversations, modern messaging and interactive entertainment.

## Social platform

- **Home feed** — multilingual posts from followed creators and joined Circles.
- **Shuf Circles** — city, campus, career, culture, sport, business and diaspora communities.
- **Create** — text, compressed photo, voice, poll, event and protected anonymous posts.
- **Local reactions** — Betam, Awo, Respect, Funny, Interesting and Disagree.
- **Comments** — conversations with threaded replies and per-comment reactions.
- **Language controls** — Amharic, Afaan Oromo, Tigrinya and English feed filtering.
- **Low Data Mode** — pauses large media and reduces visual effects.
- **Trust tools** — report, mute and block actions plus community moderators and rules.
- **Creator discovery** — follow verified people and open direct conversations.
- **Post-to-chat sharing** — send a public post directly into Shuf messaging.

## Interactive entertainment

- **Pop the Balloon** — eliminate five hidden personalities and reveal the final match.
- **Blind Match** — answer four instinctive questions and receive a compatibility result.
- **The Panel** — judge five date stories and discover your panel personality.

These experiences remain opt-in social entertainment and can be shared into the wider Shuf feed and messaging system.

## Messaging

The current chat experience includes conversation search, unread states, reactions, emoji, attachments, voice notes, call overlays, pin/mute controls and local browser persistence.

## Stack

- Next.js App Router
- React and TypeScript
- Motion for React
- Lucide icons
- Responsive CSS with desktop and mobile app shells
- Local-first persistence through `localStorage`

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

The frontend is structured so authentication, realtime messaging, media storage, moderation queues and production database services can be connected without rebuilding the interface architecture.
