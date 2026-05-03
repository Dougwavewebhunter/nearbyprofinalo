import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

export const AdRail = ({ position }: { position: 'left' | 'right' | 'hero' }) => {
  const [ads, setAds] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    supabase.from('ads').select('*').eq('position', position).eq('is_active', true).order('created_at', { ascending: false }).then(({ data }) => setAds(data ?? []));
  }, [position]);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => i + 1), 5000);
    return () => clearInterval(t);
  }, []);

  const liveAds = useMemo(() => {
    const now = Date.now();
    return ads.filter((a) => (!a.starts_at || new Date(a.starts_at).getTime() <= now) && (!a.ends_at || new Date(a.ends_at).getTime() >= now));
  }, [ads]);

  if (position === 'hero') {
    if (!liveAds.length) return (
      <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-3 text-center text-xs text-white/80">
        Mobile advert carousel space available
      </div>
    );
    const shown = liveAds.slice(idx % liveAds.length).concat(liveAds.slice(0, idx % liveAds.length)).slice(0, 2);
    return (
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-2">
        <div className="flex gap-2 animate-fade-in">
          {shown.map((ad) => <a key={ad.id} href={ad.link_url || '#'} target={ad.link_url ? '_blank' : undefined} rel="noreferrer" className="min-w-0 flex-1">
            <Card className="overflow-hidden h-20 bg-white/10 border-white/20"><img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" /></Card>
            <div className="text-[10px] text-center text-white/80 mt-1 line-clamp-1">{ad.title}</div>
          </a>)}
        </div>
      </div>
    );
  }

  const placeholders = [1, 2, 3];
  if (!liveAds.length) return <aside className="hidden xl:block w-40 shrink-0"><div className="sticky top-24 space-y-3">{placeholders.map((n) => <Card key={n} className="h-32 p-4 flex items-center justify-center text-xs text-center text-muted-foreground bg-secondary/50 border-dashed">Advert space {n}<br />{position}</Card>)}</div></aside>;
  const shown = liveAds.slice(idx % liveAds.length).concat(liveAds.slice(0, idx % liveAds.length)).slice(0, 3);

  return <aside className="hidden xl:block w-40 shrink-0"><div className="sticky top-24 space-y-3">{shown.map((ad) => <a key={ad.id} href={ad.link_url || '#'} target={ad.link_url ? '_blank' : undefined} rel="noreferrer" className="block group"><Card className={`overflow-hidden bg-gradient-card transition-all group-hover:shadow-glow ${ad.size === 'large' || ad.size === 'premium' ? 'h-48' : ad.size === 'small' ? 'h-24' : 'h-36'}`}><img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /></Card><div className="mt-1 text-[10px] text-muted-foreground text-center line-clamp-1">{ad.title}</div></a>)}</div></aside>;
};
