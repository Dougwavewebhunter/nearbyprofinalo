import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer = () => (
  <footer className="border-t bg-secondary/40 mt-16">
    <div className="container py-10 grid gap-8 md:grid-cols-4">
      <div>
        <div className="flex items-center gap-2 mb-3"><Logo className="h-8 w-8" /><span className="font-bold">NearbyPro</span></div>
        <p className="text-sm text-muted-foreground">South Africa&apos;s marketplace for trusted local pros.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Explore</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/browse" className="hover:text-accent">Browse providers</Link></li>
          <li><Link to="/requests" className="hover:text-accent">Posted jobs</Link></li>
          <li><Link to="/post-request" className="hover:text-accent">Post a job</Link></li>
          <li><Link to="/become-pro" className="hover:text-accent">Become a Pro</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Account</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/auth" className="hover:text-accent">Sign in</Link></li>
          <li><Link to="/dashboard" className="hover:text-accent">Dashboard</Link></li>
          <li><Link to="/messages" className="hover:text-accent">Messages</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">WebDevPro</h4>
        <p className="text-sm text-muted-foreground">Web app designed by <a className="text-accent hover:underline" href="https://www.webdevpro.co.za" target="_blank" rel="noreferrer">www.webdevpro.co.za</a></p>
        <p className="mt-2 text-sm"><a className="text-accent hover:underline" href="tel:+27812159792">+27 81 215 9792</a></p>
      </div>
    </div>
    <div className="border-t py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} NearbyPro · Web app designed by <a className="text-accent hover:underline" href="https://www.webdevpro.co.za" target="_blank" rel="noreferrer">www.webdevpro.co.za</a> · <a className="text-accent hover:underline" href="tel:+27812159792">+27 81 215 9792</a></div>
  </footer>
);
