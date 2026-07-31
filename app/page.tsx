"use client";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Compass,
  Crown,
  Flame,
  Gamepad2,
  Heart,
  Home,
  Info,
  Laugh,
  Menu,
  MessageCircleHeart,
  MoonStar,
  PartyPopper,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Swords,
  Target,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  Users,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";

type View = "home" | "play" | "discover" | "activity" | "profile";
type Game = "balloon" | "blind" | "panel" | null;
type Flag = "green" | "red" | "wild";

type Suitor = {
  name: string;
  age: number;
  job: string;
  trait: string;
  bio: string;
  flag: Flag;
  interests: string[];
  initials: string;
};

const navItems: { id: View; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "play", label: "Play", icon: Gamepad2 },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "profile", label: "Profile", icon: CircleUserRound },
];

const suitors: Suitor[] = [
  {
    name: "Nardos",
    age: 26,
    job: "Creative strategist",
    trait: "Sings karaoke every Friday. No exceptions.",
    bio: "Creative by day, karaoke legend by night. She says yes to spontaneous road trips and remembers every tiny detail.",
    flag: "green",
    interests: ["Music", "Road trips", "Design"],
    initials: "NA",
  },
  {
    name: "Samuel",
    age: 29,
    job: "Architect",
    trait: "Still has his ex's cat saved as “Home.”",
    bio: "Thoughtful and quietly funny, with a complicated cat-custody story the panel absolutely wants explained.",
    flag: "red",
    interests: ["Architecture", "Cats", "Coffee"],
    initials: "SA",
  },
  {
    name: "Betelhem",
    age: 27,
    job: "Founder",
    trait: "Plans every date two weeks in advance.",
    bio: "Reliable, ambitious and always early. She is building a local wellness brand and loves an intentional plan.",
    flag: "green",
    interests: ["Wellness", "Business", "Books"],
    initials: "BE",
  },
  {
    name: "Yonas",
    age: 31,
    job: "Civil engineer",
    trait: "Double-texts after exactly ninety seconds.",
    bio: "Warm, direct and a little intense about response times. He can design a bridge but cannot tolerate a read receipt.",
    flag: "red",
    interests: ["Football", "Travel", "Tech"],
    initials: "YO",
  },
  {
    name: "Selam",
    age: 25,
    job: "Food creator",
    trait: "Once drove three hours for one specific plate of injera.",
    bio: "A loyal foodie with a camera roll full of hidden restaurants. She will plan the entire evening and the backup plan.",
    flag: "green",
    interests: ["Food", "Culture", "Photography"],
    initials: "SE",
  },
  {
    name: "Dawit",
    age: 30,
    job: "Product manager",
    trait: "Brings up his ex in the first ten minutes.",
    bio: "Funny, ambitious and self-aware enough to admit he is still learning how to leave the past in the past.",
    flag: "red",
    interests: ["Startups", "Cinema", "Running"],
    initials: "DA",
  },
  {
    name: "Ruth",
    age: 28,
    job: "Lawyer",
    trait: "Has a five-year plan and a backup five-year plan.",
    bio: "Grounded, decisive and calm under pressure. She values a partner who can keep up without turning life into a race.",
    flag: "wild",
    interests: ["Policy", "Pilates", "Travel"],
    initials: "RU",
  },
  {
    name: "Amanuel",
    age: 32,
    job: "Film editor",
    trait: "Considers “maybe” a complete answer.",
    bio: "Laid-back to a fault. The panel cannot decide whether it is emotional intelligence or elite-level avoidance.",
    flag: "wild",
    interests: ["Film", "Jazz", "Cooking"],
    initials: "AM",
  },
  {
    name: "Hana",
    age: 26,
    job: "UX designer",
    trait: "Plans every date around a rooftop sunset.",
    bio: "A hopeful romantic who remembers your coffee order forever and has a playlist for every possible mood.",
    flag: "green",
    interests: ["Design", "Music", "Sunsets"],
    initials: "HA",
  },
  {
    name: "Mikiyas",
    age: 29,
    job: "Consultant",
    trait: "Answers “what are you looking for?” with a shrug.",
    bio: "Effortlessly charming in the room and suspiciously vague about almost everything outside it.",
    flag: "red",
    interests: ["Fitness", "Travel", "Finance"],
    initials: "MI",
  },
  {
    name: "Liya",
    age: 27,
    job: "Photographer",
    trait: "Has a group chat dedicated to vetting her dates.",
    bio: "Loyal to her people and slow to trust. Her friends say the committee is strict because the prize is worth it.",
    flag: "wild",
    interests: ["Photography", "Art", "Hiking"],
    initials: "LI",
  },
  {
    name: "Elias",
    age: 33,
    job: "Doctor",
    trait: "Shows up fifteen minutes early to everything.",
    bio: "Reliable, composed and a little rigid. The panel calls him the safe pick—and means it as a compliment.",
    flag: "wild",
    interests: ["Medicine", "Chess", "Running"],
    initials: "EL",
  },
];

