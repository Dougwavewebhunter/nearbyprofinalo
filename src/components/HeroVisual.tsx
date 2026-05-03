import logo from '@/assets/logo.png';
import { BadgeCheck, MapPin, MessageCircle, Star } from 'lucide-react';

export const HeroVisual = () => (
  <div className="relative mx-auto max-w-md lg:max-w-none">
    <div className="absolute -inset-6 rounded-[2rem] bg-white/10 blur-2xl" />
    <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur shadow-elegant">
      <div className="flex items-center gap-4">
        <img src={logo} alt="NearbyPro" className="h-20 w-20 rounded-3xl bg-white p-2 object-contain" />
        <div className="text-left">
          <div className="text-xl font-bold">NearbyPro South Africa</div>
          <div className="text-sm opacity-80 flex items-center gap-1"><MapPin className="h-4 w-4" /> Local pros near you</div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-left">
        <div className="rounded-2xl bg-white/15 p-4"><BadgeCheck className="h-5 w-5 text-accent" /><div className="mt-2 font-semibold">Verified skills</div><div className="text-xs opacity-75">Admin moderated</div></div>
        <div className="rounded-2xl bg-white/15 p-4"><MessageCircle className="h-5 w-5 text-accent" /><div className="mt-2 font-semibold">In-app chat</div><div className="text-xs opacity-75">No WhatsApp needed</div></div>
        <div className="col-span-2 rounded-2xl bg-white/15 p-4 flex items-center justify-between">
          <div><div className="font-semibold">Built for SA services</div><div className="text-xs opacity-75">🇿🇦 Jobs, adverts, providers and reviews</div></div>
          <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-accent text-accent" />4.8</div>
        </div>
      </div>
    </div>
  </div>
);
