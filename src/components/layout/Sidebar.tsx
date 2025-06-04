import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();

  const routes = [
    {
      path: '/',
      name: 'Dashboard',
      icon: <Icons.LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: '/new-sale',
      name: 'Nueva Venta',
      icon: <Icons.ShoppingCart className="h-5 w-5" />,
    },
    {
      path: '/products',
      name: 'Productos',
      icon: <Icons.Package className="h-5 w-5" />,
    },
    {
      path: '/sales',
      name: 'Historial',
      icon: <Icons.BarChart3 className="h-5 w-5" />,
    },
    {
      path: '/settings',
      name: 'Configuración',
      icon: <Icons.Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div 
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <h1 className="text-xl font-bold text-primary">PampaPOS</h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("ml-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Icons.ChevronRight className="h-4 w-4" /> : <Icons.ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="flex-1 p-2 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === route.path
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            )}
          >
            {route.icon}
            {!collapsed && <span className="ml-3">{route.name}</span>}
          </Link>
        ))}
      </nav>
      
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={toggleTheme}
          className="w-full justify-start"
        >
          {theme === 'dark' ? (
            <>
              <Icons.Sun className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Modo Claro</span>}
            </>
          ) : (
            <>
              <Icons.Moon className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Modo Oscuro</span>}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}