const blindQuestions = [
  {
    question: "Your perfect Friday night?",
    eyebrow: "Set the energy",
    options: [
      { label: "Dinner and a long conversation", icon: MessageCircleHeart },
      { label: "A lively night out with friends", icon: PartyPopper },
      { label: "A quiet movie and great food", icon: MoonStar },
      { label: "No plan—let the night decide", icon: WandSparkles },
    ],
  },
  {
    question: "What matters most at first?",
    eyebrow: "Choose your signal",
    options: [
      { label: "Emotional maturity", icon: ShieldCheck },
      { label: "Ambition and direction", icon: Target },
      { label: "Humor and easy chemistry", icon: Laugh },
      { label: "Shared values", icon: Heart },
    ],
  },
  {
    question: "Pick your dealbreaker",
    eyebrow: "Draw a boundary",
    options: [
      { label: "Poor communication", icon: MessageCircleHeart },
      { label: "No personal ambition", icon: Trophy },
      { label: "Always running late", icon: Clock3 },
      { label: "Jealous or controlling", icon: Swords },
    ],
  },
  {
    question: "Your ideal first date?",
    eyebrow: "Make it real",
    options: [
      { label: "Coffee and a long walk", icon: Compass },
      { label: "A polished dinner", icon: Star },
      { label: "Games and playful competition", icon: Gamepad2 },
      { label: "A new place neither knows", icon: Sparkles },
    ],
  },
];

const stories = [
  {
    name: "Betty",
    role: "Third date",
    initials: "BT",
    story:
      "He planned a city-wide scavenger hunt that ended at his favorite restaurant. It was thoughtful, but I was exhausted before we even ordered.",
    stat: "63% of viewers called it romantic",
  },
  {
    name: "Robel",
    role: "First date",
    initials: "RO",
    story:
      "She arrived forty minutes late without an explanation, then opened a calculator to split every item on the bill down to the cent.",
    stat: "71% of viewers voted harsh",
  },
  {
    name: "Fasika",
    role: "Second date",
    initials: "FA",
    story:
      "He brought his mother’s homemade dabo as a gift and spent the whole evening asking thoughtful questions without checking his phone once.",
    stat: "86% of viewers loved it",
  },
  {
    name: "Nathan",
    role: "First date",
    initials: "NT",
    story:
      "She stayed on the phone with her sister for most of the date, then put me on speaker so the sister could ‘vet’ me in real time.",
    stat: "92% of viewers said run",
  },
  {
    name: "Meaza",
    role: "Blind date",
    initials: "ME",
    story:
      "He admitted five minutes in that he only came because his friends dared him. Then he stayed for three hours and asked for another date.",
    stat: "The audience was perfectly split",
  },
];

const activityFeed = [
  { icon: Trophy, title: "New panel rank", text: "You reached Sharp Observer", time: "12 min", tone: "gold" },
  { icon: Heart, title: "Compatibility saved", text: "Your 91% match with Hana", time: "2 hr", tone: "pink" },
  { icon: Flame, title: "Streak extended", text: "You played three days in a row", time: "Yesterday", tone: "orange" },
  { icon: Users, title: "Community result", text: "8,412 players judged the same story", time: "Yesterday", tone: "violet" },
];

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function Avatar({ initials, size = "md", accent = 0 }: { initials: string; size?: "sm" | "md" | "lg" | "xl"; accent?: number }) {
  return <div className={cn("avatar", `avatar-${size}`, `accent-${accent % 6}`)}>{initials}</div>;
}

function Logo() {
  return (
    <div className="brand-mark" aria-label="Shuf">
      <span>S</span>
      <i />
    </div>
  );
}

function Pill({ children, icon: Icon }: { children: React.ReactNode; icon?: typeof Sparkles }) {
  return (
    <span className="pill">
      {Icon ? <Icon size={13} strokeWidth={2.2} /> : null}
      {children}
    </span>
  );
}

function AppHeader({
  view,
  game,
  onBack,
  onMenu,
}: {
  view: View;
  game: Game;
  onBack: () => void;
  onMenu: () => void;
}) {
  const title = game
    ? game === "balloon"
      ? "Pop the Balloon"
      : game === "blind"
        ? "Blind Match"
        : "The Panel"
    : view === "home"
      ? "Tonight on Shuf"
      : navItems.find((item) => item.id === view)?.label;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button mobile-only" onClick={game ? onBack : onMenu} aria-label={game ? "Go back" : "Open menu"}>
          {game ? <ArrowLeft size={20} /> : <Menu size={20} />}
        </button>
        <div className="desktop-brand desktop-only">
          <Logo />
          <span>SHUF</span>
        </div>
        <div>
          <p className="topbar-kicker">{game ? "Interactive mode" : "Saturday, August 1"}</p>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="topbar-actions">
        <div className="desktop-only search-field">
          <Search size={17} />
          <span>Search Shuf</span>
          <kbd>⌘ K</kbd>
        </div>
        <button className="icon-button" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>
        <Avatar initials="MA" size="sm" accent={4} />
      </div>
    </header>
  );
}

