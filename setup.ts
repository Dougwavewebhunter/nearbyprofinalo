import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationSelect } from '@/components/LocationSelect';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Search, Star, ListFilter } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/lib/serviceData';

const Browse = () => {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [loc, setLoc] = useState(params.get('loc') ?? '');
  const [cat, setCat] = useState(params.get('cat') ?? '');
  const [sub, setSub] = useState(params.get('sub') ?? '');
  const [cats, setCats] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => { supabase.from('categories').select('*').order('name').then(({ data }) => setCats(data?.length ? data : SERVICE_CATEGORIES.map((c) => ({ ...c, id: c.slug })))); }, []);
  useEffect(() => { supabase.from('subcategories').select('*').order('name').then(({ data }) => setSubs(data?.length ? data : SERVICE_CATEGORIES.flatMap((c) => c.subs.map((name, i) => ({ id: `${c.slug}-${i}`, name, category_id: c.slug })))); }, []);

  const activeCat = useMemo(() => cats.find((x) => x.slug === cat), [cats, cat]);
  const visibleSubs = useMemo(() => activeCat ? subs.filter((s) => s.category_id === activeCat.id || s.category_id === activeCat.slug) : [], [subs, activeCat]);

  useEffect(() => {
    (async () => {
      let qy = supabase.from('providers').select('id,business_name,location,description,cover_image,category_id,subcategory_id,services').eq('is_active', true);
      if (loc) qy = qy.ilike('location', `%${loc}%`);
      if (q) qy = qy.or(`business_name.ilike.%${q}%,description.ilike.%${q}%`);
      if (activeCat && !activeCat.fallback_id && activeCat.id !== activeCat.slug) qy = qy.eq('category_id', activeCat.id);
      if (sub && sub !== 'all' && !String(sub).startsWith(activeCat?.slug ?? 'fallback')) qy = qy.eq('subcategory_id', sub);
      const { data } = await qy.limit(80);
      setProviders(data ?? []);
    })();
  }, [q, loc, activeCat, sub]);

  const apply = () => setParams({ q, loc, cat, sub });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container flex-1 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div><h1 className="text-3xl font-bold">Browse pros</h1><p className="text-muted-foreground mt-1">Search by service, area, category and subcategory.</p></div>
          <Button asChild className="bg-gradient-brand"><Link to="/post-request">Post Job</Link></Button>
        </div>
        <Card className="p-3 grid md:grid-cols-[1fr_1fr_auto] gap-2 mb-4 shadow-soft">
          <div className="flex items-center gap-2 px-3"><Search className="h-4 w-4" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Service" className="border-0 focus-visible:ring-0" /></div>
          <div className="flex items-center gap-2 px-3 md:border-l"><MapPin className="h-4 w-4" /><LocationSelect value={loc} onChange={setLoc} placeholder="Choose location" /></div>
          <Button onClick={apply} className="bg-gradient-brand">Search</Button>
        </Card>

        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          <Button size="sm" variant={!cat ? 'default' : 'outline'} onClick={() => { setCat(''); setSub(''); }}>All</Button>
          {cats.map((c) => <Button key={c.id} size="sm" variant={cat === c.slug ? 'default' : 'outline'} onClick={() => { setCat(c.slug); setSub(''); }}>{c.name}</Button>)}
        </div>
        {visibleSubs.length > 0 && <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2"><ListFilter className="h-4 w-4 text-muted-foreground shrink-0" /><Select value={sub || 'all'} onValueChange={setSub}><SelectTrigger className="w-[260px]"><SelectValue placeholder="Subcategory" /></SelectTrigger><SelectContent><SelectItem value="all">All {activeCat?.name}</SelectItem>{visibleSubs.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>}

        {providers.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{providers.map((p) => <Link key={p.id} to={`/provider/${p.id}`}><Card className="overflow-hidden hover:border-accent hover:shadow-elegant transition-all bg-gradient-card"><div className="aspect-video bg-gradient-hero">{p.cover_image && <img src={p.cover_image} alt={p.business_name} className="w-full h-full object-cover" />}</div><div className="p-4"><div className="font-semibold">{p.business_name}</div><div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{p.location}</div><p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.description}</p><div className="flex items-center gap-1 mt-3 text-sm"><Star className="h-4 w-4 text-accent fill-accent" /> 4.8</div></div></Card></Link>)}</div> : <Card className="p-12 text-center text-muted-foreground">No pros match your search yet.</Card>}
      </main>
      <Footer />
    </div>
  );
};
export default Browse;
