import { useTicket } from '@/context/TicketContext';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { totalItems } = useTicket();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/login');
    } else {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  // Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-10 flex items-center h-16 px-6 transition-all duration-200",
      scrolled 
        ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-sm" 
        : "bg-transparent"
    )}>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      
      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <a href="/new-sale">
            <Icons.ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              >
                {totalItems > 99 ? '99+' : totalItems}
              </Badge>
            )}
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icons.LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}