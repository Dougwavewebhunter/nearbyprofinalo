import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdRail } from '@/components/AdRail';
import { Chatbot } from '@/components/Chatbot';
import { RequestsTicker } from '@/components/RequestsTicker';
import { Counter } from '@/components/Counter';
import { HeroVisual } from '@/components/HeroVisual';
import { LocationSelect } from '@/components/LocationSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Search, MapPin, Wrench, Zap, Car, Scissors, HardHat, Sparkles, PaintBucket, Flame, Star, Shield, Clock, Laptop, Hammer, Leaf, Truck, PartyPopper, GraduationCap, Briefcase, HeartPulse, CarFront, Palette, Satellite, Droplets, Scale, Home, Tractor, Factory, Utensils, PawPrint, MoreHorizontal } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/lib/serviceData';

const ICONS: Record<string, any> = { Wrench, Zap, Car, Scissors, HardHat, Sparkles, PaintBucket, Flame, Laptop, Hammer, Shield, Leaf, Truck, PartyPopper, GraduationCap, Briefcase, HeartPulse, CarFront, Palette, Satellite, Droplets, Scale, Home, Tractor, Factory, Utensils, PawPrint, MoreHorizontal };
const slidingServices = ['IT services','plumbers','electricians','mechanics','builders','hair & beauty','CCTV installers','garden services','web designers','welders','tutors','cleaners','transporters','event pros'];

const Index = () => {
  const [cats, setCats] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('');
  const serviceLine = useMemo(() => slidingServices.join('  •  '), []);

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => setCats((data?.length ? data : SERVICE_CATEGORIES.map((c, i) => ({ ...c, id: c.slug, fallback_id: i }))) ?? []));
    supabase.from('providers').select('id,business_name,location,description,cover_image').eq('is_active', true).limit(6)
      .then(({ data }) => setProviders(data ?? []));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLocationClick={() => document.getElementById('hero-loc')?.click()} />
      <main className="flex-1">
        <section className="relative bg-gradient-hero text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%)]" />
          <div className="container relative py-12 md:py-20 grid lg:grid-cols-[1fr_420px] gap-10 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance max-w-3xl mx-auto lg:mx-0">
                <span className="typing-gradient mobile-typing">Find trusted local pros</span> <span className="text-accent">near you.</span>
              </h1>
              <div className="mt-4 overflow-hidden rounded-full bg-white/10 border border-white/15 py-2">
                <div className="ticker text-sm md:text-base whitespace-nowrap">{serviceLine}  •  {serviceLine}</div>
              </div>
              <p className="mt-4 text-lg opacity-90 max-w-xl mx-auto lg:mx-0">
                Search, post jobs, chat in-platform, and connect with South African service providers.
              </p>
              <Card className="mt-8 max-w-3xl mx-auto lg:mx-0 p-2 flex flex-col sm:flex-row gap-2 shadow-elegant">
                <div className="flex items-center gap-2 px-3 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What service?" className="border-0 focus-visible:ring-0 bg-transparent" />
                </div>
                <div className="flex items-center gap-2 px-3 flex-1 sm:border-l">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div id="hero-loc" className="flex-1"><LocationSelect value={loc} onChange={setLoc} placeholder="Choose location" /></div>
                </div>
                <Button asChild size="lg" className="bg-gradient-brand shadow-glow"><Link to={`/browse?q=${encodeURIComponent(q)}&loc=${encodeURIComponent(loc)}`}>Search</Link></Button>
              </Card>
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/post-request">Post Job</Link></Button>
                <Button asChild size="lg" variant="secondary"><Link to="/become-pro">Join as Pro</Link></Button>
              </div>
              <div className="lg:hidden"><AdRail position="hero" /></div>
            </div>
            <HeroVisual />
          </div>
        </section>
        <RequestsTicker />

        <div className="container flex gap-6 py-10">
          <AdRail position="left" />
          <div className="flex-1 min-w-0 space-y-16">
            <section>
              <div className="flex items-end justify-between gap-4 mb-6">
                <div><h2 className="text-2xl md:text-3xl font-bold">Browse by category</h2><p className="text-muted-foreground text-sm mt-1">Broad coverage for South African service providers.</p></div>
                <Button asChild variant="ghost"><Link to="/browse">View all</Link></Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                {cats.map((c) => {
                  const Icon = ICONS[c.icon] ?? Wrench;
                  return <Link key={c.id} to={`/browse?cat=${c.slug}`}><Card className="p-4 h-full hover:border-accent hover:shadow-glow transition-all bg-gradient-card group"><div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-accent-foreground transition-colors"><Icon className="h-5 w-5" /></div><div className="font-semibold text-sm">{c.name}</div><div className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{(c.subs || []).slice(0, 3).join(' • ')}</div></Card></Link>;
                })}
              </div>
            </section>

            <section className="rounded-2xl bg-gradient-hero text-white p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center shadow-elegant">
              <div><div className="text-4xl font-bold"><Counter to={2800} suffix="+" /></div><div className="text-sm opacity-80 mt-1">Active pros target</div></div>
              <div><div className="text-4xl font-bold"><Counter to={120} suffix="+" /></div><div className="text-sm opacity-80 mt-1">SA towns covered</div></div>
              <div><div className="text-4xl font-bold flex justify-center items-baseline gap-1"><Counter to={15} /><span className="text-xl">min</span></div><div className="text-sm opacity-80 mt-1">Avg. response goal</div></div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <div><h2 className="text-2xl md:text-3xl font-bold">Just listed jobs</h2><p className="text-sm text-muted-foreground">Fresh work requests with in-platform applications.</p></div>
                <Button asChild variant="ghost"><Link to="/requests">View jobs →</Link></Button>
              </div>
              <RequestsTicker variant="cards" />
            </section>

            <section>
              <div className="flex items-center justify-between mb-6"><h2 className="text-2xl md:text-3xl font-bold">Featured pros</h2><Button asChild variant="ghost"><Link to="/browse">View all →</Link></Button></div>
              {providers.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{providers.map((p) => <Link key={p.id} to={`/provider/${p.id}`}><Card className="overflow-hidden hover:border-accent hover:shadow-elegant transition-all bg-gradient-card"><div className="aspect-video bg-gradient-hero">{p.cover_image && <img src={p.cover_image} alt={p.business_name} className="w-full h-full object-cover" />}</div><div className="p-4"><div className="font-semibold">{p.business_name}</div><div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{p.location}</div><p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.description ?? 'Trusted local pro on NearbyPro.'}</p><div className="flex items-center gap-1 mt-3 text-sm"><Star className="h-4 w-4 text-accent fill-accent" /> 4.8 <span className="text-muted-foreground">· New</span></div></div></Card></Link>)}</div> : <Card className="p-8 text-center text-muted-foreground">No pros listed yet — <Link className="text-accent" to="/become-pro">be the first!</Link></Card>}
            </section>

            <section className="grid md:grid-cols-3 gap-4">
              {[{ icon: Shield, title: 'Admin moderated', desc: 'Providers appear quickly and can be flagged or removed.' }, { icon: Clock, title: 'Platform chat', desc: 'Customers and providers chat directly inside NearbyPro.' }, { icon: MapPin, title: 'Hyper-local', desc: 'Find pros in your town or nearby area.' }].map((f) => <Card key={f.title} className="p-6 bg-gradient-card"><f.icon className="h-6 w-6 text-accent mb-3" /><div className="font-semibold mb-1">{f.title}</div><div className="text-sm text-muted-foreground">{f.desc}</div></Card>)}
            </section>
          </div>
          <AdRail position="right" />
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
