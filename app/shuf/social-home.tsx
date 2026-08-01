"use client";

import { BadgeCheck, Check, ChevronDown, ChevronRight, CircleEllipsis, Heart, Languages, Plus, ShieldCheck, Sparkles, TrendingUp, Users, WifiOff } from "lucide-react";
import { FeedLanguage, Game, Suitor, suitors } from "./data";
import { Avatar, Pill, cn } from "./ui";
import { Circle, PostKind, ReactionKey, SocialPost } from "./social-model";
import { CircleRail, FeedComposer, FeedGameCard, LanguageFilter, PostCard } from "./social-post";

export function SocialHomeView({
  posts,
  circles,
  joinedCircles,
  followedCreators,
  language,
  lowData,
  onLanguage,
  onToggleLowData,
  onCreate,
  onReact,
  onComment,
  onVote,
  onShare,
  onSave,
  onFollow,
  onJoinCircle,
  onOpenCircles,
  onOpenGame,
  onStartChat,
  onSafety,
  onToast,
}: {
  posts: SocialPost[];
  circles: Circle[];
  joinedCircles: string[];
  followedCreators: string[];
  language: FeedLanguage;
  lowData: boolean;
  onLanguage: (language: FeedLanguage) => void;
  onToggleLowData: () => void;
  onCreate: (kind?: PostKind) => void;
  onReact: (postId: string, reaction: ReactionKey) => void;
  onComment: (postId: string, text: string, parentId?: string) => void;
  onVote: (postId: string, optionId: string) => void;
  onShare: (post: SocialPost) => void;
  onSave: (postId: string) => void;
  onFollow: (name: string) => void;
  onJoinCircle: (id: string) => void;
  onOpenCircles: (id?: string) => void;
  onOpenGame: (game: Exclude<Game, null>) => void;
  onStartChat: (person: Suitor) => void;
  onSafety: (post: SocialPost, action: "report" | "mute" | "block") => void;
  onToast: (message: string) => void;
}) {
  const visiblePosts = posts.filter((post) => language === "all" || post.language === language);
  const creators = suitors.filter((person) => ["Selam", "Nardos", "Betelhem"].includes(person.name));
  return (
    <div className="social-home">
      <section className="ethiopia-pulse social-surface">
        <div className="pulse-copy"><Pill icon={TrendingUp}>What Ethiopia is talking about</Pill><h2>Talk. Connect.<br /><em>Belong.</em></h2><p>A multilingual social home for Ethiopian ideas, creators, communities and real conversations.</p><div className="pulse-actions"><button className="primary-button" onClick={() => onCreate("text")}><Plus size={17} />Create a post</button><button className="secondary-button" onClick={() => onOpenCircles()}><Users size={17} />Explore Circles</button></div></div>
        <div className="pulse-visual" aria-hidden="true"><div className="ethiopia-orbit orbit-a" /><div className="ethiopia-orbit orbit-b" /><span className="pulse-person p1">SE</span><span className="pulse-person p2">NA</span><span className="pulse-person p3">DA</span><span className="pulse-person p4">BE</span><div className="pulse-centre">SHUF<small>ETHIOPIA</small></div><b className="pulse-topic t1">Tech</b><b className="pulse-topic t2">Culture</b><b className="pulse-topic t3">Football</b></div>
      </section>

      <div className="feed-control-bar social-surface"><div><Languages size={17} /><strong>Your language feed</strong></div><LanguageFilter value={language} onChange={onLanguage} /><button className={cn("low-data-toggle", lowData && "active")} onClick={onToggleLowData}><WifiOff size={16} />Low Data {lowData ? "On" : "Off"}</button></div>

      <CircleRail circles={circles} joined={joinedCircles} onJoin={onJoinCircle} onOpen={onOpenCircles} />

      <div className="social-layout">
        <main className="social-feed-column">
          <FeedComposer onCreate={onCreate} />
          <div className="feed-sort social-surface"><div><strong>For you</strong><span>Built from your Circles and interests</span></div><button onClick={() => onToast("Feed refreshed with the latest relevant posts")}><Sparkles size={15} />Relevant <ChevronDown size={14} /></button></div>
          {visiblePosts.map((post, index) => (
            <div key={post.id}>
              <PostCard
                post={post}
                lowData={lowData}
                onReact={(reaction) => onReact(post.id, reaction)}
                onComment={(text, parentId) => onComment(post.id, text, parentId)}
                onVote={(optionId) => onVote(post.id, optionId)}
                onShare={() => onShare(post)}
                onSave={() => onSave(post.id)}
                onFollow={() => onFollow(post.author)}
                onMessage={() => {
                  const person = suitors.find((item) => item.name === post.author);
                  if (person) onStartChat(person); else onToast("This community profile does not accept direct messages");
                }}
                onSafety={(action) => onSafety(post, action)}
                onTicket={() => onToast("Seat reserved and added to your Shuf calendar")}
              />
              {index === 1 ? <FeedGameCard onOpenGame={onOpenGame} /> : null}
            </div>
          ))}
          {!visiblePosts.length ? <div className="empty-language-feed social-surface"><Languages size={28} /><h3>No posts in this language yet</h3><p>Be the first person to start the conversation.</p><button onClick={() => onCreate("text")}>Create a post</button></div> : null}
        </main>

        <aside className="social-right-rail">
          <section className="trend-card social-surface"><div className="rail-title"><span>ETHIOPIA NOW</span><button onClick={() => onToast("Trends refreshed")}><CircleEllipsis size={17} /></button></div>{[
            ["#EthiopianTech", "12.4K posts", "Technology"],
            ["Addis this weekend", "8.1K posts", "Local"],
            ["National team call-up", "24.7K posts", "Football"],
            ["Small business pricing", "5.8K posts", "Business"],
          ].map(([title, count, category], index) => <button key={title} onClick={() => onToast(`${title} opened`)}><span>{index + 1}</span><div><small>{category}</small><strong>{title}</strong><p>{count}</p></div><ChevronRight size={15} /></button>)}</section>

          <section className="creator-card social-surface"><div className="rail-title"><span>CREATORS TO KNOW</span><button onClick={() => onToast("Creator recommendations refreshed")}><Sparkles size={16} /></button></div>{creators.map((creator, index) => { const following = followedCreators.includes(creator.name); return <div className="creator-row" key={creator.name}><button onClick={() => onStartChat(creator)}><Avatar initials={creator.initials} size="md" accent={index} online /><span><strong>{creator.name}<BadgeCheck size={13} /></strong><small>{creator.job}</small></span></button><button className={cn(following && "following")} onClick={() => onFollow(creator.name)}>{following ? <Check size={14} /> : <Plus size={14} />}{following ? "Following" : "Follow"}</button></div>; })}<button className="creator-support" onClick={() => onToast("Creator support opens after local payment verification")}><Heart size={16} />Support Ethiopian creators</button></section>

          <section className="trust-card social-surface"><ShieldCheck size={22} /><div><strong>Safer by design</strong><p>Phone numbers stay private. Reports go to local-language moderation queues. Dating discovery is opt-in.</p></div><button onClick={() => onToast("Trust Centre opened")}>Open Trust Centre <ChevronRight size={15} /></button></section>
        </aside>
      </div>
    </div>
  );
}