function Sidebar({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  return (
    <aside className="sidebar desktop-only">
      <div className="sidebar-logo">
        <Logo />
        <div>
          <strong>SHUF</strong>
          <span>Play the show</span>
        </div>
      </div>
      <nav className="side-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={cn("side-link", view === id && "active")} onClick={() => onNavigate(id)}>
            <Icon size={20} strokeWidth={view === id ? 2.4 : 1.9} />
            <span>{label}</span>
            {id === "activity" ? <b>4</b> : null}
          </button>
        ))}
      </nav>
      <div className="sidebar-quest">
        <div className="quest-icon"><Crown size={20} /></div>
        <p>Weekend quest</p>
        <strong>Play all 3 modes</strong>
        <div className="mini-progress"><span style={{ width: "66%" }} /></div>
        <small>2 of 3 completed</small>
      </div>
      <div className="sidebar-bottom">
        <button className="side-link"><Settings size={20} /><span>Settings</span></button>
        <button className="side-link"><Info size={20} /><span>About Shuf</span></button>
      </div>
    </aside>
  );
}

function BottomNav({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  return (
    <nav className="bottom-nav mobile-only">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button key={id} className={cn(view === id && "active")} onClick={() => onNavigate(id)}>
          <span><Icon size={21} strokeWidth={view === id ? 2.5 : 1.9} /></span>
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}

function MobileDrawer({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate: (view: View) => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.aside className="mobile-drawer" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 360, damping: 34 }} onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head">
              <div className="sidebar-logo"><Logo /><div><strong>SHUF</strong><span>Play the show</span></div></div>
              <button className="icon-button" onClick={onClose}><X size={20} /></button>
            </div>
            <div className="drawer-profile"><Avatar initials="MA" size="lg" accent={4} /><div><strong>Mahir Aman</strong><span>@mahir · Level 8</span></div><ChevronRight size={18} /></div>
            <nav className="side-nav">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button key={id} className="side-link" onClick={() => { onNavigate(id); onClose(); }}><Icon size={20} /><span>{label}</span></button>
              ))}
            </nav>
            <div className="sidebar-quest"><div className="quest-icon"><Crown size={20} /></div><p>Weekend quest</p><strong>Play all 3 modes</strong><div className="mini-progress"><span style={{ width: "66%" }} /></div><small>2 of 3 completed</small></div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function StatStrip() {
  return (
    <div className="stat-strip">
      <div><span className="stat-icon flame"><Flame size={18} /></span><p><strong>3 days</strong><small>Play streak</small></p></div>
      <div><span className="stat-icon violet"><Zap size={18} /></span><p><strong>1,840</strong><small>Shuf points</small></p></div>
      <div><span className="stat-icon gold"><Trophy size={18} /></span><p><strong>#142</strong><small>This week</small></p></div>
    </div>
  );
}

const modeCards = [
  {
    id: "balloon" as const,
    label: "Elimination game",
    title: "Pop the Balloon",
    copy: "Six personalities. Five decisions. One unexpected match.",
    icon: PartyPopper,
    meta: "3 min",
    players: "12.8K playing",
    className: "mode-pink",
  },
  {
    id: "blind" as const,
    label: "Compatibility",
    title: "Blind Match",
    copy: "No photos. No names. Four questions and a match built on the vibe.",
    icon: MessageCircleHeart,
    meta: "2 min",
    players: "8.4K playing",
    className: "mode-violet",
  },
  {
    id: "panel" as const,
    label: "Audience verdict",
    title: "The Panel",
    copy: "Read the story. Make the call. See whether the audience agrees.",
    icon: Swords,
    meta: "4 min",
    players: "21.6K playing",
    className: "mode-blue",
  },
];

function ModeCard({ item, onOpen, featured = false }: { item: (typeof modeCards)[number]; onOpen: () => void; featured?: boolean }) {
  const Icon = item.icon;
  return (
    <motion.button className={cn("mode-card", item.className, featured && "featured")} onClick={onOpen} whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }}>
      <div className="mode-card-glow" />
      <div className="mode-card-top"><Pill icon={Sparkles}>{item.label}</Pill><span className="mode-live"><i /> Live</span></div>
      <div className="mode-symbol"><Icon size={featured ? 34 : 28} strokeWidth={1.8} /></div>
      <div className="mode-copy"><h3>{item.title}</h3><p>{item.copy}</p></div>
      <div className="mode-footer"><span><Clock3 size={14} />{item.meta}</span><span><Users size={14} />{item.players}</span><b><ArrowRight size={18} /></b></div>
    </motion.button>
  );
}

