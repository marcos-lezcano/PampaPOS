import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { TicketProvider } from '@/context/TicketContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Dashboard } from '@/pages/Dashboard';
import { NewSale } from '@/pages/NewSale';
import { Products } from '@/pages/Products';
import { SalesHistory } from '@/pages/SalesHistory';
import { Settings } from '@/pages/Settings';
import { Login } from '@/pages/Login';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from '@/components/ui/use-toast';

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading, session } = useAuth();
  
  console.log('🔒 [ProtectedRoute] Estado completo:', {
    loading,
    'session?.expires_at': session?.expires_at,
    'user?.id': user?.id,
    'user?.email': user?.email,
    'user?.user_metadata?.business_id': user?.user_metadata?.business_id,
    'user?.role': user?.user_metadata?.role
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground text-lg animate-pulse">Cargando...</div>
      </div>
    );
  }

  if (!user || !session) {
    console.log('⛔ [ProtectedRoute] No hay usuario o sesión:', {
      hasUser: !!user,
      hasSession: !!session,
      loading
    });
    return <Navigate to="/login" replace />;
  }

  // Verificar que el usuario tenga todos los datos necesarios
  if (!user.user_metadata?.business_id) {
    console.error('❌ [ProtectedRoute] Usuario sin business_id:', {
      'user.id': user.id,
      'user.email': user.email,
      'user.user_metadata': user.user_metadata
    });
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-destructive text-lg">
          Error: Datos de usuario incompletos. Por favor, cierre sesión y vuelva a ingresar.
        </div>
      </div>
    );
  }

  console.log('✅ [ProtectedRoute] Acceso permitido para:', user.email);
  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-sale"
          element={
            <ProtectedRoute>
              <NewSale />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SalesHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        {/* Redirección para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TicketProvider>
  <ToastProvider>
    <AppContent />
    <Toaster />
  </ToastProvider>
</TicketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;