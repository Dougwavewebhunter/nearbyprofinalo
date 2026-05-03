import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Trash2, Briefcase, Users, Star, ListChecks, Megaphone, Flag, Upload, Eye } from 'lucide-react';

export const AdminOverview = () => {
  const [s, setS] = useState({ providers: 0, users: 0, reviews: 0, requests: 0, ads: 0 });
  useEffect(() => {
    (async () => {
      const [p, pr, rv, rq, ad] = await Promise.all([
        supabase.from('providers').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('service_requests').select('id', { count: 'exact', head: true }),
        supabase.from('ads').select('id', { count: 'exact', head: true }),
      ]);
      setS({ providers: p.count ?? 0, users: pr.count ?? 0, reviews: rv.count ?? 0, requests: rq.count ?? 0, ads: ad.count ?? 0 });
    })();
  }, []);
  const cards = [
    { icon: Briefcase, label: 'Providers', val: s.providers }, { icon: Users, label: 'Users', val: s.users }, { icon: Star, label: 'Reviews', val: s.reviews }, { icon: ListChecks, label: 'Jobs', val: s.requests }, { icon: Megaphone, label: 'Ads', val: s.ads },
  ];
  return <div className="space-y-6"><h1 className="text-3xl font-bold">Admin dashboard</h1><div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">{cards.map((c) => <Card key={c.label} className="p-5"><c.icon className="h-5 w-5 text-accent" /><div className="text-3xl font-bold mt-2">{c.val}</div><div className="text-sm text-muted-foreground">{c.label}</div></Card>)}</div></div>;
};

export const AdminProviders = () => {
  const [list, setList] = useState<any[]>([]);
  const load = () => supabase.from('providers').select('*, categories(name), subcategories(name)').order('created_at', { ascending: false }).then(({ data }) => setList(data ?? []));
  useEffect(() => { load(); }, []);
  const update = async (id: string, patch: any) => { const { error } = await supabase.from('providers').update(patch).eq('id', id); if (error) toast.error(error.message); else load(); };
  const del = async (id: string) => { if (!confirm('Remove this provider permanently?')) return; await supabase.from('providers').delete().eq('id', id); load(); };
  return <div className="space-y-4"><h1 className="text-3xl font-bold">Providers</h1><p className="text-muted-foreground text-sm">Providers are auto-approved by default. Use flag/remove if a listing is not suitable.</p><div className="grid gap-3">{list.map((p) => <Card key={p.id} className="p-4 flex flex-col md:flex-row md:items-center gap-4"><div className="flex-1"><div className="font-semibold">{p.business_name}</div><div className="text-sm text-muted-foreground">{p.location} · {p.categories?.name ?? 'No category'} {p.subcategories?.name ? `· ${p.subcategories.name}` : ''}</div><div className="text-xs mt-1"><span className={`rounded-full px-2 py-0.5 ${p.moderation_status === 'flagged' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'}`}>{p.moderation_status ?? 'approved'}</span></div></div><div className="flex items-center gap-2 text-sm">Active <Switch checked={!!p.is_active} onCheckedChange={(v) => update(p.id, { is_active: v, moderation_status: v ? 'approved' : 'hidden' })} /></div><Button variant="outline" size="sm" onClick={() => update(p.id, { moderation_status: 'flagged', is_active: false })}><Flag className="h-4 w-4 mr-1" />Flag</Button><Button variant="outline" size="sm" onClick={() => update(p.id, { moderation_status: 'approved', is_active: true })}>Approve</Button><Button variant="ghost" size="icon" onClick={() => del(p.id)}><Trash2 className="h-4 w-4" /></Button></Card>)}</div></div>;
};

export const AdminUsers = () => {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => setList(data ?? [])); }, []);
  return <div className="space-y-4"><h1 className="text-3xl font-bold">Users</h1><div className="grid gap-2">{list.map((u) => <Card key={u.id} className="p-3 flex justify-between"><span>{u.full_name ?? u.id}</span><span className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</span></Card>)}</div></div>;
};

export const AdminReviews = () => {
  const [list, setList] = useState<any[]>([]);
  const load = () => supabase.from('reviews').select('*').order('created_at', { ascending: false }).then(({ data }) => setList(data ?? []));
  useEffect(() => { load(); }, []);
  return <div className="space-y-4"><h1 className="text-3xl font-bold">Reviews</h1>{list.map((r) => <Card key={r.id} className="p-3 flex justify-between items-start gap-3"><div><div className="text-sm">★ {r.rating}</div><div className="text-sm text-muted-foreground">{r.comment}</div></div><Button variant="ghost" size="icon" onClick={async () => { await supabase.from('reviews').delete().eq('id', r.id); load(); }}><Trash2 className="h-4 w-4" /></Button></Card>)}</div>;
};

