"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import {
  Conversation,
  Game,
  ModalName,
  NotificationItem,
  ShufSettings,
  Suitor,
  View,
  autoReplies,
  initialActivity,
  initialConversations,
  initialNotifications,
} from "./data";
import { uid, currentTime, usePersistedState, cn } from "./ui";
import { AppHeader, BottomNav, MobileDrawer, Sidebar } from "./shell";
import { ActivityView, DiscoverView, PlayView, ProfileView } from "./views";
import { ChatView } from "./chat";
import { BalloonGame, BlindGame, PanelGame } from "./games";
import {
  AboutModal,
  AchievementsModal,
  CallOverlay,
  NewChatModal,
  NotificationModal,
  SearchModal,
  SettingsModal,
} from "./modals";
import {
  Circle,
  CirclesView,
  CreatePostModal,
  PostKind,
  ReactionKey,
  SocialHomeView,
  SocialPost,
  initialCircles,
  initialSocialPosts,
} from "./social";

const defaultSettings: ShufSettings = {
  theme: "system",
  sound: true,
  motion: true,
  messagePreview: true,
  lowData: false,
  language: "all",
};

export default function ShufApp() {
  const [view, setView] = useState<View>("home");
  const [game, setGame] = useState<Game>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modal, setModal] = useState<ModalName>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [typingId, setTypingId] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>("hana");
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);
  const [createKind, setCreateKind] = useState<PostKind | null>(null);
  const [call, setCall] = useState<{ conversationId: string; name: string; initials: string; accent: number; kind: "voice" | "video" } | null>(null);
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [discoverFlag, setDiscoverFlag] = useState<"all" | "green" | "red" | "wild">("all");

  const [points, setPoints] = usePersistedState("shuf-points-v2", 1840);
  const [conversations, setConversations] = usePersistedState<Conversation[]>("shuf-conversations-v2", initialConversations);
  const [notifications, setNotifications] = usePersistedState<NotificationItem[]>("shuf-notifications-v2", initialNotifications);
  const [activity, setActivity] = usePersistedState("shuf-activity-v2", initialActivity);
  const [followed, setFollowed] = usePersistedState<string[]>("shuf-followed-v3", ["Selam"]);
  const [savedStories, setSavedStories] = usePersistedState<number[]>("shuf-saved-stories-v2", []);
  const [socialPosts, setSocialPosts] = usePersistedState<SocialPost[]>("shuf-social-posts-v1", initialSocialPosts);
  const [circles] = usePersistedState<Circle[]>("shuf-circles-v1", initialCircles);
  const [joinedCircles, setJoinedCircles] = usePersistedState<string[]>("shuf-joined-circles-v1", ["tech-builders", "addis-weekend"]);
  const [mutedAuthors, setMutedAuthors] = usePersistedState<string[]>("shuf-muted-authors-v1", []);
  const [blockedAuthors, setBlockedAuthors] = usePersistedState<string[]>("shuf-blocked-authors-v1", []);
  const [settings, setSettings] = usePersistedState<ShufSettings>("shuf-settings-v3", defaultSettings);
  const resolvedSettings = { ...defaultSettings, ...settings };

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast((current) => current === message ? null : current), 2600);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.shufTheme = resolvedSettings.theme === "system" ? (systemDark ? "dark" : "light") : resolvedSettings.theme;
    root.dataset.shufMotion = resolvedSettings.motion ? "full" : "reduced";
    root.dataset.shufData = resolvedSettings.lowData ? "low" : "full";
  }, [resolvedSettings.lowData, resolvedSettings.motion, resolvedSettings.theme]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setModal("search");
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        setCreateKind("text");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const unreadMessages = conversations.reduce((total, item) => total + item.unread, 0);
  const unreadNotifications = notifications.filter((item) => !item.read).length;

  const navigate = useCallback((nextView: View) => {
    setGame(null);
    setView(nextView);
    window.scrollTo({ top: 0, behavior: resolvedSettings.motion ? "smooth" : "auto" });
  }, [resolvedSettings.motion]);

  const openGame = useCallback((nextGame: Exclude<Game, null>) => {
    setGame(nextGame);
    setView("play");
    window.scrollTo({ top: 0, behavior: resolvedSettings.motion ? "smooth" : "auto" });
  }, [resolvedSettings.motion]);

  const openCreate = useCallback((kind: PostKind = "text") => setCreateKind(kind), []);

  const onComplete = useCallback((earned: number) => {
    setPoints((current) => current + earned);
    showToast(`+${earned} Shuf points earned`);
  }, [setPoints, showToast]);

  const share = useCallback(async (title: string, text: string) => {
    try {
      if (navigator.share) await navigator.share({ title, text });
      else {
        await navigator.clipboard.writeText(`${title}\n${text}`);
        showToast("Result copied to clipboard");
      }
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
        return current.map((item) => item.id === id ? {
          ...item,
          preview: prompt,
          time: "now",
          messages: [...item.messages, { id: uid("m"), sender: "me" as const, text: prompt, time: currentTime(), status: "sent" as const }],
        } : item);
      }
      const conversation: Conversation = {
        id,
        name: person.name,
        initials: person.initials,
        accent: Math.abs(person.name.length) % 6,
        role: `${person.job} · New connection`,
        preview: prompt ?? "You connected through Shuf.",
        time: "now",
        online: true,
        unread: 0,
        pinned: false,
        muted: false,
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
    setConversations((current) => current.map((item) => item.id === id ? {
      ...item,
      preview: text,
      time: "now",
      unread: 0,
      messages: [...item.messages, { id: uid("m"), sender: "me", text, time: sentAt, status: "sent" }],
    } : item));
    setTypingId(id);
    window.setTimeout(() => {
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      setConversations((current) => current.map((item) => item.id === id ? {
        ...item,
        preview: reply,
        time: "now",
        unread: selectedConversation === id && view === "chat" ? 0 : item.unread + 1,
        messages: item.messages
          .map((message) => message.sender === "me" ? { ...message, status: "read" as const } : message)
          .concat({ id: uid("m"), sender: "them", text: reply, time: currentTime() }),
      } : item));
      setTypingId(null);
      if (!(selectedConversation === id && view === "chat")) {
        setNotifications((current) => [{ id: uid("n"), title: "New message", text: reply, time: "now", read: false, icon: "message" }, ...current]);
      }
    }, 950);
  }, [selectedConversation, setConversations, setNotifications, view]);

  const reactMessage = useCallback((conversationId: string, messageId: string, reaction: string) => {
    setConversations((current) => current.map((conversation) => conversation.id === conversationId ? {
      ...conversation,
      messages: conversation.messages.map((message) => message.id === messageId ? { ...message, reaction: message.reaction === reaction ? undefined : reaction } : message),
    } : conversation));
  }, [setConversations]);

  const attachMessage = useCallback((id: string, kind: "photo" | "file") => {
    const attachment = kind === "photo" ? "Shuf-photo.jpg" : "community-notes.pdf";
    setConversations((current) => current.map((item) => item.id === id ? {
      ...item,
      preview: `Sent ${attachment}`,
      time: "now",
      messages: [...item.messages, { id: uid("m"), sender: "me", text: kind === "photo" ? "Shared a photo" : "Shared a file", attachment, time: currentTime(), status: "sent" }],
    } : item));
    showToast(kind === "photo" ? "Photo attached" : "File attached");
  }, [setConversations, showToast]);

  const sendVoice = useCallback((id: string) => {
    setConversations((current) => current.map((item) => item.id === id ? {
      ...item,
      preview: "Voice note · 0:08",
      time: "now",
      messages: [...item.messages, { id: uid("m"), sender: "me", text: "Voice note · 0:08  ▶", time: currentTime(), status: "sent" }],
    } : item));
    showToast("Voice note sent");
  }, [setConversations, showToast]);

  const toggleConversation = useCallback((id: string, key: "pinned" | "muted") => {
    setConversations((current) => current.map((item) => item.id === id ? { ...item, [key]: !item[key] } : item));
    showToast(key === "pinned" ? "Pin preference updated" : "Notification preference updated");
  }, [setConversations, showToast]);

  const clearConversation = useCallback((id: string) => {
    setConversations((current) => current.map((item) => item.id === id ? {
      ...item,
      preview: "Conversation cleared",
      messages: [{ id: uid("sys"), sender: "system", text: "Conversation history cleared", time: "Today" }],
    } : item));
    showToast("Conversation cleared");
  }, [setConversations, showToast]);

  const toggleFollowName = useCallback((name: string) => {
    setFollowed((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
    showToast(followed.includes(name) ? `Unfollowed ${name}` : `Following ${name}`);
  }, [followed, setFollowed, showToast]);

  const toggleFollow = useCallback((person: Suitor) => toggleFollowName(person.name), [toggleFollowName]);

  const toggleJoinCircle = useCallback((id: string) => {
    const circle = circles.find((item) => item.id === id);
    setJoinedCircles((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    showToast(joinedCircles.includes(id) ? `Left ${circle?.name ?? "Circle"}` : `Joined ${circle?.name ?? "Circle"}`);
  }, [circles, joinedCircles, setJoinedCircles, showToast]);

  const openCircles = useCallback((id?: string) => {
    setSelectedCircleId(id && id !== "all" ? id : null);
    navigate("circles");
  }, [navigate]);

  const createSocialPost = useCallback((post: SocialPost) => {
    setSocialPosts((current) => [post, ...current]);
    if (post.circleId) setJoinedCircles((current) => current.includes(post.circleId as string) ? current : [...current, post.circleId as string]);
    setActivity((current) => [{ id: uid("activity"), icon: Check, title: "Post published", text: post.circleName ? `Shared in ${post.circleName}` : "Shared with your public feed", time: "now", tone: "green", read: false, target: "home" as View }, ...current]);
    showToast("Your post is live on Shuf");
  }, [setActivity, setJoinedCircles, setSocialPosts, showToast]);

  const reactToPost = useCallback((postId: string, reaction: ReactionKey) => {
    setSocialPosts((current) => current.map((post) => {
      if (post.id !== postId) return post;
      const nextReactions = { ...post.reactions };
      if (post.myReaction === reaction) {
        nextReactions[reaction] = Math.max(0, nextReactions[reaction] - 1);
        return { ...post, reactions: nextReactions, myReaction: undefined };
      }
      if (post.myReaction) nextReactions[post.myReaction] = Math.max(0, nextReactions[post.myReaction] - 1);
      nextReactions[reaction] += 1;
      return { ...post, reactions: nextReactions, myReaction: reaction };
    }));
  }, [setSocialPosts]);

  const commentOnPost = useCallback((postId: string, text: string, parentId?: string) => {
    setSocialPosts((current) => current.map((post) => post.id === postId ? {
      ...post,
      comments: [...post.comments, { id: uid("comment"), author: "Mahir Aman", initials: "MA", text, time: "now", likes: 0, parentId }],
    } : post));
    showToast(parentId ? "Reply posted" : "Comment posted");
  }, [setSocialPosts, showToast]);

  const voteOnPost = useCallback((postId: string, optionId: string) => {
    setSocialPosts((current) => current.map((post) => {
      if (post.id !== postId || !post.poll) return post;
      const previous = post.poll.votedId;
      return {
        ...post,
        poll: {
          ...post.poll,
          votedId: optionId,
          options: post.poll.options.map((option) => ({
            ...option,
            votes: option.id === optionId ? option.votes + (previous === optionId ? 0 : 1) : option.id === previous ? Math.max(0, option.votes - 1) : option.votes,
          })),
        },
      };
    }));
    showToast("Your vote was recorded");
  }, [setSocialPosts, showToast]);

  const savePost = useCallback((postId: string) => {
    let saved = false;
    setSocialPosts((current) => current.map((post) => {
      if (post.id !== postId) return post;
      saved = !post.saved;
      return { ...post, saved };
    }));
    showToast(saved ? "Post saved" : "Post removed from saved items");
  }, [setSocialPosts, showToast]);

  const sharePostToChat = useCallback((post: SocialPost) => {
    const text = `Shared from ${post.author}: ${post.content.slice(0, 120)}${post.content.length > 120 ? "…" : ""}`;
    setConversations((current) => current.map((conversation) => conversation.id === "community" ? {
      ...conversation,
      preview: text,
      time: "now",
      unread: 0,
      messages: [...conversation.messages, { id: uid("m"), sender: "me", text, time: currentTime(), status: "sent" }],
    } : conversation));
    setSelectedConversation("community");
    setView("chat");
    setGame(null);
    showToast("Post sent to Shuf Aftershow");
  }, [setConversations, showToast]);

  const handleSafety = useCallback((post: SocialPost, action: "report" | "mute" | "block") => {
    if (action === "report") {
      setNotifications((current) => [{ id: uid("report"), title: "Report received", text: `Shuf moderators will review the post from ${post.author}.`, time: "now", read: false, icon: "community" }, ...current]);
      showToast("Report sent to the Trust & Safety team");
      return;
    }
    if (action === "mute") {
      setMutedAuthors((current) => current.includes(post.author) ? current : [...current, post.author]);
      showToast(`${post.author} muted`);
      return;
    }
    setBlockedAuthors((current) => current.includes(post.author) ? current : [...current, post.author]);
    showToast(`${post.author} blocked`);
  }, [setBlockedAuthors, setMutedAuthors, setNotifications, showToast]);

  const visibleSocialPosts = socialPosts.filter((post) => !mutedAuthors.includes(post.author) && !blockedAuthors.includes(post.author));

  let content;
  if (game === "balloon") content = <BalloonGame onBack={() => setGame(null)} onComplete={onComplete} onShare={share} onStartChat={ensureConversation} />;
  else if (game === "blind") content = <BlindGame onBack={() => setGame(null)} onComplete={onComplete} onStartChat={ensureConversation} />;
  else if (game === "panel") content = <PanelGame onBack={() => setGame(null)} onComplete={onComplete} onShare={share} savedStories={savedStories} onToggleSave={(index) => {
    setSavedStories((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
    showToast(savedStories.includes(index) ? "Bookmark removed" : "Story saved");
  }} />;
  else if (view === "home") content = <SocialHomeView
    posts={visibleSocialPosts}
    circles={circles}
    joinedCircles={joinedCircles}
    followedCreators={followed}
    language={resolvedSettings.language}
    lowData={resolvedSettings.lowData}
    onLanguage={(language) => setSettings((current) => ({ ...defaultSettings, ...current, language }))}
    onToggleLowData={() => setSettings((current) => ({ ...defaultSettings, ...current, lowData: !resolvedSettings.lowData }))}
    onCreate={openCreate}
    onReact={reactToPost}
    onComment={commentOnPost}
    onVote={voteOnPost}
    onShare={sharePostToChat}
    onSave={savePost}
    onFollow={toggleFollowName}
    onJoinCircle={toggleJoinCircle}
    onOpenCircles={openCircles}
    onOpenGame={openGame}
    onStartChat={ensureConversation}
    onSafety={handleSafety}
    onToast={showToast}
  />;
  else if (view === "circles") content = <CirclesView circles={circles} joined={joinedCircles} selectedId={selectedCircleId} onSelect={setSelectedCircleId} onJoin={toggleJoinCircle} onCreate={() => showToast("Circle creation applications are now open")} onToast={showToast} />;
  else if (view === "play") content = <PlayView onOpenGame={openGame} onToast={showToast} />;
  else if (view === "discover") content = <DiscoverView query={discoverQuery} flag={discoverFlag} followed={followed} onQuery={setDiscoverQuery} onFlag={setDiscoverFlag} onFollow={toggleFollow} onToast={showToast} onStartChat={ensureConversation} onOpenGame={openGame} />;
  else if (view === "chat") content = <ChatView conversations={conversations} selectedId={selectedConversation} typingId={typingId} onSelect={selectConversation} onNewChat={() => setModal("new-chat")} onSend={sendMessage} onReact={reactMessage} onAttach={attachMessage} onVoice={sendVoice} onCall={(conversation, kind) => setCall({ conversationId: conversation.id, name: conversation.name, initials: conversation.initials, accent: conversation.accent, kind })} onTogglePinned={(id) => toggleConversation(id, "pinned")} onToggleMuted={(id) => toggleConversation(id, "muted")} onClear={clearConversation} onBackMobile={() => setSelectedConversation(null)} onToast={showToast} />;
  else if (view === "activity") content = <ActivityView activity={activity} onMarkAllRead={() => {
    setActivity((current) => current.map((item) => ({ ...item, read: true })));
    showToast("Activity marked as read");
  }} onOpenItem={(id, target) => {
    setActivity((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
    navigate(target);
  }} />;
  else content = <ProfileView points={points} onSettings={() => setModal("settings")} onAchievements={() => setModal("achievements")} onToast={showToast} />;

  return (
    <div className="app-root">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <Sidebar view={view} unreadMessages={unreadMessages} onNavigate={navigate} onCreate={() => openCreate("text")} onSettings={() => setModal("settings")} onAbout={() => setModal("about")} onAchievements={() => setModal("achievements")} />
      <div className="app-column">
        <AppHeader view={view} game={game} unreadNotifications={unreadNotifications} onBack={() => setGame(null)} onMenu={() => setDrawerOpen(true)} onSearch={() => setModal("search")} onNotifications={() => setModal("notifications")} onProfile={() => navigate("profile")} onCreate={() => openCreate("text")} />
        <main className={cn("content-area", game && "game-content", view === "chat" && !game && "chat-content", (view === "home" || view === "circles") && !game && "social-content")}>{content}</main>
      </div>
      <BottomNav view={view} unreadMessages={unreadMessages} onNavigate={navigate} onCreate={() => openCreate("text")} />
      <MobileDrawer open={drawerOpen} view={view} unreadMessages={unreadMessages} onClose={() => setDrawerOpen(false)} onNavigate={navigate} onCreate={() => openCreate("text")} onSettings={() => setModal("settings")} onAbout={() => setModal("about")} />
      <AnimatePresence>
        {modal === "notifications" ? <NotificationModal notifications={notifications} onRead={(id) => setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item))} onReadAll={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))} onOpenChat={() => navigate("chat")} onClose={() => setModal(null)} /> : null}
        {modal === "settings" ? <SettingsModal settings={resolvedSettings} onChange={setSettings} onClose={() => setModal(null)} /> : null}
        {modal === "about" ? <AboutModal onClose={() => setModal(null)} /> : null}
        {modal === "achievements" ? <AchievementsModal onClose={() => setModal(null)} onToast={showToast} /> : null}
        {modal === "search" ? <SearchModal onClose={() => setModal(null)} onNavigate={navigate} onOpenGame={openGame} onStartChat={ensureConversation} /> : null}
        {modal === "new-chat" ? <NewChatModal existingIds={conversations.map((item) => item.id)} onCreate={ensureConversation} onClose={() => setModal(null)} /> : null}
        {createKind ? <CreatePostModal initialKind={createKind} circles={circles} onCreate={createSocialPost} onClose={() => setCreateKind(null)} /> : null}
      </AnimatePresence>
      <CallOverlay call={call} onEnd={() => { setCall(null); showToast("Call ended"); }} />
      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 10, x: "-50%" }}><Check size={17} />{toast}<strong>{points.toLocaleString()} points</strong></motion.div> : null}</AnimatePresence>
    </div>
  );
}
