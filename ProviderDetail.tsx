export const SA_LOCATIONS = [
  'Johannesburg','Soweto','Sandton','Randburg','Roodepoort','Midrand','Centurion','Pretoria','Mamelodi','Akasia','Krugersdorp','Benoni','Boksburg','Germiston','Kempton Park','Alberton','Vereeniging','Vanderbijlpark','Meyerton',
  'Cape Town','Bellville','Mitchells Plain','Khayelitsha','Stellenbosch','Paarl','Worcester','George','Mossel Bay','Knysna','Oudtshoorn','Hermanus','Somerset West',
  'Durban','Pinetown','Umhlanga','Phoenix','Chatsworth','Pietermaritzburg','Newcastle','Richards Bay','Empangeni','Port Shepstone','Ballito','Ladysmith',
  'Gqeberha','East London','Mthatha','Queenstown','Uitenhage','Jeffreys Bay','Graaff-Reinet','Bloemfontein','Welkom','Bethlehem','Kimberley','Upington','Springbok',
  'Polokwane','Tzaneen','Mokopane','Thohoyandou','Musina','Nelspruit','Mbombela','Witbank','Emalahleni','Secunda','Middelburg','Standerton',
  'Rustenburg','Mahikeng','Potchefstroom','Klerksdorp','Lichtenburg','Brits','Other / Nearby area'
];