function HomeView({ onOpenGame, onNavigate }: { onOpenGame: (game: Exclude<Game, null>) => void; onNavigate: (view: View) => void }) {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
        <div className="hero-content">
          <div><Pill icon={Sparkles}>Tonight’s featured round</Pill><h2>Don’t just watch.<br /><em>Make the call.</em></h2><p>Step into the show with live-style games, bold choices and community reactions.</p></div>
          <div className="hero-actions"><button className="primary-button" onClick={() => onOpenGame("balloon")}><Play size={17} fill="currentColor" />Play featured</button><button className="secondary-button" onClick={() => onNavigate("play")}><Gamepad2 size={17} />All modes</button></div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="stage-ring ring-1" /><div className="stage-ring ring-2" /><div className="stage-ring ring-3" />
          <div className="hero-avatar av-back-1">BE</div><div className="hero-avatar av-back-2">YO</div><div className="hero-avatar av-front">NA<span><Heart size={15} fill="currentColor" /></span></div>
          <div className="floating-chip chip-one"><Flame size={14} />Trending</div><div className="floating-chip chip-two"><Users size={14} />12.8K live</div>
        </div>
      </section>

      <StatStrip />

      <section>
        <div className="section-heading"><div><span>PLAY NOW</span><h2>Choose your format</h2></div><button onClick={() => onNavigate("play")}>See all <ChevronRight size={16} /></button></div>
        <div className="mode-grid"><ModeCard item={modeCards[0]} onOpen={() => onOpenGame("balloon")} featured /><ModeCard item={modeCards[1]} onOpen={() => onOpenGame("blind")} /><ModeCard item={modeCards[2]} onOpen={() => onOpenGame("panel")} /></div>
      </section>

      <section className="continue-panel">
        <div className="section-heading compact"><div><span>CONTINUE</span><h2>Your Shuf journey</h2></div></div>
        <div className="journey-card"><div className="journey-icon"><Crown size={22} /></div><div className="journey-copy"><div><strong>Weekend Challenge</strong><span>2 / 3 modes</span></div><p>Complete The Panel to unlock the “No Mercy” reaction pack.</p><div className="journey-progress"><span /></div></div><button onClick={() => onOpenGame("panel")}><ArrowRight size={18} /></button></div>
      </section>

      <section>
        <div className="section-heading"><div><span>COMMUNITY</span><h2>Tonight’s pulse</h2></div><button onClick={() => onNavigate("activity")}>View activity <ChevronRight size={16} /></button></div>
        <div className="pulse-grid">
          <article className="pulse-card"><div className="pulse-meta"><span className="live-dot"><i /> Live vote</span><span>8,412 votes</span></div><h3>Is planning an entire first date romantic—or controlling?</h3><div className="poll"><div><span>Romantic</span><b>68%</b></div><div className="poll-track"><span style={{ width: "68%" }} /></div><div className="poll-avatars"><Avatar initials="SE" size="sm" accent={0} /><Avatar initials="RO" size="sm" accent={1} /><Avatar initials="FA" size="sm" accent={2} /><span>+8.4K</span></div></div></article>
          <article className="quote-card"><div className="quote-mark">“</div><p>The best date story tonight had the worst opening line.</p><span>Community highlight · 4.8K likes</span><div className="quote-actions"><button><Heart size={16} />4.8K</button><button><Share2 size={16} />Share</button></div></article>
        </div>
      </section>
    </div>
  );
}

function PlayView({ onOpenGame }: { onOpenGame: (game: Exclude<Game, null>) => void }) {
  return (
    <div className="page-stack">
      <section className="page-intro"><Pill icon={Gamepad2}>Interactive studio</Pill><h2>Pick a mode.<br /><em>Own the moment.</em></h2><p>Every game is built for quick rounds, instant reactions and a result worth sharing.</p></section>
      <div className="all-modes-grid">{modeCards.map((item) => <ModeCard key={item.id} item={item} onOpen={() => onOpenGame(item.id)} featured />)}</div>
      <section className="unlock-card"><div className="unlock-icon"><Crown size={24} /></div><div><span>COMING NEXT</span><h3>Couples Challenge</h3><p>Two people. Ten questions. One shared score. Unlocks at Level 10.</p></div><div className="level-lock"><ShieldCheck size={16} />Level 10</div></section>
      <section><div className="section-heading compact"><div><span>HOW IT WORKS</span><h2>Made for the moment</h2></div></div><div className="feature-trio"><article><span><Zap size={20} /></span><h3>Instant rounds</h3><p>Get into the action without accounts, forms or setup friction.</p></article><article><span><Users size={20} /></span><h3>Audience energy</h3><p>Compare your instincts with live-style community outcomes.</p></article><article><span><Trophy size={20} /></span><h3>Progress that sticks</h3><p>Build streaks, earn points and unlock new reactions as you play.</p></article></div></section>
    </div>
  );
}

