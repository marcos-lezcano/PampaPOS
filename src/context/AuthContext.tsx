import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/database.types';

// Extender el tipo User de Supabase con nuestras propiedades personalizadas
export interface User extends SupabaseUser {
  user_metadata: {
    full_name?: string;
    role?: UserRole;
    business_id?: string;
  };
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log(' Inicializando provider...');

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Función para obtener los datos extendidos del usuario
  const fetchUserData = async (userId: string) => {
    try {
      console.log('📬 [fetchUserData] Consultando datos para userId:', userId);
      
      // Solo seleccionar campos que sabemos que existen
      const { data, error } = await supabase
        .from('users')
        .select('id, business_id, role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ [fetchUserData] Error buscando usuario:', error);
        throw error;
      }

      if (!data) {
        console.error('❌ [fetchUserData] No se encontró el usuario');
        return null;
      }

      if (!data.business_id || !data.role) {
        console.error('❌ [fetchUserData] Datos incompletos:', data);
        return null;
      }

      console.log('✅ [fetchUserData] Datos encontrados:', {
        id: data.id,
        business_id: data.business_id,
        role: data.role
      });
      
      return data;
    } catch (error) {
      console.error('❌ [fetchUserData] Error fatal:', error);
      return null;
    }
  };

  // Efecto principal para la autenticación
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const checkSession = async () => {
      try {
        console.log(' Iniciando verificación de sesión...');
        setLoading(true);
        setUserDataLoading(true);

        // 1. Obtener sesión actual
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw new Error(`Error de sesión: ${sessionError.message}`);
        }

        if (!currentSession?.user) {
          console.log(' No hay sesión activa');
          setSession(null);
          setUser(null);
          setLoading(false);
          setUserDataLoading(false);
          return;
        }

        // 2. Actualizar sesión
        setSession(currentSession);

        // 3. Obtener datos extendidos del usuario
        console.log(' Usuario autenticado, obteniendo datos extendidos...');
        const userData = await fetchUserData(currentSession.user.id);

        if (!userData?.business_id) {
          console.error(' Usuario sin business_id en BD');
          setUser(null);
          setLoading(false);
          setUserDataLoading(false);
          return;
        }

        // 4. Actualizar usuario con datos extendidos
        const extendedUser = {
          ...currentSession.user,
          user_metadata: {
            ...currentSession.user.user_metadata,
            business_id: userData.business_id,
            role: userData.role
          }
        };

        console.log(' Datos de usuario actualizados:', {
          id: extendedUser.id,
          email: extendedUser.email,
          business_id: extendedUser.user_metadata.business_id,
          role: extendedUser.user_metadata.role
        });

        setUser(extendedUser as User);
      } catch (error) {
        console.error(' Error:', error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
        setUserDataLoading(false);
      }
    };

    // Ejecutar verificación inicial
    checkSession();

    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('📬 [onAuthStateChange] Evento:', event, 'Session:', {
        'session?.user?.id': session?.user?.id,
        'session?.user?.email': session?.user?.email
      });

      // Solo procesar eventos SIGNED_IN y SIGNED_OUT
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('🔓 [onAuthStateChange] Usuario autenticado');
        // No hacer nada más aquí, signIn() ya maneja todo
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        console.log('🔒 [onAuthStateChange] Evento:', event);
        setUser(null);
        setSession(null);
        setLoading(false);
        setUserDataLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialized]);

  const signIn = async (email: string, password: string) => {
    console.log('🔑 [signIn] Intentando login con email:', email);
    try {
      // 1. Resetear estados
      setLoading(true);
      setUserDataLoading(true);
      setUser(null);
      setSession(null);

      // 2. Intentar login
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('❌ [signIn] Error en login:', error);
        setLoading(false);
        setUserDataLoading(false);
        return { data: null, error };
      }

      if (!data.user || !data.session) {
        console.error('❌ [signIn] Login exitoso pero sin user/session');
        setLoading(false);
        setUserDataLoading(false);
        return { data: null, error: new Error('No user data') };
      }

      console.log('✅ [signIn] Login exitoso:', {
        'user.id': data.user.id,
        'user.email': data.user.email,
        'session.expires_at': data.session.expires_at
      });

      // 3. Obtener datos extendidos
      const userData = await fetchUserData(data.user.id);
      
      if (!userData) {
        console.error('❌ [signIn] No se encontraron datos del usuario');
        setLoading(false);
        setUserDataLoading(false);
        return { data: null, error: new Error('No user profile') };
      }

      // 4. Actualizar estado con todos los datos
      const extendedUser = {
        ...data.user,
        user_metadata: {
          ...data.user.user_metadata,
          business_id: userData.business_id,
          role: userData.role
        }
      };

      setUser(extendedUser as User);
      setSession(data.session);
      setLoading(false);
      setUserDataLoading(false);
      
      return { data: { user: extendedUser, session: data.session }, error: null };
    } catch (error) {
      console.error('❌ [signIn] Error inesperado:', error);
      setLoading(false);
      setUserDataLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Determinar si podemos mostrar la aplicación
  const hasRequiredData = Boolean(user?.user_metadata?.business_id);
  const isFullyLoaded = !loading && !userDataLoading;
  const isReady = isFullyLoaded && (hasRequiredData || !user);

  // Estado final para el contexto
  const contextValue: AuthContextType = {
    session,
    user,
    loading: !isReady,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {isReady ? children : null}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
