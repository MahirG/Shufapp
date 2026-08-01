import {
  Activity, ArrowRight, Check, ChevronRight, Crown, Flame, Gamepad2, Heart, MessageCircleHeart,
  MessageSquare, Plus, Search, Settings, Share2, ShieldCheck, SlidersHorizontal, Sparkles, Swords,
  Target, Trophy, Users, Zap,
} from "lucide-react";
import { Game, Suitor, View, initialActivity, modeCards, stories, suitors } from "./data";
import { Avatar, Pill, cn } from "./ui";
import { ModeCard } from "./shell";

type Toast = (message: string) => void;

export function HomeView({
  points, liked, pollVote, onLike, onPoll, onShare, onOpenGame, onNavigate, onStartChat,
}: {
  points: number;
  liked: boolean;
  pollVote: "romantic" | "controlling" | null;
  onLike: () => void;
  onPoll: (vote: "romantic" | "controlling") => void;
  onShare: (title: string, text: string) => void;
  onOpenGame: (game: Exclude<Game, null>) => void;
  onNavigate: (view: View) => void;
  onStartChat: (person: Suitor) => void;
}) {
  const romantic = pollVote === "controlling" ? 67 : pollVote === "romantic" ? 69 : 68;
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
        <div className="hero-content">
          <div><Pill icon={Sparkles}>Tonight’s featured round</Pill><h2>Don’t just watch.<br /><em>Make the call.</em></h2><p>Step into the show with live-style games, bold choices and conversations that continue after the reveal.</p></div>
          <div className="hero-actions"><button className="primary-button" onClick={() => onOpenGame("balloon")}><Gamepad2 size={17} />Play featured</button><button className="secondary-button" onClick={() => onNavigate("chat")}><MessageSquare size={17} />Open messages</button></div>
        </div>
        <div className="hero-visual" aria-hidden="true"><div className="stage-ring ring-1" /><div className="stage-ring ring-2" /><div className="stage-ring ring-3" /><div className="hero-avatar av-back-1">BE</div><div className="hero-avatar av-back-2">YO</div><div className="hero-avatar av-front">NA<span><Heart size={15} fill="currentColor" /></span></div><div className="floating-chip chip-one"><Flame size={14} />Trending</div><div className="floating-chip chip-two"><Users size={14} />12.8K live</div></div>
      </section>

      <div className="stat-strip"><div><span className="stat-icon flame"><Flame size={18} /></span><p><strong>3 days</strong><small>Play streak</small></p></div><div><span className="stat-icon violet"><Zap size={18} /></span><p><strong>{points.toLocaleString()}</strong><small>Shuf points</small></p></div><div><span className="stat-icon gold"><Trophy size={18} /></span><p><strong>#142</strong><small>This week</small></p></div></div>

      <section><div className="section-heading"><div><span>PLAY NOW</span><h2>Choose your format</h2></div><button onClick={() => onNavigate("play")}>See all <ChevronRight size={16} /></button></div><div className="mode-grid"><ModeCard item={modeCards[0]} onOpen={() => onOpenGame("balloon")} featured /><ModeCard item={modeCards[1]} onOpen={() => onOpenGame("blind")} /><ModeCard item={modeCards[2]} onOpen={() => onOpenGame("panel")} /></div></section>

      <section className="home-chat-teaser"><div className="teaser-icon"><MessageCircleHeart size={26} /></div><div className="chat-teaser-copy"><span>NEW IN SHUF</span><h3>The reveal is only the beginning.</h3><p>Continue a match, react to messages and start a real conversation without leaving the experience.</p></div><button className="primary-button" onClick={() => onStartChat(suitors[8])}>Message Hana <ArrowRight size={17} /></button></section>

      <section><div className="section-heading"><div><span>COMMUNITY</span><h2>Tonight’s pulse</h2></div><button onClick={() => onNavigate("discover")}>Explore <ChevronRight size={16} /></button></div><div className="pulse-grid">
        <article className="pulse-card"><div className="pulse-meta"><span className="live-dot"><i /> Live vote</span><span>8,412 votes</span></div><h3>Is planning an entire first date romantic—or controlling?</h3><div className="poll"><div><span>Romantic</span><b>{romantic}%</b></div><div className="poll-track"><span style={{ width: `${romantic}%` }} /></div></div><div className="poll-actions"><button className={cn(pollVote === "romantic" && "selected")} onClick={() => onPoll("romantic")}><Heart size={15} />Romantic</button><button className={cn(pollVote === "controlling" && "selected")} onClick={() => onPoll("controlling")}><Swords size={15} />Controlling</button></div></article>
        <article className="quote-card"><div className="quote-mark">“</div><p>The best date story tonight had the worst opening line.</p><span>Community highlight · {liked ? "4.9K" : "4.8K"} likes</span><div className="quote-actions"><button className={cn(liked && "selected")} onClick={onLike}><Heart size={16} fill={liked ? "currentColor" : "none"} />{liked ? "Liked" : "Like"}</button><button onClick={() => onShare("Shuf community highlight", "The best date story tonight had the worst opening line.")}><Share2 size={16} />Share</button></div></article>
      </div></section>
    </div>
  );
}

