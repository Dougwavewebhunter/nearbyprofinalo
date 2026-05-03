import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarClock, MapPin, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const RequestDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from('service_requests').select('*, categories(name)').eq('id', id).maybeSingle().then(({ data }) => setRequest(data));
  }, [id]);

  const respond = async () => {
    if (!user) return nav('/auth');
    const { data: myProvider } = await supabase.from('providers').select('id,business_name').eq('user_id', user.id).maybeSingle();
    if (!myProvider) return toast.error('Create your provider profile first before responding to jobs.');
    if (request.user_id === user.id) return toast.error('This is your own job post.');
    const { data: existing } = await supabase.from('conversations').select('id').eq('user_id', request.user_id).eq('provider_id', myProvider.id).maybeSingle();
    let convId = existing?.id;
    if (!convId) {
      const { data: c, error } = await supabase.from('conversations').insert({ user_id: request.user_id, provider_id: myProvider.id }).select('id').single();
      if (error) return toast.error(error.message);
      convId = c.id;
      await supabase.from('messages').insert({ conversation_id: convId, sender_id: user.id, content: `Hi, I saw your job post: ${request.title}. I can help you with this.` });
    }
    nav(`/messages/${convId}`);
  };

  if (!request) return <div className="min-h-screen flex flex-col"><Header /><main className="container py-12">Loading...</main><Footer /></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8 flex-1 max-w-3xl">
        <Card className="p-6 space-y-4 bg-gradient-card">
          <div className="text-sm text-accent font-semibold">Posted job</div>
          <h1 className="text-3xl font-bold">{request.title}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{request.location}</span>
            <span className="flex items-center gap-1"><CalendarClock className="h-4 w-4" />{new Date(request.created_at).toLocaleString()}</span>
            {request.categories?.name && <span>{request.categories.name}</span>}
          </div>
          <p className="text-muted-foreground whitespace-pre-wrap">{request.description || 'No extra details provided.'}</p>
          <Button onClick={respond} className="bg-gradient-brand"><MessageSquare className="h-4 w-4 mr-2" />Respond in platform chat</Button>
          <p className="text-xs text-muted-foreground">NearbyPro keeps job communication inside the platform. No WhatsApp button is shown.</p>
        </Card>
      </main>
      <Footer />
    </div>
  );
};
export default RequestDetail;