export const AdminRequests = () => {
  const [list, setList] = useState<any[]>([]);
  const load = () => supabase.from('service_requests').select('*').order('created_at', { ascending: false }).then(({ data }) => setList(data ?? []));
  useEffect(() => { load(); }, []);
  return <div className="space-y-4"><h1 className="text-3xl font-bold">Posted jobs</h1>{list.map((r) => <Card key={r.id} className="p-3 flex justify-between items-start gap-3"><div><div className="font-semibold">{r.title}</div><div className="text-sm text-muted-foreground">{r.location} · {r.status} · {new Date(r.created_at).toLocaleString()}</div></div><Button variant="ghost" size="icon" onClick={async () => { await supabase.from('service_requests').delete().eq('id', r.id); load(); }}><Trash2 className="h-4 w-4" /></Button></Card>)}</div>;
};

export const AdminAds = () => {
  const [list, setList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', image_url: '', link_url: '', position: 'left', size: 'medium', starts_at: '', ends_at: '', tier: 'standard' });
  const load = () => supabase.from('ads').select('*').order('created_at', { ascending: false }).then(({ data }) => setList(data ?? []));
  useEffect(() => { load(); }, []);
  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;
    const { error } = await supabase.storage.from('ad-creatives').upload(path, file, { upsert: true });
    if (error) toast.error(error.message); else {
      const { data } = supabase.storage.from('ad-creatives').getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl })); toast.success('Creative uploaded');
    }
    setUploading(false);
  };
  const create = async () => {
    if (!form.title || !form.image_url) return toast.error('Title and creative image are required');
    const payload = { ...form, starts_at: form.starts_at || null, ends_at: form.ends_at || null };
    const { error } = await supabase.from('ads').insert(payload);
    if (error) return toast.error(error.message);
    setForm({ title: '', image_url: '', link_url: '', position: 'left', size: 'medium', starts_at: '', ends_at: '', tier: 'standard' }); load(); toast.success('Advert saved');
  };
  return <div className="space-y-4"><h1 className="text-3xl font-bold">Advert manager</h1><Card className="p-4 grid sm:grid-cols-2 gap-3"><Input placeholder="Advert title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><Input placeholder="Click link URL (optional)" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} /><div className="sm:col-span-2 grid sm:grid-cols-[1fr_auto] gap-2"><Input placeholder="Creative image URL or upload below" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /><Button variant="outline" asChild><label className="cursor-pointer"><Upload className="h-4 w-4 mr-2" />{uploading ? 'Uploading...' : 'Upload'}<input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} /></label></Button></div><Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="left">Left rail</SelectItem><SelectItem value="right">Right rail</SelectItem><SelectItem value="hero">Hero slot</SelectItem></SelectContent></Select><Select value={form.size} onValueChange={(v) => setForm({ ...form, size: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="small">Small</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="large">Large</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent></Select><Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="standard">Standard</SelectItem><SelectItem value="featured">Featured</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent></Select><Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /><Input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} /><Button onClick={create} className="bg-gradient-brand sm:col-span-2"><Megaphone className="h-4 w-4 mr-2" />Save advert</Button>{form.image_url && <div className="sm:col-span-2"><div className="text-sm font-medium mb-2 flex items-center gap-1"><Eye className="h-4 w-4" />Preview</div><img src={form.image_url} alt="Ad preview" className="max-h-52 rounded-xl border object-cover" /></div>}</Card><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{list.map((a) => <Card key={a.id} className="overflow-hidden"><img src={a.image_url} alt={a.title} className="w-full aspect-video object-cover" /><div className="p-3 space-y-2"><div className="flex justify-between items-start"><div><div className="font-semibold text-sm">{a.title}</div><div className="text-xs text-muted-foreground">{a.position} · {a.size} · {a.tier ?? 'standard'}</div>{(a.starts_at || a.ends_at) && <div className="text-xs text-muted-foreground">{a.starts_at ? new Date(a.starts_at).toLocaleDateString() : 'Now'} → {a.ends_at ? new Date(a.ends_at).toLocaleDateString() : 'No end'}</div>}</div><Switch checked={!!a.is_active} onCheckedChange={async (v) => { await supabase.from('ads').update({ is_active: v }).eq('id', a.id); load(); }} /></div><Button variant="ghost" size="icon" onClick={async () => { await supabase.from('ads').delete().eq('id', a.id); load(); }}><Trash2 className="h-4 w-4" /></Button></div></Card>)}</div></div>;
};