export function PlayView({ onOpenGame, onToast }: { onOpenGame: (game: Exclude<Game, null>) => void; onToast: Toast }) {
  return <div className="page-stack"><section className="page-intro"><Pill icon={Gamepad2}>Interactive studio</Pill><h2>Pick a mode.<br /><em>Own the moment.</em></h2><p>Quick rounds, instant reactions and results worth discussing.</p></section><div className="all-modes-grid">{modeCards.map((item) => <ModeCard key={item.id} item={item} onOpen={() => onOpenGame(item.id)} featured />)}</div><button className="unlock-card level-lock-button" onClick={() => onToast("Couples Challenge unlocks at Level 10") }><div className="unlock-icon"><Crown size={24} /></div><div><span>COMING NEXT</span><h3>Couples Challenge</h3><p>Two people. Ten questions. One shared score.</p></div><div className="level-lock"><ShieldCheck size={16} />Level 10</div></button><section><div className="section-heading compact"><div><span>HOW IT WORKS</span><h2>Made for the moment</h2></div></div><div className="feature-trio"><button onClick={() => onOpenGame("balloon")}><span><Zap size={20} /></span><h3>Instant rounds</h3><p>Jump in without setup friction.</p></button><button onClick={() => onOpenGame("panel")}><span><Users size={20} /></span><h3>Audience energy</h3><p>Compare your instincts with the crowd.</p></button><button onClick={() => onToast("You have 1,840+ Shuf points") }><span><Trophy size={20} /></span><h3>Progress that sticks</h3><p>Build streaks and unlock rewards.</p></button></div></section></div>;
}

