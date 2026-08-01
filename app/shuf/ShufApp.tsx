"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Conversation, Game, ModalName, NotificationItem, Suitor, ThemeMode, View, autoReplies,
  initialActivity, initialConversations, initialNotifications,
} from "./data";
import { uid, currentTime, usePersistedState, cn } from "./ui";
import { AppHeader, BottomNav, MobileDrawer, Sidebar } from "./shell";
import { ActivityView, DiscoverView, HomeView, PlayView, ProfileView } from "./views";
import { ChatView } from "./chat";
import { BalloonGame, BlindGame, PanelGame } from "./games";
import {
  AboutModal, AchievementsModal, CallOverlay, NewChatModal, NotificationModal, SearchModal, SettingsModal,
} from "./modals";

export default function ShufApp() {
  const [view, setView] = useState<View>("home");
  const [game, setGame] = useState<Game>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modal, setModal] = useState<ModalName>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [typingId, setTypingId] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>("hana");
  const [call, setCall] = useState<{ conversationId: string; name: string; initials: string; accent: number; kind: "voice" | "video" } | null>(null);
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [discoverFlag, setDiscoverFlag] = useState<"all" | "green" | "red" | "wild">("all");

  const [points, setPoints] = usePersistedState("shuf-points-v2", 1840);
  const [conversations, setConversations] = usePersistedState<Conversation[]>("shuf-conversations-v2", initialConversations);
  const [notifications, setNotifications] = usePersistedState<NotificationItem[]>("shuf-notifications-v2", initialNotifications);
  const [activity, setActivity] = usePersistedState("shuf-activity-v2", initialActivity);
  const [followed, setFollowed] = usePersistedState<string[]>("shuf-followed-v2", []);
  const [savedStories, setSavedStories] = usePersistedState<number[]>("shuf-saved-stories-v2", []);
  const [liked, setLiked] = usePersistedState("shuf-liked-highlight-v2", false);
  const [pollVote, setPollVote] = usePersistedState<"romantic" | "controlling" | null>("shuf-poll-v2", null);
  const [settings, setSettings] = usePersistedState<{ theme: ThemeMode; sound: boolean; motion: boolean; messagePreview: boolean }>("shuf-settings-v2", { theme: "system", sound: true, motion: true, messagePreview: true });

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast((current) => current === message ? null : current), 2600);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.shufTheme = settings.theme === "system" ? (systemDark ? "dark" : "light") : settings.theme;
    root.dataset.shufMotion = settings.motion ? "full" : "reduced";
  }, [settings]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setModal("search"); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const unreadMessages = conversations.reduce((total, item) => total + item.unread, 0);
  const unreadNotifications = notifications.filter((item) => !item.read).length;

  const navigate = useCallback((nextView: View) => {
    setGame(null);
    setView(nextView);
    if (nextView !== "chat") setSelectedConversation((current) => current);
    window.scrollTo({ top: 0, behavior: settings.motion ? "smooth" : "auto" });
  }, [settings.motion]);

  const openGame = useCallback((nextGame: Exclude<Game, null>) => {
    setGame(nextGame);
    setView("play");
    window.scrollTo({ top: 0, behavior: settings.motion ? "smooth" : "auto" });
  }, [settings.motion]);

  const onComplete = useCallback((earned: number) => {
    setPoints((current) => current + earned);
    showToast(`+${earned} Shuf points earned`);
  }, [setPoints, showToast]);

  const share = useCallback(async (title: string, text: string) => {
    try {
      if (navigator.share) await navigator.share({ title, text });
      else { await navigator.clipboard.writeText(`${title}\n${text}`); showToast("Result copied to clipboard"); }
    } catch {
      showToast("Sharing was cancelled");
    }
  }, [showToast]);

  const markConversationRead = useCallback((id: string) => {
    setConversations((current) => current.map((item) => item.id === id ? { ...item, unread: 0 } : item));
  }, [setConversations]);

  const selectConversation = useCallback((id: string) => {
    setSelectedConversation(id);
    markConversationRead(id);
  }, [markConversationRead]);

  const ensureConversation = useCallback((person: Suitor, prompt?: string) => {
    const id = person.name.toLowerCase();
    setConversations((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        if (!prompt) return current;
        return current.map((item) => item.id === id ? { ...item, preview: prompt, time: "now", messages: [...item.messages, { id: uid("m"), sender: "me" as const, text: prompt, time: currentTime(), status: "sent" as const }] } : item);
      }
      const conversation: Conversation = {
        id, name: person.name, initials: person.initials, accent: Math.abs(person.name.length) % 6,
        role: `${person.job} · New connection`, preview: prompt ?? "You connected through Shuf.", time: "now",
        online: true, unread: 0, pinned: false, muted: false,
        messages: [
          { id: uid("sys"), sender: "system", text: "You connected through Shuf", time: "Today" },
          ...(prompt ? [{ id: uid("m"), sender: "me" as const, text: prompt, time: currentTime(), status: "sent" as const }] : []),
        ],
      };
      return [conversation, ...current];
    });
    setSelectedConversation(id);
    setView("chat");
    setGame(null);
    showToast(`Conversation with ${person.name} opened`);
  }, [setConversations, showToast]);

  const sendMessage = useCallback((id: string, text: string) => {
    const sentAt = currentTime();
    setConversations((current) => current.map((item) => item.id === id ? { ...item, preview: text, time: "now", unread: 0, messages: [...item.messages, { id: uid("m"), sender: "me", text, time: sentAt, status: "sent" }] } : item));
    setTypingId(id);
    window.setTimeout(() => {
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      setConversations((current) => current.map((item) => item.id === id ? { ...item, preview: reply, time: "now", unread: selectedConversation === id && view === "chat" ? 0 : item.unread + 1, messages: item.messages.map((message) => message.sender === "me" ? { ...message, status: "read" as const } : message).concat({ id: uid("m"), sender: "them", text: reply, time: currentTime() }) } : item));
      setTypingId(null);
      if (!(selectedConversation === id && view === "chat")) setNotifications((current) => [{ id: uid("n"), title: "New message", text: reply, time: "now", read: false, icon: "message" }, ...current]);
    }, 950);
  }, [selectedConversation, setConversations, setNotifications, view]);

  const reactMessage = useCallback((conversationId: string, messageId: string, reaction: string) => {
    setConversations((current) => current.map((conversation) => conversation.id === conversationId ? { ...conversation, messages: conversation.messages.map((message) => message.id === messageId ? { ...message, reaction: message.reaction === reaction ? undefined : reaction } : message) } : conversation));
  }, [setConversations]);

  const attachMessage = useCallback((id: string, kind: "photo" | "file") => {
    const attachment = kind === "photo" ? "Shuf-photo.jpg" : "date-ideas.pdf";
    setConversations((current) => current.map((item) => item.id === id ? { ...item, preview: `Sent ${attachment}`, time: "now", messages: [...item.messages, { id: uid("m"), sender: "me", text: kind === "photo" ? "Shared a photo" : "Shared a file", attachment, time: currentTime(), status: "sent" }] } : item));
    showToast(kind === "photo" ? "Photo attached" : "File attached");
  }, [setConversations, showToast]);

  const sendVoice = useCallback((id: string) => {
    setConversations((current) => current.map((item) => item.id === id ? { ...item, preview: "Voice note · 0:08", time: "now", messages: [...item.messages, { id: uid("m"), sender: "me", text: "Voice note · 0:08  ▶", time: currentTime(), status: "sent" }] } : item));
    showToast("Voice note sent");
  }, [setConversations, showToast]);

  const toggleConversation = useCallback((id: string, key: "pinned" | "muted") => {
    setConversations((current) => current.map((item) => item.id === id ? { ...item, [key]: !item[key] } : item));
    showToast(key === "pinned" ? "Pin preference updated" : "Notification preference updated");
  }, [setConversations, showToast]);

  const clearConversation = useCallback((id: string) => {
    setConversations((current) => current.map((item) => item.id === id ? { ...item, preview: "Conversation cleared", messages: [{ id: uid("sys"), sender: "system", text: "Conversation history cleared", time: "Today" }] } : item));
    showToast("Conversation cleared");
  }, [setConversations, showToast]);

  const toggleFollow = useCallback((person: Suitor) => {
    setFollowed((current) => current.includes(person.name) ? current.filter((name) => name !== person.name) : [...current, person.name]);
    showToast(followed.includes(person.name) ? `Unfollowed ${person.name}` : `Following ${person.name}`);
  }, [followed, setFollowed, showToast]);

  const content = useMemo(() => {
    if (game === "balloon") return <BalloonGame onBack={() => setGame(null)} onComplete={onComplete} onShare={share} onStartChat={ensureConversation} />;
    if (game === "blind") return <BlindGame onBack={() => setGame(null)} onComplete={onComplete} onStartChat={ensureConversation} />;
    if (game === "panel") return <PanelGame onBack={() => setGame(null)} onComplete={onComplete} onShare={share} savedStories={savedStories} onToggleSave={(index) => { setSavedStories((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]); showToast(savedStories.includes(index) ? "Bookmark removed" : "Story saved"); }} />;
    if (view === "home") return <HomeView points={points} liked={liked} pollVote={pollVote} onLike={() => { setLiked((value) => !value); showToast(liked ? "Like removed" : "Highlight liked"); }} onPoll={(vote) => { setPollVote(vote); showToast("Vote recorded"); }} onShare={share} onOpenGame={openGame} onNavigate={navigate} onStartChat={ensureConversation} />;
    if (view === "play") return <PlayView onOpenGame={openGame} onToast={showToast} />;
    if (view === "discover") return <DiscoverView query={discoverQuery} flag={discoverFlag} followed={followed} onQuery={setDiscoverQuery} onFlag={setDiscoverFlag} onFollow={toggleFollow} onToast={showToast} onStartChat={ensureConversation} onOpenGame={openGame} />;
    if (view === "chat") return <ChatView conversations={conversations} selectedId={selectedConversation} typingId={typingId} onSelect={selectConversation} onNewChat={() => setModal("new-chat")} onSend={sendMessage} onReact={reactMessage} onAttach={attachMessage} onVoice={sendVoice} onCall={(conversation, kind) => setCall({ conversationId: conversation.id, name: conversation.name, initials: conversation.initials, accent: conversation.accent, kind })} onTogglePinned={(id) => toggleConversation(id, "pinned")} onToggleMuted={(id) => toggleConversation(id, "muted")} onClear={clearConversation} onBackMobile={() => setSelectedConversation(null)} onToast={showToast} />;
    if (view === "activity") return <ActivityView activity={activity} onMarkAllRead={() => { setActivity((current) => current.map((item) => ({ ...item, read: true }))); showToast("Activity marked as read"); }} onOpenItem={(id, target) => { setActivity((current) => current.map((item) => item.id === id ? { ...item, read: true } : item)); navigate(target); }} />;
    return <ProfileView points={points} onSettings={() => setModal("settings")} onAchievements={() => setModal("achievements")} onToast={showToast} />;
  }, [activity, attachMessage, clearConversation, conversations, discoverFlag, discoverQuery, ensureConversation, followed, game, liked, navigate, onComplete, openGame, points, pollVote, reactMessage, savedStories, selectConversation, selectedConversation, sendMessage, sendVoice, setActivity, setLiked, setPollVote, setSavedStories, share, showToast, toggleConversation, toggleFollow, typingId, view]);

  return (
    <div className="app-root">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <Sidebar view={view} unreadMessages={unreadMessages} onNavigate={navigate} onSettings={() => setModal("settings")} onAbout={() => setModal("about")} onAchievements={() => setModal("achievements")} />
      <div className="app-column"><AppHeader view={view} game={game} unreadNotifications={unreadNotifications} onBack={() => setGame(null)} onMenu={() => setDrawerOpen(true)} onSearch={() => setModal("search")} onNotifications={() => setModal("notifications")} onProfile={() => navigate("profile")} /><main className={cn("content-area", game && "game-content", view === "chat" && !game && "chat-content")}>{content}</main></div>
      <BottomNav view={view} unreadMessages={unreadMessages} onNavigate={navigate} />
      <MobileDrawer open={drawerOpen} view={view} unreadMessages={unreadMessages} onClose={() => setDrawerOpen(false)} onNavigate={navigate} onSettings={() => setModal("settings")} onAbout={() => setModal("about")} />
      <AnimatePresence>
        {modal === "notifications" ? <NotificationModal notifications={notifications} onRead={(id) => setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item))} onReadAll={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))} onOpenChat={() => navigate("chat")} onClose={() => setModal(null)} /> : null}
        {modal === "settings" ? <SettingsModal settings={settings} onChange={setSettings} onClose={() => setModal(null)} /> : null}
        {modal === "about" ? <AboutModal onClose={() => setModal(null)} /> : null}
        {modal === "achievements" ? <AchievementsModal onClose={() => setModal(null)} onToast={showToast} /> : null}
        {modal === "search" ? <SearchModal onClose={() => setModal(null)} onNavigate={navigate} onOpenGame={openGame} onStartChat={ensureConversation} /> : null}
        {modal === "new-chat" ? <NewChatModal existingIds={conversations.map((item) => item.id)} onCreate={ensureConversation} onClose={() => setModal(null)} /> : null}
      </AnimatePresence>
      <CallOverlay call={call} onEnd={() => { setCall(null); showToast("Call ended"); }} />
      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 10, x: "-50%" }}><Check size={17} />{toast}<strong>{points.toLocaleString()} total</strong></motion.div> : null}</AnimatePresence>
    </div>
  );
}
