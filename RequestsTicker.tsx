import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { MapPin, Shield, MessageSquare, LayoutDashboard, LogOut, User as UserIcon, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export const Header = ({ onLocationClick }: { onLocationClick?: () => void }) => {
  const { user, isAdmin, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex min-h-16 items-center justify-between gap-2 py-2">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Logo className="h-9 w-9" />
          <span className="font-bold text-base sm:text-lg tracking-tight">Nearby<span className="text-accent">Pro</span></span>
        </Link>
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <NavLink to="/browse" className={({isActive}) => isActive ? "text-accent" : "hover:text-accent transition-colors"}>Browse</NavLink>
          <NavLink to="/requests" className={({isActive}) => isActive ? "text-accent" : "hover:text-accent transition-colors"}>Jobs</NavLink>
          <NavLink to="/become-pro" className={({isActive}) => isActive ? "text-accent" : "hover:text-accent transition-colors"}>Join as Pro</NavLink>
        </nav>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button asChild size="sm" className="bg-gradient-brand text-accent-foreground shadow-glow gap-1 px-3">
            <Link to="/post-request"><PlusCircle className="h-4 w-4" /> <span>Post Job</span></Link>
          </Button>
          <Button variant="outline" size="sm" onClick={onLocationClick} className="gap-1 px-2 hidden sm:inline-flex">
            <MapPin className="h-4 w-4" /> <span className="hidden md:inline">Find near you</span>
          </Button>
          {user ? (
            <>
              <Button asChild variant="ghost" size="icon"><Link to="/messages" aria-label="Messages"><MessageSquare className="h-5 w-5" /></Link></Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Account"><UserIcon className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild><Link to="/dashboard"><LayoutDashboard className="h-4 w-4 mr-2" />Dashboard</Link></DropdownMenuItem>
                  {isAdmin && <DropdownMenuItem asChild><Link to="/admin"><Shield className="h-4 w-4 mr-2" />Admin</Link></DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}><LogOut className="h-4 w-4 mr-2" />Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="sm" variant="secondary" className="whitespace-nowrap"><Link to="/auth?mode=signup">Join</Link></Button>
          )}
          <Link to="/admin-login" aria-label="Admin" className="opacity-30 hover:opacity-100 transition-opacity hidden sm:block">
            <Shield className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
