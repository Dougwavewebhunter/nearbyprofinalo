import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationSelect } from "@/components/LocationSelect";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { MessageSquare, Briefcase, Star } from "lucide-react";

export const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ msgs: 0, requests: 0, reviews: 0 });
  useEffect(() => {
    if (!user) return;
    (async () => {
      const [m, r, rv] = await Promise.all([
        supabase.from("conversations").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("service_requests").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      setStats({ msgs: m.count ?? 0, requests: r.count ?? 0, reviews: rv.count ?? 0 });
    })();
  }, [user]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5"><MessageSquare className="h-5 w-5 text-accent" /><div className="text-3xl font-bold mt-2">{stats.msgs}</div><div className="text-sm text-muted-foreground">Conversations</div></Card>
        <Card className="p-5"><Briefcase className="h-5 w-5 text-accent" /><div className="text-3xl font-bold mt-2">{stats.requests}</div><div className="text-sm text-muted-foreground">My requests</div></Card>
        <Card className="p-5"><Star className="h-5 w-5 text-accent" /><div className="text-3xl font-bold mt-2">{stats.reviews}</div><div className="text-sm text-muted-foreground">Reviews given</div></Card>
      </div>
      <Card className="p-6">
        <h2 className="font-semibold mb-2">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="bg-gradient-brand"><Link to="/post-request">Post a request</Link></Button>
          <Button asChild variant="outline"><Link to="/browse">Find a pro</Link></Button>
          <Button asChild variant="outline"><Link to="/dashboard/profile">Become a pro</Link></Button>
        </div>
      </Card>
    </div>
  );
};

export const DashboardProfile = () => {
  const { user, refreshRoles } = useAuth();
  const [cats, setCats] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [p, setP] = useState<any>({ business_name: "", description: "", location: "", phone: "", email: "", category_id: "", subcategory_id: "", id_type: "sa_id", id_number: "", cover_image: "", services: [] });
  const [exists, setExists] = useState(false);
  const [servicesText, setServicesText] = useState("");

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => setCats(data ?? []));
    supabase.from("subcategories").select("*").order("name").then(({ data }) => setSubs(data ?? []));
    if (!user) return;
    supabase.from("providers").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) { setP(data); setExists(true); setServicesText((Array.isArray(data.services) ? data.services as string[] : []).join(", ")); }
    });
  }, [user]);

  const save = async () => {
    if (!user) return;
    const services = servicesText.split(",").map((s) => s.trim()).filter(Boolean);
    const payload = { ...p, services, user_id: user.id };
    const { error } = exists
      ? await supabase.from("providers").update(payload).eq("user_id", user.id)
      : await supabase.from("providers").insert(payload);
    if (error) return toast.error(error.message);
    if (!exists) {
      await supabase.from("user_roles").upsert({ user_id: user.id, role: "provider" }, { onConflict: "user_id,role" });
      await refreshRoles();
    }
    toast.success("Profile saved");
    setExists(true);
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold">My provider profile</h1>
      <p className="text-sm text-muted-foreground">Saving your profile registers you as a provider — auto-approved.</p>
      <Card className="p-6 space-y-3">
        <Input placeholder="Business name" value={p.business_name ?? ""} onChange={(e) => setP({ ...p, business_name: e.target.value })} />
        <Textarea placeholder="Describe your services" value={p.description ?? ""} onChange={(e) => setP({ ...p, description: e.target.value })} />
        <Select value={p.category_id ?? ""} onValueChange={(v) => setP({ ...p, category_id: v, subcategory_id: "" })}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>{cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={p.subcategory_id ?? ""} onValueChange={(v) => setP({ ...p, subcategory_id: v })}>
          <SelectTrigger><SelectValue placeholder="Subcategory / specialty" /></SelectTrigger>
          <SelectContent>{subs.filter((s) => s.category_id === p.category_id).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
        </Select>
        <div className="rounded-md border px-3"><LocationSelect value={p.location ?? ""} onChange={(v) => setP({ ...p, location: v })} placeholder="Choose location" /></div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Select value={p.id_type ?? "sa_id"} onValueChange={(v) => setP({ ...p, id_type: v })}>
            <SelectTrigger><SelectValue placeholder="ID type" /></SelectTrigger>
            <SelectContent><SelectItem value="sa_id">South African ID</SelectItem><SelectItem value="passport">Passport</SelectItem></SelectContent>
          </Select>
          <Input placeholder={p.id_type === "passport" ? "Passport number" : "SA ID number"} value={p.id_number ?? ""} onChange={(e) => setP({ ...p, id_number: e.target.value })} />
        </div>
        <Input placeholder="Phone (kept for admin / account use)" value={p.phone ?? ""} onChange={(e) => setP({ ...p, phone: e.target.value })} />
        <Input placeholder="Business email" value={p.email ?? ""} onChange={(e) => setP({ ...p, email: e.target.value })} />
        <Input placeholder="Cover/poster image URL" value={p.cover_image ?? ""} onChange={(e) => setP({ ...p, cover_image: e.target.value })} />
        <Input placeholder="Services (comma separated)" value={servicesText} onChange={(e) => setServicesText(e.target.value)} />
        <Button onClick={save} className="bg-gradient-brand">Save profile</Button>
      </Card>
    </div>
  );
};
