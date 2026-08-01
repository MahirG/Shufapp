import {
  ArrowRight, Check, CheckCheck, Crown, Flame, Heart, MessageSquare, Monitor, MoonStar, Phone,
  Search, ShieldCheck, Sparkles, Sun, Swords, Trophy, UserPlus, Users, Video, Volume2,
  VolumeX, X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Game, NotificationItem, Suitor, ThemeMode, View, modeCards, navItems, suitors } from "./data";
import { Avatar, Logo, cn } from "./ui";

export function Overlay({ title, eyebrow, onClose, children, wide = false }: { title: string; eyebrow?: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => { const key = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") onClose(); }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, [onClose]);
  return <motion.div className="interaction-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}><motion.section className={cn("interaction-modal", wide && "wide")} initial={{ opacity: 0, y: 22, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ type: "spring", stiffness: 340, damping: 32 }} onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}><header>{eyebrow ? <span>{eyebrow}</span> : null}<h2>{title}</h2><button onClick={onClose} aria-label="Close"><X size={19} /></button></header><div className="modal-body">{children}</div></motion.section></motion.div>;
}

export function NotificationModal({ notifications, onRead, onReadAll, onOpenChat, onClose }: { notifications: NotificationItem[]; onRead: (id: string) => void; onReadAll: () => void; onOpenChat: () => void; onClose: () => void }) {
  return <Overlay title="Notifications" eyebrow={`${notifications.filter((item) => !item.read).length} unread`} onClose={onClose}><div className="modal-toolbar"><span>Latest Shuf activity</span><button onClick={onReadAll}><CheckCheck size={15} />Mark all read</button></div><div className="notification-list">{notifications.map((item) => <button className={cn(!item.read && "unread")} key={item.id} onClick={() => { onRead(item.id); if (item.icon === "message") { onOpenChat(); onClose(); } }}><span>{item.icon === "message" ? <MessageSquare size={18} /> : item.icon === "match" ? <Heart size={18} /> : item.icon === "trophy" ? <Trophy size={18} /> : <Users size={18} />}</span><div><strong>{item.title}</strong><p>{item.text}</p></div><time>{item.time}</time>{!item.read ? <i /> : <Check size={14} />}</button>)}</div></Overlay>;
}

export function SettingsModal({ settings, onChange, onClose }: { settings: { theme: ThemeMode; sound: boolean; motion: boolean; messagePreview: boolean }; onChange: (next: { theme: ThemeMode; sound: boolean; motion: boolean; messagePreview: boolean }) => void; onClose: () => void }) {
  return <Overlay title="Settings" eyebrow="Your experience" onClose={onClose}><div className="settings-group"><span>APPEARANCE</span><div className="segmented-control">{([{ id: "system", icon: Monitor, label: "System" }, { id: "dark", icon: MoonStar, label: "Dark" }, { id: "light", icon: Sun, label: "Light" }] as const).map(({ id, icon: Icon, label }) => <button className={cn(settings.theme === id && "selected")} key={id} onClick={() => onChange({ ...settings, theme: id })}><Icon size={17} />{label}</button>)}</div></div><div className="settings-group"><span>BEHAVIOR</span><div className="settings-list"><button onClick={() => onChange({ ...settings, sound: !settings.sound })}><span>{settings.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}</span><div className="setting-copy"><strong>Sound effects</strong><small>Message and game feedback sounds</small></div><i className={cn("switch", settings.sound && "on")}><b /></i></button><button onClick={() => onChange({ ...settings, motion: !settings.motion })}><span><Sparkles size={18} /></span><div className="setting-copy"><strong>Motion and animation</strong><small>Use transitions and playful effects</small></div><i className={cn("switch", settings.motion && "on")}><b /></i></button><button onClick={() => onChange({ ...settings, messagePreview: !settings.messagePreview })}><span><MessageSquare size={18} /></span><div className="setting-copy"><strong>Message previews</strong><small>Show latest message in conversation list</small></div><i className={cn("switch", settings.messagePreview && "on")}><b /></i></button></div></div></Overlay>;
}

export function AboutModal({ onClose }: { onClose: () => void }) {
  return <Overlay title="About Shuf" eyebrow="Interactive social entertainment" onClose={onClose}><div className="about-modal"><div className="about-logo"><Logo /><div><strong>SHUF</strong><span>Play. Match. Talk.</span></div></div><p>Shuf turns social matchmaking and audience-panel formats into playable experiences with modern local-first messaging.</p><div className="about-grid"><button onClick={() => window.open("https://github.com/MahirG/Shufapp", "_blank", "noopener,noreferrer")}><ShieldCheck size={19} /><strong>Privacy first</strong><span>Messages remain on this device in the current edition.</span></button><button onClick={() => navigator.clipboard?.writeText("https://github.com/MahirG/Shufapp")}><Sparkles size={19} /><strong>Open source build</strong><span>Copy the project repository address.</span></button></div><small>Shuf is an independent interactive concept and is not affiliated with a television channel.</small></div></Overlay>;
}

export function AchievementsModal({ onClose, onToast }: { onClose: () => void; onToast: (message: string) => void }) {
  const items = [{ icon: Flame, title: "On Fire", copy: "Play three days in a row", progress: "Unlocked", earned: true }, { icon: Swords, title: "No Mercy", copy: "Cast ten harsh verdicts", progress: "Unlocked", earned: true }, { icon: Heart, title: "Soft Spot", copy: "Cast ten loved verdicts", progress: "Unlocked", earned: true }, { icon: Crown, title: "Panel Royalty", copy: "Complete 50 panel stories", progress: "27 / 50", earned: false }];
  return <Overlay title="Achievements" eyebrow="Your collection" onClose={onClose} wide><div className="achievement-modal-grid">{items.map(({ icon: Icon, title, copy, progress, earned }) => <button className={cn(earned && "earned")} key={title} onClick={() => onToast(earned ? `${title} selected` : `${23} more stories to unlock Panel Royalty`)}><span><Icon size={25} /></span><div><strong>{title}</strong><p>{copy}</p><small>{progress}</small></div>{earned ? <Check size={17} /> : <span className="mini-progress"><i style={{ width: "54%" }} /></span>}</button>)}</div></Overlay>;
}

export function SearchModal({ onClose, onNavigate, onOpenGame, onStartChat }: { onClose: () => void; onNavigate: (view: View) => void; onOpenGame: (game: Exclude<Game, null>) => void; onStartChat: (person: Suitor) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    const nav = navItems.filter((item) => item.label.toLowerCase().includes(q)).map((item) => ({ id: `nav-${item.id}`, label: item.label, copy: "Open section", icon: item.icon, action: () => onNavigate(item.id) }));
    const games = modeCards.filter((item) => `${item.title} ${item.copy}`.toLowerCase().includes(q)).map((item) => ({ id: `game-${item.id}`, label: item.title, copy: item.copy, icon: item.icon, action: () => onOpenGame(item.id) }));
    const people = suitors.filter((item) => `${item.name} ${item.job}`.toLowerCase().includes(q)).slice(0, 5).map((item) => ({ id: `person-${item.name}`, label: item.name, copy: item.job, icon: UserPlus, action: () => onStartChat(item) }));
    return [...nav, ...games, ...people].slice(0, 10);
  }, [query, onNavigate, onOpenGame, onStartChat]);
  return <Overlay title="Search Shuf" eyebrow="Command centre" onClose={onClose} wide><label className="command-search"><Search size={20} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search modes, people and sections" /><kbd>ESC</kbd></label><div className="command-results">{results.map(({ id, label, copy, icon: Icon, action }) => <button key={id} onClick={() => { action(); onClose(); }}><span><Icon size={18} /></span><div><strong>{label}</strong><small>{copy}</small></div><ArrowRight size={16} /></button>)}{!results.length ? <div className="command-empty"><Search size={24} /><strong>No result</strong><span>Try another name, mode or section.</span></div> : null}</div></Overlay>;
}

export function NewChatModal({ existingIds, onCreate, onClose }: { existingIds: string[]; onCreate: (person: Suitor) => void; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const people = suitors.filter((person) => !existingIds.includes(person.name.toLowerCase()) && `${person.name} ${person.job}`.toLowerCase().includes(query.toLowerCase()));
  return <Overlay title="New conversation" eyebrow="Choose someone" onClose={onClose}><label className="command-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people" /></label><div className="new-chat-list">{people.map((person, index) => <button key={person.name} onClick={() => { onCreate(person); onClose(); }}><Avatar initials={person.initials} size="md" accent={index} online={index % 2 === 0} /><div><strong>{person.name}</strong><span>{person.job}</span></div><UserPlus size={17} /></button>)}</div></Overlay>;
}

export function CallOverlay({ call, onEnd }: { call: { conversationId: string; name: string; initials: string; accent: number; kind: "voice" | "video" } | null; onEnd: () => void }) {
  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  useEffect(() => { if (call) { setMuted(false); setVideoEnabled(call.kind === "video"); } }, [call]);
  return <AnimatePresence>{call ? <motion.div className="call-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="call-orbit"><i /><i /><Avatar initials={call.initials} size="xl" accent={call.accent} online /></div><span>{call.kind === "video" && videoEnabled ? "Video call connected" : "Voice call connected"}</span><h2>{call.name}</h2><p>{muted ? "Microphone muted" : "Secure audio active"}</p><div><button className={cn(muted && "selected")} onClick={() => setMuted((value) => !value)} aria-label={muted ? "Unmute microphone" : "Mute microphone"}>{muted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button><button className="end" onClick={onEnd} aria-label="End call"><Phone size={21} /></button><button className={cn(!videoEnabled && "selected")} onClick={() => setVideoEnabled((value) => !value)} aria-label={videoEnabled ? "Turn off video" : "Turn on video"}>{videoEnabled ? <Video size={20} /> : <MessageSquare size={20} />}</button></div></motion.div> : null}</AnimatePresence>;
}
