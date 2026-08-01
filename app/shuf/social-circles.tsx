"use client";

import { BadgeCheck, CalendarDays, Check, ChevronRight, Plus, Radio, Search, Share2, ShieldCheck, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Avatar, Pill, cn } from "./ui";
import { Circle, compact } from "./social-model";

export function CirclesView({
  circles,
  joined,
  selectedId,
  onSelect,
  onJoin,
  onCreate,
  onToast,
}: {
  circles: Circle[];
  joined: string[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onJoin: (id: string) => void;
  onCreate: () => void;
  onToast: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const selected = circles.find((circle) => circle.id === selectedId) ?? null;
  const categories = ["All", "City", "Career", "Culture", "Campus", "Sport", "Business", "Diaspora"];
  const filtered = circles.filter((circle) => (category === "All" || circle.category === category) && `${circle.name} ${circle.localName} ${circle.description}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="circles-page page-stack">
      <section className="circles-hero social-surface"><div><Pill icon={Users}>Shuf Circles</Pill><h2>Find your people.<br /><em>Build something together.</em></h2><p>Local communities with clear rules, trusted moderators, multilingual conversations and real-world events.</p><div><button className="primary-button" onClick={onCreate}><Plus size={17} />Start a Circle</button><button className="secondary-button" onClick={() => onToast("Circle invitations copied")}><Share2 size={17} />Invite friends</button></div></div><div className="circles-hero-stat"><strong>{compact(circles.reduce((sum, circle) => sum + circle.members, 0))}</strong><span>community memberships</span><div><i /><small>{compact(circles.reduce((sum, circle) => sum + circle.online, 0))} people online now</small></div></div></section>

      <section className="circles-discovery social-surface"><label><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Circles by topic, city or language" /></label><div>{categories.map((item) => <button className={cn(category === item && "active")} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></section>

      <div className="circles-grid">{filtered.map((circle) => { const isJoined = joined.includes(circle.id); return <article className="circle-card social-surface" key={circle.id}><div className={`circle-cover accent-${circle.accent}`}><span>{circle.initials}</span><div><i /><small>{compact(circle.online)} online</small></div></div><div className="circle-card-body"><div className="circle-title"><div><h3>{circle.name}{circle.official ? <BadgeCheck size={16} /> : null}</h3><span>{circle.localName}</span></div><button className={cn(isJoined && "joined")} onClick={() => onJoin(circle.id)}>{isJoined ? <Check size={15} /> : <Plus size={15} />}{isJoined ? "Joined" : "Join"}</button></div><p>{circle.description}</p><div className="circle-tags"><span>{circle.category}</span><span>{circle.language}</span><span>{compact(circle.members)} members</span></div><button className="circle-open" onClick={() => onSelect(circle.id)}>Open Circle <ChevronRight size={16} /></button></div></article>; })}</div>

      <AnimatePresence>{selected ? <motion.div className="circle-detail-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => onSelect(null)}><motion.aside className="circle-detail" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }} onClick={(event) => event.stopPropagation()}><header><button onClick={() => onSelect(null)}><X size={19} /></button><span>COMMUNITY PROFILE</span><button onClick={() => onToast("Circle link copied")}><Share2 size={18} /></button></header><div className={`circle-detail-cover accent-${selected.accent}`}><Avatar initials={selected.initials} size="xl" accent={selected.accent} /><h2>{selected.name}{selected.official ? <BadgeCheck size={18} /> : null}</h2><p>{selected.localName}</p><div><span>{compact(selected.members)} members</span><span>{compact(selected.online)} online</span></div></div><div className="circle-detail-body"><p>{selected.description}</p><button className={cn("primary-button full", joined.includes(selected.id) && "joined-action")} onClick={() => onJoin(selected.id)}>{joined.includes(selected.id) ? <Check size={17} /> : <Plus size={17} />}{joined.includes(selected.id) ? "Joined Circle" : "Join Circle"}</button><section><span>LIVE NOW</span><button className="live-room" onClick={() => onToast(`Joined ${selected.name} audio room`)}><span><Radio size={18} /></span><div><strong>{selected.trending}</strong><small>{compact(selected.online)} listening and talking</small></div><ChevronRight size={17} /></button></section><section><span>NEXT EVENT</span><button className="circle-event-row" onClick={() => onToast("Event saved to your Shuf calendar")}><CalendarDays size={19} /><div><strong>{selected.nextEvent}</strong><small>Community-hosted and moderator verified</small></div><Plus size={17} /></button></section><section><span>MODERATORS</span><div className="moderator-list">{selected.moderators.map((moderator, index) => <button key={moderator.name} onClick={() => onToast(`${moderator.name}'s moderator profile opened`)}><Avatar initials={moderator.initials} size="sm" accent={index + selected.accent} /><span>{moderator.name}</span><ShieldCheck size={14} /></button>)}</div></section><section><span>COMMUNITY RULES</span><ol>{selected.rules.map((rule) => <li key={rule}>{rule}</li>)}</ol></section></div></motion.aside></motion.div> : null}</AnimatePresence>
    </div>
  );
}
