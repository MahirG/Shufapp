"use client";

import { CalendarDays, Camera, Check, Languages, MapPin, MessageSquare, Mic2, Plus, Radio, Send, ShieldCheck, Users, Zap } from "lucide-react";
import { useState } from "react";
import { FeedLanguage } from "./data";
import { Overlay } from "./modals";
import { Avatar, cn, uid } from "./ui";
import { Circle, PostKind, SocialPost, emptyReactions, languageOptions } from "./social-model";

const createKinds: { id: PostKind; label: string; copy: string; icon: typeof Camera }[] = [
  { id: "text", label: "Post", copy: "Text, ideas and updates", icon: MessageSquare },
  { id: "photo", label: "Photo", copy: "Compressed visual post", icon: Camera },
  { id: "voice", label: "Voice", copy: "Speak in your language", icon: Mic2 },
  { id: "poll", label: "Poll", copy: "Ask the community", icon: Zap },
  { id: "event", label: "Event", copy: "Bring people together", icon: CalendarDays },
  { id: "anonymous", label: "Anonymous", copy: "Protected community question", icon: ShieldCheck },
];

export function CreatePostModal({
  initialKind = "text",
  circles,
  onCreate,
  onClose,
}: {
  initialKind?: PostKind;
  circles: Circle[];
  onCreate: (post: SocialPost) => void;
  onClose: () => void;
}) {
  const [kind, setKind] = useState<PostKind>(initialKind);
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState<Exclude<FeedLanguage, "all">>("am");
  const [circleId, setCircleId] = useState("");
  const [anonymous, setAnonymous] = useState(initialKind === "anonymous");
  const [pollA, setPollA] = useState("");
  const [pollB, setPollB] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [recorded, setRecorded] = useState(false);
  const [photoAttached, setPhotoAttached] = useState(false);
  const activeCircle = circles.find((circle) => circle.id === circleId);
  const languageLabel = languageOptions.find((option) => option.id === language)?.label ?? "Amharic";
  const canPublish = content.trim().length > 0 && (kind !== "poll" || (pollA.trim() && pollB.trim())) && (kind !== "event" || (eventDate.trim() && eventLocation.trim()));
  const publish = () => {
    if (!canPublish) return;
    const post: SocialPost = {
      id: uid("post"),
      author: anonymous || kind === "anonymous" ? "Anonymous member" : "Mahir Aman",
      handle: anonymous || kind === "anonymous" ? activeCircle?.name ?? "Protected post" : "@mahir",
      initials: anonymous || kind === "anonymous" ? "?" : "MA",
      accent: 4,
      verified: !anonymous,
      anonymous: anonymous || kind === "anonymous",
      city: "Addis Ababa",
      language,
      languageLabel,
      time: "now",
      circleId: activeCircle?.id,
      circleName: activeCircle?.name,
      kind: anonymous ? "anonymous" : kind,
      content: content.trim(),
      mediaLabel: kind === "photo" ? "Community photo shared by Mahir" : undefined,
      voiceDuration: kind === "voice" ? "0:24" : undefined,
      poll: kind === "poll" ? { question: content.trim(), options: [{ id: uid("opt"), label: pollA.trim(), votes: 0 }, { id: uid("opt"), label: pollB.trim(), votes: 0 }] } : undefined,
      event: kind === "event" ? { date: eventDate.trim(), location: eventLocation.trim(), seats: 80 } : undefined,
      reactions: emptyReactions(),
      comments: [],
    };
    onCreate(post);
    onClose();
  };
  return (
    <Overlay title="Create on Shuf" eyebrow="Share with Ethiopia" onClose={onClose} wide>
      <div className="create-post-modal">
        <div className="create-kind-grid">{createKinds.map(({ id, label, copy, icon: Icon }) => <button key={id} className={cn(kind === id && "active")} onClick={() => { setKind(id); setAnonymous(id === "anonymous"); }}><Icon size={18} /><span><strong>{label}</strong><small>{copy}</small></span></button>)}</div>
        <div className="create-identity"><Avatar initials={anonymous ? "?" : "MA"} size="md" accent={4} /><div><strong>{anonymous ? "Anonymous member" : "Mahir Aman"}</strong><span>{anonymous ? "Your identity will be hidden from members" : "Posting to your Shuf profile"}</span></div><label><input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} />Anonymous</label></div>
        <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder={kind === "poll" ? "Ask your question…" : kind === "event" ? "Describe the event…" : kind === "voice" ? "Add a short caption for your voice post…" : "What do you want Ethiopia to talk about?"} maxLength={1600} />
        <div className="create-meta-row"><label><Languages size={16} /><select value={language} onChange={(event) => setLanguage(event.target.value as Exclude<FeedLanguage, "all">)}>{languageOptions.filter((option) => option.id !== "all").map((option) => <option value={option.id} key={option.id}>{option.label} · {option.native}</option>)}</select></label><label><Users size={16} /><select value={circleId} onChange={(event) => setCircleId(event.target.value)}><option value="">Public feed</option>{circles.map((circle) => <option value={circle.id} key={circle.id}>{circle.name}</option>)}</select></label></div>
        {kind === "photo" ? <button className={cn("create-attachment", photoAttached && "attached")} onClick={() => setPhotoAttached((value) => !value)}><Camera size={22} /><span><strong>{photoAttached ? "Photo ready" : "Choose a photo"}</strong><small>Shuf will compress it for low-data users.</small></span>{photoAttached ? <Check size={18} /> : <Plus size={18} />}</button> : null}
        {kind === "voice" ? <button className={cn("create-attachment voice", recorded && "attached")} onClick={() => setRecorded((value) => !value)}><Mic2 size={22} /><span><strong>{recorded ? "Voice recorded · 0:24" : "Record voice post"}</strong><small>Speak naturally in Amharic, Afaan Oromo, Tigrinya or English.</small></span>{recorded ? <Check size={18} /> : <Radio size={18} />}</button> : null}
        {kind === "poll" ? <div className="poll-builder"><input value={pollA} onChange={(event) => setPollA(event.target.value)} placeholder="Option 1" /><input value={pollB} onChange={(event) => setPollB(event.target.value)} placeholder="Option 2" /><button onClick={() => { setPollA((value) => value || "Yes"); setPollB((value) => value || "No"); }}><Plus size={15} />Use Yes / No</button></div> : null}
        {kind === "event" ? <div className="event-builder"><label><CalendarDays size={17} /><input value={eventDate} onChange={(event) => setEventDate(event.target.value)} placeholder="Date and time" /></label><label><MapPin size={17} /><input value={eventLocation} onChange={(event) => setEventLocation(event.target.value)} placeholder="Location or online room" /></label></div> : null}
        <div className="create-safety-note"><ShieldCheck size={17} /><span>Posts follow Shuf community rules. Anonymous posts can still be reviewed by the Trust & Safety team when reported.</span></div>
        <footer><span>{content.length} / 1600</span><button className="primary-button" disabled={!canPublish} onClick={publish}><Send size={17} />Publish post</button></footer>
      </div>
    </Overlay>
  );
}
