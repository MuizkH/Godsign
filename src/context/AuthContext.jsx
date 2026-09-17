import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve active session details and load profiles
  const checkUserStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            ...session.user,
            name: profile.name,
            role: profile.role,
            department: profile.department || 'none', // map database null to frontend 'none'
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error recovering session details:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserStatus();

    // Listen to Supabase authorization status updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            ...session.user,
            name: profile.name,
            role: profile.role,
            department: profile.department || 'none',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Log in using Supabase email/password auth
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Query database table for RBAC permissions
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error(profileError?.message || 'User profile not found in profiles database table');
      }

      const userData = {
        ...data.user,
        name: profile.name,
        role: profile.role,
        department: profile.department || 'none',
      };

      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login action error:', error.message);
      throw error;
    }
  };

  // Sign up using Supabase email/password auth
  const signup = async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Insert into profiles
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            name: name,
            role: 'citizen',
            department: 'none'
          }
        ]);
        if (profileError) throw profileError;

        const userData = {
          ...data.user,
          name: name,
          role: 'citizen',
          department: 'none',
        };

        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error('Signup action error:', error.message);
      throw error;
    }
  };

  // Log out of Supabase session
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Logout action error:', error.message);
    }
  };

  // Helper to fetch authorization header for Express backend calls
  const getAuthHeader = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session ? { 'Authorization': `Bearer ${session.access_token}` } : {};
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    getAuthHeader,
    checkUserStatus,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
