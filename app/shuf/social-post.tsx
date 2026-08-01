"use client";

import { BadgeCheck, BellRing, BookOpen, CalendarDays, Camera, Check, ChevronRight, Flag, Globe2, Heart, Languages, MapPin, MessageCircle, MessageSquare, Mic2, MoreHorizontal, Play, Plus, Radio, Send, ShieldCheck, Sparkles, Ticket, UserMinus, UserPlus, Volume2, WifiOff, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useState } from "react";
import { FeedLanguage, Game } from "./data";
import { Avatar, Pill, cn } from "./ui";
import { Circle, PostKind, ReactionKey, SocialComment, SocialPost, compact, languageOptions, reactionMeta } from "./social-model";

export function LanguageFilter({ value, onChange }: { value: FeedLanguage; onChange: (value: FeedLanguage) => void }) {
  return (
    <div className="language-filter" aria-label="Filter feed by language">
      {languageOptions.map((option) => (
        <button key={option.id} className={cn(value === option.id && "active")} onClick={() => onChange(option.id)} title={option.label}>
          {option.native}
        </button>
      ))}
    </div>
  );
}

export function FeedComposer({ onCreate }: { onCreate: (kind?: PostKind) => void }) {
  return (
    <section className="feed-composer social-surface">
      <div className="feed-composer-main">
        <Avatar initials="MA" size="md" accent={4} online />
        <button onClick={() => onCreate("text")}>Share something with Ethiopia…</button>
      </div>
      <div className="feed-composer-actions">
        <button onClick={() => onCreate("photo")}><Camera size={17} />Photo</button>
        <button onClick={() => onCreate("voice")}><Mic2 size={17} />Voice</button>
        <button onClick={() => onCreate("poll")}><Zap size={17} />Poll</button>
        <button onClick={() => onCreate("event")}><CalendarDays size={17} />Event</button>
        <button onClick={() => onCreate("anonymous")}><ShieldCheck size={17} />Anonymous</button>
      </div>
    </section>
  );
}