export const SERVICE_CATEGORIES = [
  { name: 'Plumbing', slug: 'plumbing', icon: 'Wrench', subs: ['Leak repair','Geyser repair','Blocked drains','Bathroom plumbing','Kitchen plumbing','Pipe installation','Emergency plumbing','Water tank installation','Borehole pump plumbing','Drain cleaning'] },
  { name: 'Electrical', slug: 'electrical', icon: 'Zap', subs: ['House wiring','DB board upgrades','Fault finding','Solar installation','Inverter installation','Generator setup','Lighting','Compliance certificate','Electrical maintenance','Appliance wiring'] },
  { name: 'IT Services', slug: 'it-services', icon: 'Laptop', subs: ['Computer repairs','Laptop repairs','Website design','App development','Network setup','WiFi installation','Data recovery','Cybersecurity','Software installation','POS systems','Cloud setup','Email setup','IT support contracts'] },
  { name: 'Digital & Creative', slug: 'digital-creative', icon: 'Palette', subs: ['Graphic design','Logo design','Social media marketing','Digital marketing','SEO','Content creation','Video editing','Photography editing','Branding','Printing design'] },
  { name: 'Mechanics', slug: 'mechanics', icon: 'Car', subs: ['General service','Mobile mechanic','BMW specialist','Mercedes specialist','Toyota specialist','VW specialist','Audi specialist','Ford specialist','Diagnostics','Auto electrician','Panel beating','Tyres and brakes','Suspension','Engine overhaul'] },
  { name: 'Hair & Beauty', slug: 'hair-beauty', icon: 'Scissors', subs: ['Haircut','Braiding','Weaves','Dreadlocks','Barber','Nails','Manicure','Pedicure','Facials','Makeup','Lashes','Massage','Waxing','Skin care'] },
  { name: 'Construction', slug: 'construction', icon: 'HardHat', subs: ['Brickwork','Renovations','Building contractors','Roofing','Tiling','Ceilings','Drywall','Paving','Concrete work','Waterproofing','Plastering','Boundary walls','Home extensions'] },
  { name: 'Cleaning', slug: 'cleaning', icon: 'Sparkles', subs: ['Home cleaning','Office cleaning','Deep cleaning','Carpet cleaning','Window cleaning','Post-construction cleaning','Upholstery cleaning','Laundry services','Mattress cleaning','Move-in cleaning'] },
  { name: 'Painting', slug: 'painting', icon: 'PaintBucket', subs: ['Interior painting','Exterior painting','Roof painting','Waterproof coating','Decorative painting','Spray painting','Wall preparation','Commercial painting'] },
  { name: 'Welding & Metalwork', slug: 'welding-metalwork', icon: 'Flame', subs: ['Gate welding','Burglar bars','Carports','Steel structures','Aluminium welding','Security gates','Trailer repairs','Staircases','Balustrades','Custom metalwork'] },
  { name: 'Home Repairs', slug: 'home-repairs', icon: 'Hammer', subs: ['Handyman','Furniture assembly','Door repairs','Window repairs','Cupboard repairs','General maintenance','Appliance repairs','Locksmith','TV mounting','Curtain rails'] },
  { name: 'Security', slug: 'security', icon: 'Shield', subs: ['CCTV installation','Alarm systems','Electric fencing','Gate motors','Access control','Armed response setup','Intercoms','Security guards','Camera maintenance','Biometric access'] },
  { name: 'DSTV & Satellite', slug: 'dstv-satellite', icon: 'Satellite', subs: ['DSTV installation','Dish alignment','Extra view setup','Signal repairs','TV installation','Streaming device setup','Satellite maintenance'] },
  { name: 'Garden & Landscaping', slug: 'garden-landscaping', icon: 'Leaf', subs: ['Garden services','Landscaping','Tree felling','Irrigation','Lawn care','Pool cleaning','Pest control','Rubble removal','Grass cutting','Hedge trimming'] },
  { name: 'Borehole & Water', slug: 'borehole-water', icon: 'Droplets', subs: ['Borehole drilling','Borehole repairs','Water pump installation','JoJo tank installation','Water filtration','Irrigation pumps','Water testing'] },
  { name: 'Transport & Moving', slug: 'transport-moving', icon: 'Truck', subs: ['Furniture removals','Bakkie hire','Courier services','Office moving','Long-distance moving','Delivery services','Towing','Airport transfers','School transport'] },
  { name: 'Events', slug: 'events', icon: 'PartyPopper', subs: ['Photography','Videography','DJ','Catering','Decor','Tent hire','Sound hire','Event planning','MC services','Cake baking','Mobile bar'] },
  { name: 'Tutoring & Training', slug: 'tutoring-training', icon: 'GraduationCap', subs: ['Maths tutor','Science tutor','English tutor','Coding lessons','Driving lessons','Music lessons','Business coaching','Exam preparation','Language lessons'] },
  { name: 'Professional Services', slug: 'professional-services', icon: 'Briefcase', subs: ['Accounting','Tax services','Bookkeeping','Business registration','Insurance broker','HR services','Marketing consulting','Tender documents','Company profiles'] },
  { name: 'Legal Services', slug: 'legal-services', icon: 'Scale', subs: ['Lawyers','Family law','Labour law','Contracts','Debt collection','Notary services','Conveyancing','Immigration documents','Legal advice'] },
  { name: 'Health & Wellness', slug: 'health-wellness', icon: 'HeartPulse', subs: ['Personal trainer','Physiotherapy','Home nursing','Dietitian','Wellness coaching','Beauty therapy','Counselling','Elderly care','Home care'] },
  { name: 'Automotive Services', slug: 'automotive-services', icon: 'CarFront', subs: ['Car wash','Valet','Windscreen repairs','Car sound','Tracking installation','Vehicle inspection','Battery replacement','Vehicle wrapping','Smash repairs'] },
  { name: 'Real Estate & Property', slug: 'real-estate-property', icon: 'Home', subs: ['Estate agents','Property management','Rental agents','Home inspection','Property photography','Airbnb management','Tenant placement'] },
  { name: 'Farming & Agriculture', slug: 'farming-agriculture', icon: 'Tractor', subs: ['Farm equipment repairs','Fencing','Livestock services','Irrigation','Tractor services','Small-scale farming help','Poultry setup'] },
  { name: 'Manufacturing & Repairs', slug: 'manufacturing-repairs', icon: 'Factory', subs: ['Machine repairs','Fabrication','Woodwork','Upholstery','Shoe repairs','Tailoring','Appliance spares','Industrial maintenance'] },
  { name: 'Food & Catering', slug: 'food-catering', icon: 'Utensils', subs: ['Home catering','Corporate catering','Meal prep','Bakery','Braai catering','Traditional food','Private chef','Food truck'] },
  { name: 'Pets & Animal Services', slug: 'pets-animal-services', icon: 'PawPrint', subs: ['Dog grooming','Pet sitting','Dog walking','Vet transport','Pet training','Kennels','Aquarium maintenance'] },
  { name: 'Other Services', slug: 'other-services', icon: 'MoreHorizontal', subs: ['General services','Custom request','Labour hire','Personal assistant','Errands','Community services'] }
];

export const getCategoryBySlug = (slug?: string | null) => SERVICE_CATEGORIES.find((c) => c.slug === slug);
export const allSubcategories = SERVICE_CATEGORIES.flatMap((c) => c.subs.map((s) => ({ category: c.name, categorySlug: c.slug, name: s })));
