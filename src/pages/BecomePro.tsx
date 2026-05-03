import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, UserPlus, LogIn } from 'lucide-react';

const BecomePro = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <section className="bg-gradient-hero text-white py-16">
        <div className="container text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold">Grow your business with NearbyPro</h1>
          <p className="mt-4 opacity-90">Create an account first, then complete your provider profile. Listings are auto-approved and can be moderated by admin.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-gradient-brand shadow-glow"><Link to="/auth?mode=signup&redirect=/dashboard/profile"><UserPlus className="h-4 w-4 mr-2" />New here? Create account</Link></Button>
            <Button asChild size="lg" variant="secondary"><Link to="/auth?redirect=/dashboard/profile"><LogIn className="h-4 w-4 mr-2" />Existing user? Sign in</Link></Button>
          </div>
          <p className="mt-3 text-sm opacity-75">Free for the first 60 days · Auto-approved</p>
        </div>
      </section>
      <section className="container py-12 grid md:grid-cols-3 gap-4">
        {['Free listing', 'Direct customer chat', 'Reviews & ratings', 'Service categories', 'Mobile-first profile', 'South Africa wide'].map((b) => <Card key={b} className="p-5 flex items-center gap-3"><Check className="h-5 w-5 text-accent" />{b}</Card>)}
      </section>
    </main>
    <Footer />
  </div>
);
export default BecomePro;
