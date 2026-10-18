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
  saveProfile: (name: string, email: string, avatarId?: string) => Promise<boolean>;
  updateAvatar: (avatarId: string) => Promise<boolean>;
  updateDisplayName: (name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const getCachedAvatar = (userId: string): string => {
    try {
      const stored = localStorage.getItem(`cyber_safe_avatar_${userId}`);
      if (stored) return stored;
    } catch {
      // ignore
    }
    return 'avatar-1';
  };

  const fetchProfile = useCallback(async (userId: string, userEmail?: string, userMetaName?: string) => {
    const cachedAvatar = getCachedAvatar(userId);

    if (!isSupabaseConfigured) {
      const fallbackName = userMetaName || userEmail?.split('@')[0] || 'User';
      setProfile({
        id: userId,
        name: fallbackName,
        email: userEmail || '',
        avatar_id: cachedAvatar,
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_id, highest_quiz_score, created_at')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        // Log gently without sensitive data
        console.warn('Profile fetch note:', error.message);
      }

      if (data) {
        const resolvedAvatar = data.avatar_id || cachedAvatar || 'avatar-1';
        try {
          localStorage.setItem(`cyber_safe_avatar_${userId}`, resolvedAvatar);
        } catch {
          // ignore
        }
        setProfile({
          ...data,
          avatar_id: resolvedAvatar,
        });
      } else {
        // Fallback to auth metadata if profile record is still being created
        const fallbackName = userMetaName || userEmail?.split('@')[0] || 'User';
        setProfile({
          id: userId,
          name: fallbackName,
          email: userEmail || '',
          avatar_id: cachedAvatar,
        });
      }
    } catch {
      // Avoid crash on network/offline
      if (userEmail) {
        setProfile({
          id: userId,
          name: userMetaName || userEmail.split('@')[0] || 'User',
          email: userEmail,
          avatar_id: cachedAvatar,
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

  const saveProfile = async (name: string, email: string, avatarId?: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const finalAvatar = avatarId || profile?.avatar_id || getCachedAvatar(user.id);
      const profileData = {
        id: user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatar_id: finalAvatar,
        created_at: new Date().toISOString(),
      };

      try {
        localStorage.setItem(`cyber_safe_avatar_${user.id}`, finalAvatar);
      } catch {
        // ignore
      }

      setProfile({
        id: user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatar_id: finalAvatar,
      });

      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' });

        if (error) {
          console.error('Failed to store profile in database:', error.message);
          return false;
        }
      }

      return true;
    } catch (err) {
      console.error('Error saving profile:', err);
      return false;
    }
  };

  const updateAvatar = async (avatarId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      localStorage.setItem(`cyber_safe_avatar_${user.id}`, avatarId);
    } catch {
      // ignore
    }

    setProfile((prev) => (prev ? { ...prev, avatar_id: avatarId } : {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatar_id: avatarId,
    }));

    if (!isSupabaseConfigured) return true;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_id: avatarId })
        .eq('id', user.id);

      if (error) {
        console.warn('Avatar update note:', error.message);
        // Fallback upsert if record did not exist yet
        await supabase.from('profiles').upsert({
          id: user.id,
          name: profile?.name || user.user_metadata?.name || 'User',
          email: user.email || '',
          avatar_id: avatarId,
        }, { onConflict: 'id' });
      }

      return true;
    } catch (err) {
      console.warn('Error updating avatar:', err);
      return false;
    }
  };

  const updateDisplayName = async (name: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 50) {
      return { success: false, error: 'Name must be between 2 and 50 characters' };
    }

    setProfile((prev) => (prev ? { ...prev, name: trimmed } : null));

    if (!isSupabaseConfigured) return { success: true };

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name: trimmed })
        .eq('id', user.id);

      if (profileError) {
        console.warn('Profile name update note:', profileError.message);
      }

      const { error: authError } = await supabase.auth.updateUser({
        data: { name: trimmed },
      });

      if (authError) {
        console.warn('Auth user metadata update note:', authError.message);
      }

      return { success: !profileError && !authError };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update name';
      return { success: false, error: msg };
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
        updateAvatar,
        updateDisplayName,
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