export function CircleRail({ circles, joined, onJoin, onOpen }: { circles: Circle[]; joined: string[]; onJoin: (id: string) => void; onOpen: (id: string) => void }) {
  return (
    <section className="circle-rail-section">
      <div className="social-section-title"><div><span>YOUR COMMUNITIES</span><h2>Circles built around belonging</h2></div><button onClick={() => onOpen("all")}>Explore all <ChevronRight size={16} /></button></div>
      <div className="circle-rail">
        {circles.slice(0, 6).map((circle) => {
          const isJoined = joined.includes(circle.id);
          return (
            <article key={circle.id} className="circle-mini-card social-surface">
              <button className="circle-mini-main" onClick={() => onOpen(circle.id)}>
                <Avatar initials={circle.initials} size="lg" accent={circle.accent} />
                <div><strong>{circle.name}{circle.official ? <BadgeCheck size={14} /> : null}</strong><span>{circle.localName}</span><small>{compact(circle.members)} members</small></div>
              </button>
              <button className={cn("circle-join", isJoined && "joined")} onClick={() => onJoin(circle.id)}>{isJoined ? <Check size={15} /> : <Plus size={15} />}{isJoined ? "Joined" : "Join"}</button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PostMenu({ onAction }: { onAction: (action: "report" | "mute" | "block") => void }) {
  return (
    <motion.div className="post-menu" initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }}>
      <button onClick={() => onAction("report")}><Flag size={16} /><span><strong>Report post</strong><small>Tell moderators what is wrong</small></span></button>
      <button onClick={() => onAction("mute")}><BellRing size={16} /><span><strong>Mute this creator</strong><small>Hide their posts from your feed</small></span></button>
      <button className="danger" onClick={() => onAction("block")}><UserMinus size={16} /><span><strong>Block account</strong><small>Prevent future interaction</small></span></button>
    </motion.div>
  );
}

function PostMedia({ post, lowData }: { post: SocialPost; lowData: boolean }) {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  if (post.kind === "photo") {
    return lowData && !mediaLoaded ? (
      <button className="low-data-placeholder" onClick={() => setMediaLoaded(true)}><WifiOff size={22} /><strong>Media paused in Low Data Mode</strong><span>Tap to load this image</span></button>
    ) : (
      <div className="post-photo" role="img" aria-label={post.mediaLabel}>
        <div className="photo-sun" /><div className="photo-table"><span /><span /><span /></div><div className="photo-caption"><Camera size={15} />{post.mediaLabel}</div>
      </div>
    );
  }
  if (post.kind === "voice") {
    return (
      <button className={cn("voice-post-player", playing && "playing")} onClick={() => setPlaying((value) => !value)}>
        <span className="voice-play">{playing ? <Radio size={18} /> : <Play size={18} fill="currentColor" />}</span>
        <span className="voice-wave">{Array.from({ length: 34 }).map((_, index) => <i key={index} style={{ height: `${12 + ((index * 17) % 27)}px` }} />)}</span>
        <strong>{post.voiceDuration}</strong>
        <small><Volume2 size={14} />Voice post</small>
      </button>
    );
  }
  return null;
}

function PostPoll({ post, onVote }: { post: SocialPost; onVote: (optionId: string) => void }) {
  if (!post.poll) return null;
  const total = post.poll.options.reduce((sum, option) => sum + option.votes, 0);
  return (
    <div className="social-poll">
      <strong>{post.poll.question}</strong>
      {post.poll.options.map((option) => {
        const percentage = total ? Math.round((option.votes / total) * 100) : 0;
        return (
          <button key={option.id} className={cn(post.poll?.votedId === option.id && "selected")} onClick={() => onVote(option.id)}>
            <span className="poll-fill" style={{ width: post.poll?.votedId ? `${percentage}%` : "0%" }} />
            <span>{option.label}</span><b>{post.poll?.votedId ? `${percentage}%` : "Vote"}</b>
          </button>
        );
      })}
      <small>{compact(total)} votes · Results update instantly</small>
    </div>
  );
}

function PostEvent({ post, onTicket }: { post: SocialPost; onTicket: () => void }) {
  if (!post.event) return null;
  return (
    <div className="social-event-card">
      <div className="event-date"><CalendarDays size={20} /><span>{post.event.date}</span></div>
      <div className="event-location"><MapPin size={17} /><div><strong>{post.event.location}</strong><span>{post.event.seats} seats remaining</span></div></div>
      <button onClick={onTicket}><Ticket size={16} />Reserve free seat</button>
    </div>
  );
}

function CommentsPanel({ post, onComment }: { post: SocialPost; onComment: (text: string, parentId?: string) => void }) {
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<SocialComment | null>(null);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const toggleCommentLike = (id: string) => setLikedComments((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const roots = post.comments.filter((comment) => !comment.parentId);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    onComment(clean, replyTo?.id);
    setText("");
    setReplyTo(null);
  };
  return (
    <motion.div className="comments-panel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
      {roots.map((comment) => {
        const replies = post.comments.filter((item) => item.parentId === comment.id);
        return (
          <div className="comment-thread" key={comment.id}>
            <div className="comment-row"><Avatar initials={comment.initials} size="sm" accent={comment.author.length} /><div><div className="comment-bubble"><strong>{comment.author}</strong><p>{comment.text}</p></div><div className="comment-meta"><span>{comment.time}</span><button onClick={() => toggleCommentLike(comment.id)}>{likedComments.includes(comment.id) ? "Liked" : "Like"} · {comment.likes + (likedComments.includes(comment.id) ? 1 : 0)}</button><button onClick={() => setReplyTo(comment)}>Reply</button></div></div></div>
            {replies.map((reply) => <div className="comment-row reply" key={reply.id}><Avatar initials={reply.initials} size="sm" accent={reply.author.length + 2} /><div><div className="comment-bubble"><strong>{reply.author}</strong><p>{reply.text}</p></div><div className="comment-meta"><span>{reply.time}</span><button onClick={() => toggleCommentLike(reply.id)}>{likedComments.includes(reply.id) ? "Liked" : "Like"} · {reply.likes + (likedComments.includes(reply.id) ? 1 : 0)}</button></div></div></div>)}
          </div>
        );
      })}
      {!post.comments.length ? <div className="empty-comments"><MessageCircle size={20} /><span>Start a thoughtful conversation.</span></div> : null}
      {replyTo ? <div className="replying-to"><span>Replying to {replyTo.author}</span><button onClick={() => setReplyTo(null)}><X size={14} /></button></div> : null}
      <form className="comment-composer" onSubmit={submit}><Avatar initials="MA" size="sm" accent={4} /><input value={text} onChange={(event) => setText(event.target.value)} placeholder={replyTo ? `Reply to ${replyTo.author}` : "Write a respectful comment"} /><button type="submit" aria-label="Post comment"><Send size={16} /></button></form>
    </motion.div>
  );
}

export function PostCard({
  post, lowData, onReact, onComment, onVote, onShare, onSave, onFollow, onMessage, onSafety, onTicket,
}: {
  post: SocialPost;
  lowData: boolean;
  onReact: (reaction: ReactionKey) => void;
  onComment: (text: string, parentId?: string) => void;
  onVote: (optionId: string) => void;
  onShare: () => void;
  onSave: () => void;
  onFollow: () => void;
  onMessage: () => void;
  onSafety: (action: "report" | "mute" | "block") => void;
  onTicket: () => void;
}) {
  const [translationOpen, setTranslationOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const totalReactions = Object.values(post.reactions).reduce((sum, value) => sum + value, 0);
  return (
    <article className="social-post social-surface">
      <header className="post-header">
        <button className="post-author" onClick={onMessage}>
          <Avatar initials={post.initials} size="md" accent={post.accent} online={!post.anonymous} />
          <span><strong>{post.author}{post.verified ? <BadgeCheck size={15} /> : null}{post.business ? <small>BUSINESS</small> : null}</strong><span>{post.handle} · {post.city}</span><small>{post.time}{post.circleName ? ` · ${post.circleName}` : ""}</small></span>
        </button>
        {!post.anonymous ? <button className="post-follow" onClick={onFollow}><UserPlus size={15} />Follow</button> : <span className="anonymous-badge"><ShieldCheck size={14} />Identity protected</span>}
        <div className="post-menu-wrap"><button className="post-more" onClick={() => setMenuOpen((value) => !value)} aria-label="Post options"><MoreHorizontal size={19} /></button><AnimatePresence>{menuOpen ? <PostMenu onAction={(action) => { onSafety(action); setMenuOpen(false); }} /> : null}</AnimatePresence></div>
      </header>
      <div className="post-language-row"><span><Languages size={14} />Originally in {post.languageLabel}</span>{post.translation ? <button onClick={() => setTranslationOpen((value) => !value)}>{translationOpen ? "Show original only" : "Translate"}</button> : null}</div>
      <div className="post-copy"><p lang={post.language}>{post.content}</p>{translationOpen && post.translation ? <motion.div className="post-translation" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}><Globe2 size={15} /><p>{post.translation}</p></motion.div> : null}</div>
      <PostMedia post={post} lowData={lowData} />
      <PostPoll post={post} onVote={onVote} />
      <PostEvent post={post} onTicket={onTicket} />
      <div className="post-social-proof">
        <span>{totalReactions ? <><b>{reactionMeta[post.myReaction ?? "betam"].symbol}</b>{compact(totalReactions)} reactions</> : "Be first to react"}</span>
        <span>{post.comments.length} comments</span>
      </div>
      <div className="post-actions">
        <div className="reaction-action-wrap">
          <button className={cn(post.myReaction && "active")} onClick={() => post.myReaction ? onReact(post.myReaction) : setReactionsOpen((value) => !value)} onMouseEnter={() => setReactionsOpen(true)}>
            <span>{post.myReaction ? reactionMeta[post.myReaction].symbol : <Heart size={18} />}</span>{post.myReaction ? reactionMeta[post.myReaction].label : "React"}
          </button>
          <AnimatePresence>{reactionsOpen ? <motion.div className="reaction-picker" initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.96 }} onMouseLeave={() => setReactionsOpen(false)}>{(Object.keys(reactionMeta) as ReactionKey[]).map((reaction) => <button key={reaction} className={cn(post.myReaction === reaction && "selected")} onClick={() => { onReact(reaction); setReactionsOpen(false); }} title={reactionMeta[reaction].label}><span>{reactionMeta[reaction].symbol}</span><small>{reactionMeta[reaction].label}</small></button>)}</motion.div> : null}</AnimatePresence>
        </div>
        <button onClick={() => setCommentsOpen((value) => !value)}><MessageCircle size={18} />Comment</button>
        <button onClick={onShare}><MessageSquare size={18} />Send</button>
        <button onClick={onSave} className={cn(post.saved && "active")}><BookOpen size={18} />{post.saved ? "Saved" : "Save"}</button>
      </div>
      <AnimatePresence>{commentsOpen ? <CommentsPanel post={post} onComment={onComment} /> : null}</AnimatePresence>
    </article>
  );
}

export function FeedGameCard({ onOpenGame }: { onOpenGame: (game: Exclude<Game, null>) => void }) {
  return (
    <section className="feed-game-card social-surface">
      <div className="feed-game-copy"><Pill icon={Sparkles}>Shuf interactive</Pill><h3>The community is judging tonight.</h3><p>Read five date stories, cast your verdict and share your panel personality with your Circle.</p><div><button onClick={() => onOpenGame("panel")}><Play size={17} fill="currentColor" />Enter The Panel</button><button onClick={() => onOpenGame("blind")}>Try Blind Match</button></div></div>
      <div className="feed-game-visual"><span>LOVE</span><span>FAIR</span><span>HARSH</span><b>8.4K live</b></div>
    </section>
  );
}
