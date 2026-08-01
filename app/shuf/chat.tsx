import {
  ArrowLeft, BellOff, Check, CheckCheck, ImagePlus, MessageSquare, Mic, MoreHorizontal,
  Paperclip, Phone, Pin, Plus, Search, Send, Smile, Sparkles, Trash2, UserPlus, Video, Volume2, VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Conversation } from "./data";
import { Avatar, Pill, cn } from "./ui";

type Toast = (message: string) => void;

export function ChatView({
  conversations, selectedId, typingId, onSelect, onNewChat, onSend, onReact, onAttach, onVoice,
  onCall, onTogglePinned, onToggleMuted, onClear, onBackMobile, onToast,
}: {
  conversations: Conversation[];
  selectedId: string | null;
  typingId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onSend: (id: string, text: string) => void;
  onReact: (conversationId: string, messageId: string, reaction: string) => void;
  onAttach: (id: string, kind: "photo" | "file") => void;
  onVoice: (id: string) => void;
  onCall: (conversation: Conversation, kind: "voice" | "video") => void;
  onTogglePinned: (id: string) => void;
  onToggleMuted: (id: string) => void;
  onClear: (id: string) => void;
  onBackMobile: () => void;
  onToast: Toast;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "online">("all");
  const [draft, setDraft] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const selected = conversations.find((item) => item.id === selectedId) ?? null;

  useEffect(() => { setDraft(""); setEmojiOpen(false); setMenuOpen(false); }, [selectedId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selected?.messages.length, typingId]);

  const filtered = useMemo(() => conversations
    .filter((item) => filter === "all" || (filter === "unread" ? item.unread > 0 : item.online))
    .filter((item) => `${item.name} ${item.role} ${item.preview}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned)), [conversations, filter, query]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!selected || !draft.trim()) return;
    onSend(selected.id, draft.trim());
    setDraft("");
    setEmojiOpen(false);
  };

  const onComposerKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); }
  };

  const voiceClick = () => {
    if (!selected) return;
    if (recording) { onVoice(selected.id); setRecording(false); }
    else { setRecording(true); window.setTimeout(() => setRecording(false), 12000); }
  };

  return (
    <section className={cn("chat-shell", selected && "has-thread")}>
      <aside className="chat-sidebar">
        <div className="chat-sidebar-head"><div><Pill icon={MessageSquare}>Shuf chat</Pill><h2>Messages</h2><p>Continue the chemistry after every round.</p></div><button className="new-chat-button" onClick={onNewChat} aria-label="New chat"><Plus size={19} /></button></div>
        <label className="chat-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations" /><span className="sr-only">Search conversations</span></label>
        <div className="chat-filter-row">{(["all", "unread", "online"] as const).map((item) => <button key={item} className={cn(filter === item && "selected")} onClick={() => setFilter(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div>
        <div className="conversation-list">
          {filtered.map((conversation) => (
            <button key={conversation.id} className={cn("conversation-item", selectedId === conversation.id && "active")} onClick={() => onSelect(conversation.id)}>
              <Avatar initials={conversation.initials} size="md" accent={conversation.accent} online={conversation.online} />
              <span className="conversation-copy"><span><strong>{conversation.name}</strong><time>{conversation.time}</time></span><small>{typingId === conversation.id ? "typing…" : conversation.preview}</small></span>
              <span className="conversation-signals">{conversation.pinned ? <Pin size={12} /> : null}{conversation.muted ? <BellOff size={12} /> : null}{conversation.unread ? <b>{conversation.unread}</b> : null}</span>
            </button>
          ))}
          {!filtered.length ? <div className="chat-empty-list"><Search size={22} /><strong>No conversations found</strong><button onClick={() => { setQuery(""); setFilter("all"); }}>Reset filters</button></div> : null}
        </div>
      </aside>

      <div className="chat-thread">
        {selected ? (
          <>
            <header className="thread-head">
              <button className="mobile-thread-back mobile-only" onClick={onBackMobile} aria-label="Back to conversations"><ArrowLeft size={20} /></button>
              <button className="thread-person" onClick={() => onToast(`${selected.name} · ${selected.role}`)}><Avatar initials={selected.initials} size="md" accent={selected.accent} online={selected.online} /><span><strong>{selected.name}</strong><small>{selected.online ? "Online now" : selected.role}</small></span></button>
              <div className="thread-actions"><button onClick={() => onCall(selected, "voice")} aria-label="Voice call"><Phone size={18} /></button><button onClick={() => onCall(selected, "video")} aria-label="Video call"><Video size={18} /></button><div className="thread-menu"><button onClick={() => setMenuOpen((value) => !value)} aria-label="Conversation menu"><MoreHorizontal size={19} /></button><AnimatePresence>{menuOpen ? <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><button onClick={() => { onTogglePinned(selected.id); setMenuOpen(false); }}><Pin size={15} />{selected.pinned ? "Unpin" : "Pin"}</button><button onClick={() => { onToggleMuted(selected.id); setMenuOpen(false); }}>{selected.muted ? <Volume2 size={15} /> : <VolumeX size={15} />}{selected.muted ? "Unmute" : "Mute"}</button><button onClick={() => { onClear(selected.id); setMenuOpen(false); }}><Trash2 size={15} />Clear chat</button></motion.div> : null}</AnimatePresence></div></div>
            </header>
            <div className="messages-scroll">
              <div className="thread-day">Today</div>
              {selected.messages.map((message) => message.sender === "system" ? <div className="system-message" key={message.id}><Sparkles size={13} />{message.text}</div> : (
                <div className={cn("message-row", message.sender === "me" && "mine")} key={message.id}>
                  {message.sender === "them" ? <Avatar initials={selected.initials} size="sm" accent={selected.accent} /> : null}
                  <div className="message-cluster">
                    <motion.div className="message-bubble" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onDoubleClick={() => onReact(selected.id, message.id, "❤️")}>
                      {message.attachment ? <span className="attachment-pill"><Paperclip size={14} />{message.attachment}</span> : null}<p>{message.text}</p>
                      {message.reaction ? <button className="message-reaction" onClick={() => onReact(selected.id, message.id, message.reaction ?? "❤️")}>{message.reaction}</button> : null}
                    </motion.div>
                    <div className="message-meta"><time>{message.time}</time>{message.sender === "me" ? message.status === "read" ? <CheckCheck size={13} /> : <Check size={13} /> : null}<span className="quick-reactions"><button onClick={() => onReact(selected.id, message.id, "❤️")}>❤️</button><button onClick={() => onReact(selected.id, message.id, "😂")}>😂</button><button onClick={() => onReact(selected.id, message.id, "✨")}>✨</button></span></div>
                  </div>
                </div>
              ))}
              {typingId === selected.id ? <div className="message-row"><Avatar initials={selected.initials} size="sm" accent={selected.accent} /><div className="typing-bubble"><i /><i /><i /></div></div> : null}
              <div ref={bottomRef} />
            </div>
            <form className="composer" onSubmit={submit}>
              <div className="composer-tools"><button type="button" onClick={() => onAttach(selected.id, "file")} aria-label="Attach file"><Paperclip size={19} /></button><button type="button" onClick={() => onAttach(selected.id, "photo")} aria-label="Attach photo"><ImagePlus size={19} /></button><button type="button" onClick={() => setEmojiOpen((value) => !value)} aria-label="Emoji picker"><Smile size={19} /></button></div>
              <div className="composer-input"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={onComposerKey} placeholder={recording ? "Recording voice note… tap mic to send" : `Message ${selected.name}`} rows={1} />{emojiOpen ? <div className="emoji-popover">{["❤️","😂","✨","🔥","😄","👀","🎉","🤝"].map((emoji) => <button type="button" key={emoji} onClick={() => { setDraft((text) => `${text}${emoji}`); setEmojiOpen(false); }}>{emoji}</button>)}</div> : null}</div>
              {draft.trim() ? <button className="send-button" type="submit" aria-label="Send message"><Send size={19} /></button> : <button className={cn("mic-button", recording && "recording")} type="button" onClick={voiceClick} aria-label={recording ? "Send voice note" : "Record voice note"}><Mic size={19} /></button>}
            </form>
          </>
        ) : (
          <div className="chat-welcome"><div className="chat-welcome-orb"><MessageSquare size={38} /></div><Pill icon={Sparkles}>Modern messaging</Pill><h2>Choose a conversation.</h2><p>Send messages, reactions, files and voice notes—or start a new chat from any Shuf match.</p><button className="primary-button" onClick={onNewChat}><UserPlus size={17} />Start a new chat</button></div>
        )}
      </div>
    </section>
  );
}