function DiscoverView({ onOpenGame }: { onOpenGame: (game: Exclude<Game, null>) => void }) {
  return (
    <div className="page-stack">
      <section className="discover-search"><Search size={18} /><input aria-label="Search people, topics and episodes" placeholder="Search people, topics and episodes" /><button><SlidersIcon /></button></section>
      <section><div className="section-heading compact"><div><span>TRENDING PEOPLE</span><h2>Faces everyone is talking about</h2></div></div><div className="people-rail">{suitors.slice(0, 6).map((person, index) => <article className="person-card" key={person.name}><div className="person-photo"><Avatar initials={person.initials} size="xl" accent={index} /><span>{index + 1}</span></div><h3>{person.name}, {person.age}</h3><p>{person.job}</p><div>{person.interests.slice(0, 2).map((interest) => <small key={interest}>{interest}</small>)}</div><button><Plus size={16} />Follow</button></article>)}</div></section>
      <section><div className="section-heading"><div><span>FRESH TOPICS</span><h2>Start a conversation</h2></div></div><div className="topic-grid"><article className="topic-card topic-one"><Pill icon={MessageCircleHeart}>1.8K replies</Pill><h3>What is one green flag people underestimate?</h3><div><Avatar initials="NA" size="sm" accent={0} /><Avatar initials="EL" size="sm" accent={2} /><Avatar initials="LI" size="sm" accent={4} /><span>Join the discussion</span></div></article><article className="topic-card topic-two"><Pill icon={Swords}>Hot debate</Pill><h3>Should the person who invited always pay?</h3><div><Avatar initials="RO" size="sm" accent={3} /><Avatar initials="FA" size="sm" accent={1} /><span>4.2K votes</span></div></article></div></section>
      <section className="discover-cta"><div><span>FEELING DECISIVE?</span><h3>Judge five stories and find your panel personality.</h3></div><button className="primary-button" onClick={() => onOpenGame("panel")}>Enter the panel <ArrowRight size={17} /></button></section>
    </div>
  );
}

function SlidersIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h10" /><path d="M18 7h2" /><path d="M14 5v4" /><path d="M4 17h2" /><path d="M10 17h10" /><path d="M8 15v4" /></svg>;
}

function ActivityView() {
  return (
    <div className="page-stack">
      <section className="activity-hero"><div><Pill icon={Activity}>Your week</Pill><h2>Small choices.<br /><em>Big personality.</em></h2><p>You played 7 rounds and agreed with the community 64% of the time.</p></div><div className="radial-score"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" /><circle className="score-ring" cx="60" cy="60" r="48" /></svg><div><strong>64%</strong><span>Aligned</span></div></div></section>
      <section><div className="section-heading compact"><div><span>RECENT</span><h2>Your activity</h2></div><button>Mark all read</button></div><div className="activity-list">{activityFeed.map(({ icon: Icon, title, text, time, tone }) => <article key={title}><span className={cn("activity-icon", tone)}><Icon size={19} /></span><div><strong>{title}</strong><p>{text}</p></div><time>{time}</time></article>)}</div></section>
      <section><div className="section-heading compact"><div><span>INSIGHTS</span><h2>Your player DNA</h2></div></div><div className="insight-grid"><article><span><Heart size={19} /></span><div><small>MOST USED REACTION</small><strong>Optimistic</strong><p>You choose “Loved it” 42% of the time.</p></div></article><article><span><Target size={19} /></span><div><small>STRONGEST INSTINCT</small><strong>Communication</strong><p>You spot weak communication faster than 78% of players.</p></div></article></div></section>
    </div>
  );
}

function ProfileView() {
  return (
    <div className="page-stack">
      <section className="profile-card"><div className="profile-cover"><span className="profile-noise" /></div><div className="profile-main"><Avatar initials="MA" size="xl" accent={4} /><button className="icon-button"><Settings size={18} /></button><h2>Mahir Aman</h2><p>@mahir · Addis Ababa</p><div className="profile-badges"><Pill icon={ShieldCheck}>Level 8</Pill><Pill icon={Flame}>3 day streak</Pill></div><div className="profile-stats"><div><strong>27</strong><span>Rounds</span></div><div><strong>1.8K</strong><span>Points</span></div><div><strong>64%</strong><span>Aligned</span></div></div></div></section>
      <section><div className="section-heading compact"><div><span>PROGRESSION</span><h2>Next level</h2></div><b>1,840 / 2,200 XP</b></div><div className="level-card"><div className="level-badge">8</div><div><div className="level-label"><strong>Sharp Observer</strong><span>360 XP to Level 9</span></div><div className="journey-progress"><span style={{ width: "84%" }} /></div><p>Level 9 unlocks custom verdict cards and two new reaction styles.</p></div></div></section>
      <section><div className="section-heading compact"><div><span>ACHIEVEMENTS</span><h2>Your collection</h2></div><button>View all</button></div><div className="badge-grid"><article className="earned"><span><Flame size={22} /></span><strong>On Fire</strong><small>3 day streak</small></article><article className="earned"><span><Swords size={22} /></span><strong>No Mercy</strong><small>10 harsh votes</small></article><article className="earned"><span><Heart size={22} /></span><strong>Soft Spot</strong><small>10 loved votes</small></article><article><span><Crown size={22} /></span><strong>Panel Royalty</strong><small>Locked</small></article></div></section>
    </div>
  );
}

