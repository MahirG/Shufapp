import { Sparkles } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function uid(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function currentTime() {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date());
}

export function Avatar({ initials, size = "md", accent = 0, online = false }: { initials: string; size?: "sm" | "md" | "lg" | "xl"; accent?: number; online?: boolean }) {
  return (
    <span className="avatar-wrap">
      <span className={cn("avatar", `avatar-${size}`, `accent-${accent % 6}`)}>{initials}</span>
      {online ? <i className="avatar-online" aria-label="Online" /> : null}
    </span>
  );
}

export function Logo() {
  return <span className="brand-mark" aria-label="Shuf"><span>S</span><i /></span>;
}

export function Pill({ children, icon: Icon }: { children: ReactNode; icon?: typeof Sparkles }) {
  return <span className="pill">{Icon ? <Icon size={13} strokeWidth={2.2} /> : null}{children}</span>;
}

export function usePersistedState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved !== null) setValue(JSON.parse(saved) as T);
    } catch {
      // Keep a resilient local fallback when storage is blocked.
    } finally {
      setReady(true);
    }
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* no-op */ }
  }, [key, ready, value]);

  return [value, setValue, ready] as const;
}
