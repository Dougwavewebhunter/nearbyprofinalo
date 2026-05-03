import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, MapPin, CalendarClock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Req { id: string; title: string; location: string; created_at?: string; applications_count?: number; }

export const RequestsTicker = ({ variant = "bar" }: { variant?: "bar" | "cards" }) => {
  const [items, setItems] = useState<Req[]>([]);
  useEffect(() => {
    supabase.from("service_requests").select("id,title,location,created_at,applications_count").order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => setItems(data ?? []));
    const ch = supabase.channel("ticker").on("postgres_changes", { event: "INSERT", schema: "public", table: "service_requests" }, (p: any) => {
      setItems((prev) => [{ id: p.new.id, title: p.new.title, location: p.new.location, created_at: p.new.created_at, applications_count: p.new.applications_count ?? 0 }, ...prev].slice(0, 20));
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  if (!items.length && variant === "cards") {
    return <Card className="p-6 text-center text-muted-foreground bg-gradient-card">No jobs posted yet. <Link className="text-accent font-semibold" to="/post-request">Post the first job</Link>.</Card>;
  }
  if (!items.length) return null;

  if (variant === "cards") {
    return (
      <div className="relative overflow-hidden rounded-2xl border bg-secondary/30 p-3">
        <div className="ticker gap-4 min-w-max">
          {[...items, ...items].map((r, i) => (
            <Card key={`${r.id}-${i}`} className="w-[280px] md:w-[340px] p-4 bg-background shadow-soft hover:shadow-elegant transition-all">
              <Link to={`/requests/${r.id}`} className="block">
                <div className="font-semibold line-clamp-1">{r.title}</div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.location}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{r.applications_count ?? 0} applied</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1"><CalendarClock className="h-3 w-3" />{r.created_at ? new Date(r.created_at).toLocaleString() : 'New'}</div>
              </Link>
              <Button asChild size="sm" className="mt-3 w-full bg-gradient-brand"><Link to={`/requests/${r.id}`}>Apply / Chat</Link></Button>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const loop = [...items, ...items];
  return (
    <div className="border-y bg-secondary/40 overflow-hidden">
      <div className="container flex items-center gap-3 py-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-accent shrink-0">
          <Megaphone className="h-4 w-4" /> LIVE JOBS
        </span>
        <div className="overflow-hidden flex-1">
          <div className="ticker gap-8">
            {loop.map((r, i) => (
              <Link key={i} to={`/requests/${r.id}`} className="text-sm whitespace-nowrap hover:text-accent transition-colors">
                <span className="font-medium">{r.title}</span> <span className="text-muted-foreground">— {r.location} · {r.applications_count ?? 0} applied {r.created_at ? `· ${new Date(r.created_at).toLocaleDateString()} ${new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