function GameHeader({ eyebrow, title, copy, onBack, progress }: { eyebrow: string; title: string; copy: string; onBack: () => void; progress?: number }) {
  return (
    <div className="game-heading">
      <button className="game-back desktop-only" onClick={onBack}><ArrowLeft size={18} />Back to games</button>
      <div><Pill icon={Sparkles}>{eyebrow}</Pill><h2>{title}</h2><p>{copy}</p></div>
      {typeof progress === "number" ? <div className="game-progress"><span>{progress}%</span><div><i style={{ width: `${progress}%` }} /></div></div> : null}
    </div>
  );
}

function BalloonGame({ onBack, onComplete }: { onBack: () => void; onComplete: (points: number) => void }) {
  const [round, setRound] = useState(0);
  const [pool, setPool] = useState<Suitor[]>([]);
  const [popped, setPopped] = useState<number[]>([]);
  const [reveal, setReveal] = useState<Suitor | null>(null);

  const reset = useCallback(() => {
    const shuffled = [...suitors].sort(() => Math.random() - 0.5).slice(0, 6);
    setPool(shuffled);
    setPopped([]);
    setReveal(null);
    setRound((value) => value + 1);
  }, []);

  useEffect(() => { reset(); }, [reset]);

  const complete = popped.length === 5;
  const match = complete ? pool.find((_, index) => !popped.includes(index)) : null;

  useEffect(() => {
    if (complete) onComplete(180);
  }, [complete, onComplete]);

  const pop = (index: number) => {
    if (popped.includes(index) || complete) return;
    setPopped((current) => [...current, index]);
    setReveal(pool[index]);
  };

  return (
    <div className="game-page">
      <GameHeader eyebrow="Elimination game" title="Pop five. Meet one." copy="Tap any balloon to reveal the person behind it. Your final unpopped balloon becomes the match." onBack={onBack} progress={(popped.length / 5) * 100} />
      <div className="balloon-layout">
        <section className="balloon-stage">
          <div className="stage-top"><span>Round {round}</span><span>{5 - popped.length} choices left</span></div>
          <div className="balloon-grid">
            {pool.map((person, index) => {
              const isPopped = popped.includes(index);
              const isWinner = complete && !isPopped;
              return (
                <motion.button key={`${round}-${person.name}`} className={cn("balloon-button", `balloon-${index + 1}`, isPopped && "popped", isWinner && "winner")} onClick={() => pop(index)} initial={{ opacity: 0, y: 25 }} animate={{ opacity: isPopped ? 0.12 : 1, y: 0, scale: isPopped ? 0.82 : 1 }} transition={{ delay: index * 0.05 }} disabled={isPopped} aria-label={`Balloon ${index + 1}`}>
                  <span className="balloon-shape"><i /><b>{isWinner ? <Crown size={26} /> : index + 1}</b></span><span className="balloon-string" />
                </motion.button>
              );
            })}
          </div>
          <div className="stage-floor" />
        </section>

        <aside className="game-sidecard">
          <AnimatePresence mode="wait">
            {match ? (
              <motion.div key="match" className="match-result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="confetti"><i /><i /><i /><i /><i /></div><span className="result-kicker"><Sparkles size={14} />Your match</span><Avatar initials={match.initials} size="xl" accent={2} /><h3>{match.name}, {match.age}</h3><p className="job">{match.job}</p><p>{match.bio}</p><div className="interest-row">{match.interests.map((item) => <span key={item}>{item}</span>)}</div><div className="compat-score"><span>First-impression match</span><strong>92%</strong></div><button className="primary-button full" onClick={reset}><RotateCcw size={17} />Play another round</button><button className="share-button"><Share2 size={16} />Share result</button>
              </motion.div>
            ) : reveal ? (
              <motion.div key={reveal.name} className="reveal-result" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
                <span className={cn("flag-label", reveal.flag)}>{reveal.flag === "green" ? <ThumbsUp size={14} /> : reveal.flag === "red" ? <ThumbsDown size={14} /> : <Sparkles size={14} />}{reveal.flag === "green" ? "Green flag" : reveal.flag === "red" ? "Red flag" : "Wildcard"}</span><Avatar initials={reveal.initials} size="lg" accent={popped.length} /><h3>{reveal.name}, {reveal.age}</h3><p className="job">{reveal.job}</p><blockquote>“{reveal.trait}”</blockquote><p>{reveal.bio}</p><div className="side-tip"><Info size={16} /><span>Keep popping. The final balloon becomes your match.</span></div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="empty-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="empty-icon"><PartyPopper size={30} /></div><h3>Make your first choice</h3><p>Each balloon hides a personality, a green flag—or a plot twist.</p><div className="side-tip"><Sparkles size={16} /><span>Your decisions are private until the final reveal.</span></div></motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}

function BlindGame({ onBack, onComplete }: { onBack: () => void; onComplete: (points: number) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<Suitor | null>(null);

  const choose = (answer: string) => {
    const updated = [...answers, answer];
    setAnswers(updated);
    if (step === blindQuestions.length - 1) {
      const index = updated.join("").length % suitors.length;
      setResult(suitors[index]);
      onComplete(220);
    } else setStep((value) => value + 1);
  };

  const reset = () => { setStep(0); setAnswers([]); setResult(null); };
  const compatibility = 84 + ((answers.join("").length * 7) % 13);

  return (
    <div className="game-page">
      <GameHeader eyebrow="Compatibility mode" title="Match the person, not the picture." copy="Four instinctive choices create a personality signal. No photos. No names. No overthinking." onBack={onBack} progress={result ? 100 : (step / blindQuestions.length) * 100} />
      <section className="blind-shell">
        <div className="blind-visual">
          <div className="blind-orbit"><span className="orbit-dot dot-a" /><span className="orbit-dot dot-b" /><span className="orbit-dot dot-c" /><div className="question-mark">?</div></div>
          <div className="blind-copy"><span>{result ? "SIGNAL COMPLETE" : `QUESTION ${step + 1} OF ${blindQuestions.length}`}</span><h3>{result ? "Your pattern is clear." : "First instinct wins."}</h3><p>{result ? "Your answers point toward someone grounded, expressive and ready for a real conversation." : "Choose what feels natural. There are no perfect answers here."}</p></div>
        </div>
        <div className="blind-panel">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" className="blind-result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="result-kicker"><Sparkles size={14} />Compatibility found</span><div className="blind-result-main"><Avatar initials={result.initials} size="xl" accent={3} /><div className="compat-ring"><svg viewBox="0 0 90 90"><circle cx="45" cy="45" r="38" /><circle className="compat-ring-fill" cx="45" cy="45" r="38" style={{ strokeDashoffset: 239 - (239 * compatibility) / 100 }} /></svg><strong>{compatibility}%</strong></div></div><h3>{result.name}, {result.age}</h3><p className="job">{result.job}</p><p>{result.bio}</p><div className="interest-row">{result.interests.map((item) => <span key={item}>{item}</span>)}</div><div className="icebreakers"><strong>Three ways to start</strong><button><MessageCircleHeart size={16} />Ask what makes a conversation feel effortless.</button><button><Compass size={16} />Compare your ideal first-date plans.</button><button><Laugh size={16} />Trade the funniest harmless red flags.</button></div><button className="primary-button full" onClick={reset}><RotateCcw size={17} />Create another match</button>
              </motion.div>
            ) : (
              <motion.div key={step} className="question-panel" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -22 }}>
                <span className="question-eyebrow">{blindQuestions[step].eyebrow}</span><h3>{blindQuestions[step].question}</h3><div className="answer-grid">{blindQuestions[step].options.map(({ label, icon: Icon }, index) => <motion.button key={label} onClick={() => choose(label)} whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}><span><Icon size={21} /></span><strong>{label}</strong><b>{String.fromCharCode(65 + index)}</b></motion.button>)}</div><div className="answer-note"><ShieldCheck size={15} /><span>Your answers stay on this device.</span></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

function PanelGame({ onBack, onComplete }: { onBack: () => void; onComplete: (points: number) => void }) {
  const [index, setIndex] = useState(0);
  const [votes, setVotes] = useState({ loved: 0, fair: 0, harsh: 0 });
  const [finished, setFinished] = useState(false);
  const story = stories[index];

  const vote = (type: keyof typeof votes) => {
    const updated = { ...votes, [type]: votes[type] + 1 };
    setVotes(updated);
    if (index === stories.length - 1) {
      setFinished(true);
      onComplete(250);
    } else setIndex((value) => value + 1);
  };

  const reset = () => { setIndex(0); setVotes({ loved: 0, fair: 0, harsh: 0 }); setFinished(false); };
  const personality = votes.harsh >= votes.loved && votes.harsh >= votes.fair ? ["The Truth Teller", "You notice what others politely ignore.", "harsh"] : votes.loved >= votes.fair ? ["The Hopeful One", "You leave room for good intentions and second chances.", "loved"] : ["The Balanced Judge", "You weigh context before delivering the verdict.", "fair"];

  return (
    <div className="game-page">
      <GameHeader eyebrow="Audience verdict" title="You have a seat on the panel." copy="Read five real-world date stories. React honestly. Then meet your panel personality." onBack={onBack} progress={finished ? 100 : (index / stories.length) * 100} />
      <section className="panel-stage">
        <div className="panel-audience"><span /><span /><span /><span /><span /><span /><span /><span /></div>
        <div className="panel-content">
          <AnimatePresence mode="wait">
            {finished ? (
              <motion.div key="verdict" className="final-verdict" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                <div className={cn("verdict-emblem", personality[2])}><Crown size={32} /></div><span className="result-kicker"><Sparkles size={14} />Panel personality</span><h3>{personality[0]}</h3><p>{personality[1]}</p><div className="vote-summary"><div><span className="reaction loved"><Heart size={17} fill="currentColor" /></span><strong>{votes.loved}</strong><small>Loved</small></div><div><span className="reaction fair"><Target size={17} /></span><strong>{votes.fair}</strong><small>Fair</small></div><div><span className="reaction harsh"><Zap size={17} fill="currentColor" /></span><strong>{votes.harsh}</strong><small>Harsh</small></div></div><div className="agreement-card"><Users size={19} /><div><strong>You matched the audience 68%</strong><span>More aligned than 7 in 10 panelists tonight.</span></div></div><button className="primary-button full" onClick={reset}><RotateCcw size={17} />Judge five more</button><button className="share-button"><Share2 size={16} />Share personality</button>
              </motion.div>
            ) : (
              <motion.div key={story.name} className="story-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
                <div className="story-step"><span>STORY {index + 1} OF {stories.length}</span><small>{story.stat}</small></div><div className="story-person"><Avatar initials={story.initials} size="lg" accent={index} /><div><h3>{story.name}</h3><p>{story.role}</p></div><button className="icon-button"><Bookmark size={18} /></button></div><blockquote>“{story.story}”</blockquote><div className="reaction-title"><span>YOUR VERDICT</span><small>Tap the reaction that feels true.</small></div><div className="reaction-grid"><motion.button onClick={() => vote("loved")} whileTap={{ scale: 0.96 }}><span className="reaction loved"><Heart size={22} fill="currentColor" /></span><strong>Loved it</strong><small>Good intention</small></motion.button><motion.button onClick={() => vote("fair")} whileTap={{ scale: 0.96 }}><span className="reaction fair"><Target size={22} /></span><strong>Fair</strong><small>Needs context</small></motion.button><motion.button onClick={() => vote("harsh")} whileTap={{ scale: 0.96 }}><span className="reaction harsh"><Zap size={22} fill="currentColor" /></span><strong>Harsh</strong><small>Absolutely not</small></motion.button></div></motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

export default function ShufApp() {
  const [view, setView] = useState<View>("home");
  const [game, setGame] = useState<Game>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [points, setPoints] = useState(1840);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("shuf-points");
    if (saved) setPoints(Number(saved));
  }, []);

  const onComplete = useCallback((earned: number) => {
    setPoints((current) => {
      const next = current + earned;
      window.localStorage.setItem("shuf-points", String(next));
      return next;
    });
    setToast(`+${earned} Shuf points earned`);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const navigate = (nextView: View) => {
    setGame(null);
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openGame = (nextGame: Exclude<Game, null>) => {
    setGame(nextGame);
    setView("play");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const content = useMemo(() => {
    if (game === "balloon") return <BalloonGame onBack={() => setGame(null)} onComplete={onComplete} />;
    if (game === "blind") return <BlindGame onBack={() => setGame(null)} onComplete={onComplete} />;
    if (game === "panel") return <PanelGame onBack={() => setGame(null)} onComplete={onComplete} />;
    if (view === "home") return <HomeView onOpenGame={openGame} onNavigate={navigate} />;
    if (view === "play") return <PlayView onOpenGame={openGame} />;
    if (view === "discover") return <DiscoverView onOpenGame={openGame} />;
    if (view === "activity") return <ActivityView />;
    return <ProfileView />;
  }, [game, view, onComplete]);

  return (
    <div className="app-root">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <Sidebar view={view} onNavigate={navigate} />
      <div className="app-column">
        <AppHeader view={view} game={game} onBack={() => setGame(null)} onMenu={() => setDrawerOpen(true)} />
        <main className={cn("content-area", game && "game-content")}>{content}</main>
      </div>
      <BottomNav view={view} onNavigate={navigate} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={navigate} />
      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 10, x: "-50%" }}><Check size={17} />{toast}<strong>{points.toLocaleString()} total</strong></motion.div> : null}</AnimatePresence>
    </div>
  );
}