export function DiscoverView({
  query, flag, followed, onQuery, onFlag, onFollow, onToast, onStartChat, onOpenGame,
}: {
  query: string;
  flag: "all" | "green" | "red" | "wild";
  followed: string[];
  onQuery: (value: string) => void;
  onFlag: (value: "all" | "green" | "red" | "wild") => void;
  onFollow: (person: Suitor) => void;
  onToast: Toast;
  onStartChat: (person: Suitor) => void;
  onOpenGame: (game: Exclude<Game, null>) => void;
}) {
  const people = suitors.filter((person) => (flag === "all" || person.flag === flag) && `${person.name} ${person.job} ${person.interests.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="page-stack">
    <section className="discover-search"><Search size={18} /><input value={query} onChange={(event) => onQuery(event.target.value)} aria-label="Search people and topics" placeholder="Search people, topics and interests" /><button onClick={() => onFlag(flag === "all" ? "green" : "all")} aria-label="Toggle filters"><SlidersHorizontal size={17} /></button></section>
    <div className="filter-chips">{(["all", "green", "red", "wild"] as const).map((item) => <button key={item} className={cn(flag === item && "selected")} onClick={() => onFlag(item)}>{item === "all" ? "All people" : `${item[0].toUpperCase()}${item.slice(1)} flags`}</button>)}</div>
    <section><div className="section-heading compact"><div><span>TRENDING PEOPLE</span><h2>Faces everyone is talking about</h2></div></div>{people.length ? <div className="people-rail">{people.map((person, index) => <article className="person-card" key={person.name}><button className="person-photo person-photo-button" onClick={() => onStartChat(person)}><Avatar initials={person.initials} size="xl" accent={index} online={index % 3 !== 2} /><span>{index + 1}</span></button><h3>{person.name}, {person.age}</h3><p>{person.job}</p><div>{person.interests.slice(0, 2).map((interest) => <small key={interest}>{interest}</small>)}</div><button onClick={() => onFollow(person)}>{followed.includes(person.name) ? <Check size={16} /> : <Plus size={16} />}{followed.includes(person.name) ? "Following" : "Follow"}</button><button onClick={() => onStartChat(person)}><MessageSquare size={16} />Message</button></article>)}</div> : <div className="empty-search"><Search size={24} /><h3>No matches yet</h3><p>Try another name, job or interest.</p><button className="secondary-button" onClick={() => { onQuery(""); onFlag("all"); }}>Clear filters</button></div>}</section>
    <section><div className="section-heading"><div><span>FRESH TOPICS</span><h2>Start a conversation</h2></div></div><div className="topic-grid"><button className="topic-card topic-one" onClick={() => onToast("Joined: underrated green flags")}><Pill icon={MessageCircleHeart}>1.8K replies</Pill><h3>What is one green flag people underestimate?</h3><div><Avatar initials="NA" size="sm" accent={0} /><Avatar initials="EL" size="sm" accent={2} /><span>Join discussion</span></div></button><button className="topic-card topic-two" onClick={() => onToast("Vote recorded: who should pay?")}><Pill icon={Swords}>Hot debate</Pill><h3>Should the person who invited always pay?</h3><div><Avatar initials="RO" size="sm" accent={3} /><span>4.2K votes</span></div></button></div></section>
    <section className="discover-cta"><div><span>FEELING DECISIVE?</span><h3>Judge five stories and find your panel personality.</h3></div><button className="primary-button" onClick={() => onOpenGame("panel")}>Enter the panel <ArrowRight size={17} /></button></section>
  </div>;
}

export function ActivityView({ activity, onMarkAllRead, onOpenItem }: { activity: typeof initialActivity; onMarkAllRead: () => void; onOpenItem: (id: string, target: View) => void }) {
  return <div className="page-stack"><section className="activity-hero"><div><Pill icon={Activity}>Your week</Pill><h2>Small choices.<br /><em>Big personality.</em></h2><p>You played 7 rounds and agreed with the community 64% of the time.</p></div><div className="radial-score"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" /><circle className="score-ring" cx="60" cy="60" r="48" /></svg><div><strong>64%</strong><span>Aligned</span></div></div></section><section><div className="section-heading compact"><div><span>RECENT</span><h2>Your activity</h2></div><button onClick={onMarkAllRead}>Mark all read</button></div><div className="activity-list">{activity.map(({ id, icon: Icon, title, text, time, tone, read, target }) => <button className={cn("activity-row", !read && "unread")} key={id} onClick={() => onOpenItem(id, target)}><span className={cn("activity-icon", tone)}><Icon size={19} /></span><div><strong>{title}</strong><p>{text}</p></div><time>{time}</time><ChevronRight size={16} /></button>)}</div></section><section><div className="section-heading compact"><div><span>INSIGHTS</span><h2>Your player DNA</h2></div></div><div className="insight-grid"><button onClick={() => onOpenItem("a2", "chat")}><span><Heart size={19} /></span><div><small>MOST USED REACTION</small><strong>Optimistic</strong><p>You choose “Loved it” 42% of the time.</p></div></button><button onClick={() => onOpenItem("a4", "discover")}><span><Target size={19} /></span><div><small>STRONGEST INSTINCT</small><strong>Communication</strong><p>You spot weak communication faster than 78% of players.</p></div></button></div></section></div>;
}

export function ProfileView({ points, onSettings, onAchievements, onToast }: { points: number; onSettings: () => void; onAchievements: () => void; onToast: Toast }) {
  const pct = Math.min(100, Math.round((points / 2200) * 100));
  return <div className="page-stack"><section className="profile-card"><div className="profile-cover"><span className="profile-noise" /></div><div className="profile-main"><Avatar initials="MA" size="xl" accent={4} /><button className="icon-button" onClick={onSettings}><Settings size={18} /></button><h2>Mahir Aman</h2><p>@mahir · Addis Ababa</p><div className="profile-badges"><button onClick={onAchievements}><Pill icon={ShieldCheck}>Level 8</Pill></button><button onClick={() => onToast("Your streak is active") }><Pill icon={Flame}>3 day streak</Pill></button></div><div className="profile-stats"><button onClick={() => onToast("27 completed rounds") }><strong>27</strong><span>Rounds</span></button><button onClick={() => onToast(`${points.toLocaleString()} total points`) }><strong>{points.toLocaleString()}</strong><span>Points</span></button><button onClick={() => onToast("64% community alignment") }><strong>64%</strong><span>Aligned</span></button></div></div></section><section><div className="section-heading compact"><div><span>PROGRESSION</span><h2>Next level</h2></div><b>{points.toLocaleString()} / 2,200 XP</b></div><div className="level-card"><button className="level-badge" onClick={onAchievements}>8</button><div><div className="level-label"><strong>Sharp Observer</strong><span>{Math.max(0, 2200 - points)} XP to Level 9</span></div><div className="journey-progress"><span style={{ width: `${pct}%` }} /></div><p>Level 9 unlocks custom verdict cards and two new reaction styles.</p></div></div></section><section><div className="section-heading compact"><div><span>ACHIEVEMENTS</span><h2>Your collection</h2></div><button onClick={onAchievements}>View all</button></div><div className="badge-grid">{[[Flame,"On Fire","3 day streak"],[Swords,"No Mercy","10 harsh votes"],[Heart,"Soft Spot","10 loved votes"],[Crown,"Panel Royalty","Locked"]].map(([Icon,title,copy], index) => <button className={cn(index < 3 && "earned")} key={String(title)} onClick={index < 3 ? () => onToast(`${title} achievement selected`) : onAchievements}><span><Icon size={22} /></span><strong>{String(title)}</strong><small>{String(copy)}</small></button>)}</div></section></div>;
}

export { stories };
