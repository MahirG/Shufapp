import {
  ArrowLeft, ArrowRight, Bell, ChevronRight, Crown, Info, Menu, Search, Settings, X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Game, View, bottomNavItems, navItems } from "./data";
import { Avatar, Logo, cn } from "./ui";

export function AppHeader({
  view, game, unreadNotifications, onBack, onMenu, onSearch, onNotifications, onProfile,
}: {
  view: View;
  game: Game;
  unreadNotifications: number;
  onBack: () => void;
  onMenu: () => void;
  onSearch: () => void;
  onNotifications: () => void;
  onProfile: () => void;
}) {
  const title = game
    ? game === "balloon" ? "Pop the Balloon" : game === "blind" ? "Blind Match" : "The Panel"
    : view === "home" ? "Tonight on Shuf" : navItems.find((item) => item.id === view)?.label;
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button mobile-only" onClick={game ? onBack : onMenu} aria-label={game ? "Go back" : "Open menu"}>
          {game ? <ArrowLeft size={20} /> : <Menu size={20} />}
        </button>
        <button className="desktop-brand desktop-only sidebar-logo-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
          <Logo /><span>SHUF</span>
        </button>
        <div><p className="topbar-kicker">{game ? "Interactive mode" : "Live social entertainment"}</p><h1>{title}</h1></div>
      </div>
      <div className="topbar-actions">
        <button className="desktop-only search-field interactive-search" onClick={onSearch} aria-label="Search Shuf">
          <Search size={17} /><span>Search Shuf</span><kbd>⌘ K</kbd>
        </button>
        <button className="icon-button" onClick={onNotifications} aria-label="Notifications">
          <Bell size={19} />{unreadNotifications ? <><span className="notification-dot" /><span className="sr-only">{unreadNotifications} unread notifications</span></> : null}
        </button>
        <button className="avatar-button" onClick={onProfile} aria-label="Open profile"><Avatar initials="MA" size="sm" accent={4} /></button>
      </div>
    </header>
  );
}

export function Sidebar({
  view, unreadMessages, onNavigate, onSettings, onAbout, onAchievements,
}: {
  view: View;
  unreadMessages: number;
  onNavigate: (view: View) => void;
  onSettings: () => void;
  onAbout: () => void;
  onAchievements: () => void;
}) {
  return (
    <aside className="sidebar desktop-only">
      <button className="sidebar-logo sidebar-logo-button" onClick={() => onNavigate("home")}><Logo /><div><strong>SHUF</strong><span>Play. Match. Talk.</span></div></button>
      <nav className="side-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={cn("side-link", view === id && "active")} onClick={() => onNavigate(id)}>
            <Icon size={20} strokeWidth={view === id ? 2.4 : 1.9} /><span>{label}</span>
            {id === "chat" && unreadMessages > 0 ? <b>{unreadMessages}</b> : null}
          </button>
        ))}
      </nav>
      <button className="sidebar-quest sidebar-quest-button" onClick={onAchievements}>
        <span className="quest-icon"><Crown size={20} /></span><p>Weekend quest</p><strong>Play all 3 modes</strong><div className="mini-progress"><span style={{ width: "66%" }} /></div><small>2 of 3 completed</small>
      </button>
      <div className="sidebar-bottom">
        <button className="side-link" onClick={onSettings}><Settings size={20} /><span>Settings</span></button>
        <button className="side-link" onClick={onAbout}><Info size={20} /><span>About Shuf</span></button>
      </div>
    </aside>
  );
}

export function BottomNav({ view, unreadMessages, onNavigate }: { view: View; unreadMessages: number; onNavigate: (view: View) => void }) {
  return (
    <nav className="bottom-nav mobile-only">
      {bottomNavItems.map(({ id, label, icon: Icon }) => (
        <button key={id} className={cn(view === id && "active")} onClick={() => onNavigate(id)}>
          <span><Icon size={21} strokeWidth={view === id ? 2.5 : 1.9} />{id === "chat" && unreadMessages ? <i className="nav-badge">{unreadMessages}</i> : null}</span><small>{label}</small>
        </button>
      ))}
    </nav>
  );
}

export function MobileDrawer({
  open, view, unreadMessages, onClose, onNavigate, onSettings, onAbout,
}: {
  open: boolean;
  view: View;
  unreadMessages: number;
  onClose: () => void;
  onNavigate: (view: View) => void;
  onSettings: () => void;
  onAbout: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.aside className="mobile-drawer" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 360, damping: 34 }} onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head"><div className="sidebar-logo"><Logo /><div><strong>SHUF</strong><span>Play. Match. Talk.</span></div></div><button className="icon-button" onClick={onClose} aria-label="Close menu"><X size={20} /></button></div>
            <button className="drawer-profile" onClick={() => { onNavigate("profile"); onClose(); }}><Avatar initials="MA" size="lg" accent={4} /><div><strong>Mahir Aman</strong><span>@mahir · Level 8</span></div><ChevronRight size={18} /></button>
            <nav className="side-nav">
              {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={cn("side-link", id === view && "active")} onClick={() => { onNavigate(id); onClose(); }}><Icon size={20} /><span>{label}</span>{id === "chat" && unreadMessages ? <b>{unreadMessages}</b> : null}</button>)}
            </nav>
            <div className="drawer-utility"><button onClick={() => { onSettings(); onClose(); }}><Settings size={17} />Settings</button><button onClick={() => { onAbout(); onClose(); }}><Info size={17} />About</button></div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ModeCard({ item, onOpen, featured = false }: { item: { id: "balloon" | "blind" | "panel"; label: string; title: string; copy: string; icon: typeof Crown; meta: string; players: string; className: string }; onOpen: () => void; featured?: boolean }) {
  const Icon = item.icon;
  return (
    <motion.button className={cn("mode-card", item.className, featured && "featured")} onClick={onOpen} whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }}>
      <div className="mode-card-glow" /><div className="mode-card-top"><span className="pill">{item.label}</span><span className="mode-live"><i /> Live</span></div><div className="mode-symbol"><Icon size={featured ? 34 : 28} strokeWidth={1.8} /></div><div className="mode-copy"><h3>{item.title}</h3><p>{item.copy}</p></div><div className="mode-footer"><span>{item.meta}</span><span>{item.players}</span><b><ArrowRight size={18} /></b></div>
    </motion.button>
  );
}
