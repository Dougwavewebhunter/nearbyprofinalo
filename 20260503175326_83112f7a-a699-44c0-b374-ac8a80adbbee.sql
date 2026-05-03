import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationSelect } from '@/components/LocationSelect';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { SERVICE_CATEGORIES } from '@/lib/serviceData';

const PostRequest = () => {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [cats, setCats] = useState<any[]>([]);
  const [f, setF] = useState({ title: params.get('title') ?? '', description: '', location: params.get('loc') ?? '', category_id: '' });
  useEffect(() => { if (!loading && !user) nav('/auth?mode=signup&redirect=/post-request'); }, [user, loading, nav]);
  useEffect(() => { supabase.from('categories').select('*').order('name').then(({ data }) => setCats(data?.length ? data : SERVICE_CATEGORIES.map((c) => ({ ...c, id: c.slug })))); }, []);
  const submit = async () => {
    if (!user) return;
    if (!f.title || !f.location) return toast.error('Job title and location are required');
    const categoryId = f.category_id && !SERVICE_CATEGORIES.some((c) => c.slug === f.category_id) ? f.category_id : null;
    const { data, error } = await supabase.from('service_requests').insert({ ...f, user_id: user.id, category_id: categoryId }).select('id').single();
    if (error) return toast.error(error.message);
    toast.success('Job posted');
    nav(`/requests/${data.id}`);
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8 max-w-xl flex-1">
        <h1 className="text-3xl font-bold mb-2">Post Job</h1>
        <p className="text-muted-foreground mb-6">Tell local pros what you need. They respond through NearbyPro chat.</p>
        <Card className="p-6 space-y-3">
          <Input placeholder="Title (e.g. Builder wanted in Pretoria)" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <Textarea placeholder="Describe the job, preferred time, and important details..." value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          <div className="rounded-md border px-3"><LocationSelect value={f.location} onChange={(v) => setF({ ...f, location: v })} placeholder="Choose location" /></div>
          <Select value={f.category_id} onValueChange={(v) => setF({ ...f, category_id: v })}>
            <SelectTrigger><SelectValue placeholder="Category (optional)" /></SelectTrigger>
            <SelectContent>{cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
          <Button onClick={submit} className="bg-gradient-brand w-full">Post Job</Button>
        </Card>
      </main>
      <Footer />
    </div>
  );
};
export default PostRequest;
