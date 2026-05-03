-- NearbyPro React upgrade: first-account admin, richer categories, moderation, ad scheduling and uploads

-- First account created becomes admin, later accounts become users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE user_count integer;
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;

  SELECT count(*) INTO user_count FROM auth.users;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN user_count <= 1 THEN 'admin'::public.app_role ELSE 'user'::public.app_role END)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END; $$;

ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'approved';
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS id_type TEXT DEFAULT 'sa_id';
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS id_number TEXT;

ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ;
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ;
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'standard';

-- Storage bucket for advert creatives
INSERT INTO storage.buckets (id, name, public)
VALUES ('ad-creatives', 'ad-creatives', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$ BEGIN
  CREATE POLICY "public read ad creatives" ON storage.objects FOR SELECT USING (bucket_id = 'ad-creatives');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "admins upload ad creatives" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'ad-creatives' AND public.has_role(auth.uid(),'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "admins update ad creatives" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'ad-creatives' AND public.has_role(auth.uid(),'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "admins delete ad creatives" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'ad-creatives' AND public.has_role(auth.uid(),'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Rich service category seed. Safe to run repeatedly.
WITH data(name, slug, icon) AS (VALUES
  ('Plumbing','plumbing','Wrench'),
  ('Electrical','electrical','Zap'),
  ('IT Services','it-services','Laptop'),
  ('Mechanics','mechanics','Car'),
  ('Hair & Beauty','hair-beauty','Scissors'),
  ('Construction','construction','HardHat'),
  ('Cleaning','cleaning','Sparkles'),
  ('Painting','painting','PaintBucket'),
  ('Welding & Metalwork','welding-metalwork','Flame'),
  ('Home Repairs','home-repairs','Hammer'),
  ('Security','security','Shield'),
  ('Garden & Landscaping','garden-landscaping','Leaf'),
  ('Transport & Moving','transport-moving','Truck'),
  ('Events','events','PartyPopper'),
  ('Tutoring & Training','tutoring-training','GraduationCap'),
  ('Professional Services','professional-services','Briefcase'),
  ('Health & Wellness','health-wellness','HeartPulse'),
  ('Automotive Services','automotive-services','CarFront')
)
INSERT INTO public.categories(name, slug, icon)
SELECT name, slug, icon FROM data
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;

WITH subs(cat_slug, name, slug) AS (VALUES
  ('plumbing','Leak repair','leak-repair'),('plumbing','Geyser repair','geyser-repair'),('plumbing','Blocked drains','blocked-drains'),('plumbing','Bathroom plumbing','bathroom-plumbing'),('plumbing','Kitchen plumbing','kitchen-plumbing'),('plumbing','Pipe installation','pipe-installation'),('plumbing','Emergency plumbing','emergency-plumbing'),('plumbing','Water tank installation','water-tank-installation'),
  ('electrical','House wiring','house-wiring'),('electrical','DB board upgrades','db-board-upgrades'),('electrical','Fault finding','fault-finding'),('electrical','Solar installation','solar-installation'),('electrical','Inverter installation','inverter-installation'),('electrical','Generator setup','generator-setup'),('electrical','Lighting','lighting'),('electrical','Compliance certificate','compliance-certificate'),
  ('it-services','Computer repairs','computer-repairs'),('it-services','Website design','website-design'),('it-services','App development','app-development'),('it-services','Network setup','network-setup'),('it-services','CCTV networking','cctv-networking'),('it-services','Printer setup','printer-setup'),('it-services','Data recovery','data-recovery'),('it-services','Cybersecurity','cybersecurity'),('it-services','Software installation','software-installation'),('it-services','POS systems','pos-systems'),
  ('mechanics','General service','general-service'),('mechanics','Mobile mechanic','mobile-mechanic'),('mechanics','BMW specialist','bmw-specialist'),('mechanics','Mercedes specialist','mercedes-specialist'),('mechanics','Toyota specialist','toyota-specialist'),('mechanics','VW specialist','vw-specialist'),('mechanics','Diagnostics','diagnostics'),('mechanics','Auto electrician','auto-electrician'),('mechanics','Panel beating','panel-beating'),('mechanics','Tyres and brakes','tyres-and-brakes'),
  ('hair-beauty','Haircut','haircut'),('hair-beauty','Braiding','braiding'),('hair-beauty','Nails','nails'),('hair-beauty','Manicure','manicure'),('hair-beauty','Pedicure','pedicure'),('hair-beauty','Facials','facials'),('hair-beauty','Makeup','makeup'),('hair-beauty','Lashes','lashes'),('hair-beauty','Massage','massage'),('hair-beauty','Barber','barber'),
  ('construction','Brickwork','brickwork'),('construction','Renovations','renovations'),('construction','Building contractors','building-contractors'),('construction','Roofing','roofing'),('construction','Tiling','tiling'),('construction','Ceilings','ceilings'),('construction','Drywall','drywall'),('construction','Paving','paving'),('construction','Concrete work','concrete-work'),('construction','Waterproofing','waterproofing'),
  ('cleaning','Home cleaning','home-cleaning'),('cleaning','Office cleaning','office-cleaning'),('cleaning','Deep cleaning','deep-cleaning'),('cleaning','Carpet cleaning','carpet-cleaning'),('cleaning','Window cleaning','window-cleaning'),('cleaning','Post-construction cleaning','post-construction-cleaning'),('cleaning','Upholstery cleaning','upholstery-cleaning'),('cleaning','Laundry services','laundry-services'),
  ('painting','Interior painting','interior-painting'),('painting','Exterior painting','exterior-painting'),('painting','Roof painting','roof-painting'),('painting','Waterproof coating','waterproof-coating'),('painting','Decorative painting','decorative-painting'),('painting','Spray painting','spray-painting'),
  ('welding-metalwork','Gate welding','gate-welding'),('welding-metalwork','Burglar bars','burglar-bars'),('welding-metalwork','Carports','carports'),('welding-metalwork','Steel structures','steel-structures'),('welding-metalwork','Aluminium welding','aluminium-welding'),('welding-metalwork','Security gates','security-gates'),('welding-metalwork','Trailer repairs','trailer-repairs'),
  ('home-repairs','Handyman','handyman'),('home-repairs','Furniture assembly','furniture-assembly'),('home-repairs','Door repairs','door-repairs'),('home-repairs','Window repairs','window-repairs'),('home-repairs','Cupboard repairs','cupboard-repairs'),('home-repairs','General maintenance','general-maintenance'),('home-repairs','Appliance repairs','appliance-repairs'),
  ('security','CCTV installation','cctv-installation'),('security','Alarm systems','alarm-systems'),('security','Electric fencing','electric-fencing'),('security','Gate motors','gate-motors'),('security','Access control','access-control'),('security','Armed response setup','armed-response-setup'),('security','Intercoms','intercoms'),
  ('garden-landscaping','Garden services','garden-services'),('garden-landscaping','Landscaping','landscaping'),('garden-landscaping','Tree felling','tree-felling'),('garden-landscaping','Irrigation','irrigation'),('garden-landscaping','Lawn care','lawn-care'),('garden-landscaping','Pool cleaning','pool-cleaning'),('garden-landscaping','Pest control','pest-control'),
  ('transport-moving','Furniture removals','furniture-removals'),('transport-moving','Bakkie hire','bakkie-hire'),('transport-moving','Courier services','courier-services'),('transport-moving','Office moving','office-moving'),('transport-moving','Long-distance moving','long-distance-moving'),('transport-moving','Delivery services','delivery-services'),('transport-moving','Towing','towing'),
  ('events','Photography','photography'),('events','Videography','videography'),('events','DJ','dj'),('events','Catering','catering'),('events','Decor','decor'),('events','Tent hire','tent-hire'),('events','Sound hire','sound-hire'),('events','Event planning','event-planning'),
  ('tutoring-training','Maths tutor','maths-tutor'),('tutoring-training','Science tutor','science-tutor'),('tutoring-training','English tutor','english-tutor'),('tutoring-training','Coding lessons','coding-lessons'),('tutoring-training','Driving lessons','driving-lessons'),('tutoring-training','Music lessons','music-lessons'),('tutoring-training','Business coaching','business-coaching'),
  ('professional-services','Accounting','accounting'),('professional-services','Tax services','tax-services'),('professional-services','Legal services','legal-services'),('professional-services','Business registration','business-registration'),('professional-services','Insurance broker','insurance-broker'),('professional-services','HR services','hr-services'),('professional-services','Marketing','marketing'),('professional-services','Graphic design','graphic-design'),
  ('health-wellness','Personal trainer','personal-trainer'),('health-wellness','Physiotherapy','physiotherapy'),('health-wellness','Home nursing','home-nursing'),('health-wellness','Dietitian','dietitian'),('health-wellness','Wellness coaching','wellness-coaching'),('health-wellness','Beauty therapy','beauty-therapy'),
  ('automotive-services','Car wash','car-wash'),('automotive-services','Valet','valet'),('automotive-services','Windscreen repairs','windscreen-repairs'),('automotive-services','Car sound','car-sound'),('automotive-services','Tracking installation','tracking-installation'),('automotive-services','Vehicle inspection','vehicle-inspection'),('automotive-services','Battery replacement','battery-replacement')
)
INSERT INTO public.subcategories(category_id, name, slug)
SELECT c.id, s.name, s.slug FROM subs s JOIN public.categories c ON c.slug = s.cat_slug
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;

-- If Douglas account already exists, make it admin safely by email (password is never stored in code).
DO $$
DECLARE admin_uid uuid;
BEGIN
  SELECT id INTO admin_uid FROM auth.users WHERE email = 'douglaswebhunter@gmail.com' LIMIT 1;
  IF admin_uid IS NOT NULL THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (admin_uid, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
