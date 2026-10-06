import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UserProfile } from '../types';

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isRegistered: boolean;
  refreshProfile: () => Promise<void>;
  saveProfile: (name: string, email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, userEmail?: string, userMetaName?: string) => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, created_at')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        // Log gently without sensitive data
        console.warn('Profile fetch note:', error.message);
      }

      if (data) {
        setProfile(data);
      } else {
        // Fallback to auth metadata if profile record is still being created
        const fallbackName = userMetaName || userEmail?.split('@')[0] || 'User';
        setProfile({
          id: userId,
          name: fallbackName,
          email: userEmail || '',
        });
      }
    } catch {
      // Avoid crash on network/offline
      if (userEmail) {
        setProfile({
          id: userId,
          name: userMetaName || userEmail.split('@')[0] || 'User',
          email: userEmail,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 1. Initial session restoration
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(
          session.user.id,
          session.user.email,
          session.user.user_metadata?.name
        ).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });

    // 2. Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(
            currentSession.user.id,
            currentSession.user.email,
            currentSession.user.user_metadata?.name
          );
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const saveProfile = async (name: string, email: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const profileData = {
        id: user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (error) {
        console.error('Failed to store profile in database:', error.message);
        // Still update local state with non-sensitive data
      }

      setProfile({
        id: user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });

      return !error;
    } catch (err) {
      console.error('Error saving profile:', err);
      return false;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email, user.user_metadata?.name);
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Sign out error:', err);
      }
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const isRegistered = Boolean(user && profile?.name);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isRegistered,
        refreshProfile,
        saveProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
