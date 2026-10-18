import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Lock,
  LogOut,
  RefreshCw,
  Search,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  User,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import { ViewState, DashboardData } from '../types';

interface DashboardPageProps {
  onNavigate: (view: ViewState) => void;
}

const ADMIN_STORAGE_KEY = 'csp_admin_auth';

interface StoredAuth {
  adminId: string;
  password: string;
}

/**
 * Scans localStorage for all saved learner progress records.
 */
function getAllLocalProgress(): Record<string, number[]> {
  const map: Record<string, number[]> = {};
  if (typeof window === 'undefined') return map;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cyber_safe_progress_')) {
        const userId = key.replace('cyber_safe_progress_', '').toLowerCase().trim();
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed === 'object' && parsed !== null) {
            const completedIds = Object.keys(parsed)
              .filter((k) => parsed[k] === true)
              .map(Number)
              .filter((n) => !isNaN(n) && n >= 1 && n <= 4);
            if (completedIds.length > 0) {
              map[userId] = completedIds;
            }
          }
        }
      }
    }
  } catch {
    // ignore
  }
  return map;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  // Authentication states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const parsed: StoredAuth = JSON.parse(stored);
        return parsed.adminId.toLowerCase() === 'admin' && parsed.password === 'cybersafe';
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [adminIdInput, setAdminIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data states
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Fetch dashboard data with admin credentials
  const fetchDashboardData = useCallback(async (adminId: string, password: string) => {
    setLoading(true);
    setFetchError(null);

    try {
      // 1. Gather any client-side cached progress to ensure accurate counts
      const localProgress = getAllLocalProgress();

      // 2. Get active Supabase auth session token if available
      let userToken: string | undefined;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        userToken = sessionData?.session?.access_token;
      } catch {
        // ignore
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${password}`,
        'x-admin-id': adminId,
        'x-local-progress': JSON.stringify(localProgress)
      };

      if (userToken) {
        headers['x-supabase-auth'] = userToken;
      }

      const response = await fetch('/api/dashboard-progress', {
        method: 'GET',
        headers
      });

      if (response.status === 401) {
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        setIsAdminAuthenticated(false);
        throw new Error(t('adminLoginErrorSessionExpired'));
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server error (${response.status})`);
      }

      const result: DashboardData = await response.json();

      // 3. Client-side merge guarantee: Ensure any progress saved in localStorage is reflected
      if (result && Array.isArray(result.users)) {
        const mergedUsers = result.users.map((u) => {
          const uid = String(u.id || '').toLowerCase().trim();
          const localModules = localProgress[uid] || [];
          const count = Math.max(u.completedModules, localModules.length);
          const total = u.totalModules || 4;
          const percentage = Math.round((count / total) * 100);

          return {
            ...u,
            completedModules: count,
            percentage,
            isFullyCompleted: count >= total
          };
        });

        const totalUsers = mergedUsers.length;
        const fullyCompletedUsers = mergedUsers.filter((u) => u.completedModules >= 4).length;

        setData({
          summary: {
            totalUsers,
            totalModules: 4,
            fullyCompletedUsers
          },
          users: mergedUsers
        });
      } else {
        setData(result);
      }
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setFetchError(err.message || 'Unable to connect to the dashboard API. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [t]);

  // On mount, if authenticated, fetch initial data
  useEffect(() => {
    if (isAdminAuthenticated) {
      try {
        const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY);
        if (stored) {
          const parsed: StoredAuth = JSON.parse(stored);
          fetchDashboardData(parsed.adminId, parsed.password);
        } else {
          fetchDashboardData('admin', 'cybersafe');
        }
      } catch {
        fetchDashboardData('admin', 'cybersafe');
      }
    }
  }, [isAdminAuthenticated, fetchDashboardData]);

  // Handle Admin Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanId = adminIdInput.trim();
    const cleanPassword = passwordInput.trim();

    if (!cleanId || !cleanPassword) {
      setLoginError(t('adminLoginErrorRequired'));
      return;
    }

    if (cleanId.toLowerCase() !== 'admin' || cleanPassword !== 'cybersafe') {
      setLoginError(t('adminLoginErrorInvalid'));
      return;
    }

    setIsLoggingIn(true);

    try {
      const localProgress = getAllLocalProgress();
      const response = await fetch('/api/dashboard-progress', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanPassword}`,
          'x-admin-id': cleanId,
          'x-local-progress': JSON.stringify(localProgress)
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setLoginError(t('adminLoginErrorInvalid'));
          setIsLoggingIn(false);
          return;
        }
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to authenticate with server');
      }

      const result: DashboardData = await response.json();

      // Merge local progress if needed
      if (result && Array.isArray(result.users)) {
        const mergedUsers = result.users.map((u) => {
          const uid = String(u.id || '').toLowerCase().trim();
          const localModules = localProgress[uid] || [];
          const count = Math.max(u.completedModules, localModules.length);
          const total = u.totalModules || 4;
          const percentage = Math.round((count / total) * 100);

          return {
            ...u,
            completedModules: count,
            percentage,
            isFullyCompleted: count >= total
          };
        });

        const totalUsers = mergedUsers.length;
        const fullyCompletedUsers = mergedUsers.filter((u) => u.completedModules >= 4).length;

        setData({
          summary: {
            totalUsers,
            totalModules: 4,
            fullyCompletedUsers
          },
          users: mergedUsers
        });
      } else {
        setData(result);
      }

      // Persist in sessionStorage for current browser session
      const authPayload: StoredAuth = { adminId: cleanId, password: cleanPassword };
      sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(authPayload));

      setIsAdminAuthenticated(true);
      setLoginError(null);
    } catch (err: any) {
      console.error('Admin login error:', err);
      setLoginError(err.message || t('adminLoginErrorGeneric'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = () => {
    try {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsAdminAuthenticated(false);
    setData(null);
    setAdminIdInput('');
    setPasswordInput('');
    setLoginError(null);
    setFetchError(null);
  };

  // Refresh current data
  const handleRefresh = () => {
    try {
      const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const parsed: StoredAuth = JSON.parse(stored);
        fetchDashboardData(parsed.adminId, parsed.password);
      } else {
        fetchDashboardData('admin', 'cybersafe');
      }
    } catch {
      fetchDashboardData('admin', 'cybersafe');
    }
  };

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];

    let result = [...data.users];

    // Status filter
    if (statusFilter === 'completed') {
      result = result.filter((u) => u.completedModules >= 4);
    } else if (statusFilter === 'in-progress') {
      result = result.filter((u) => u.completedModules > 0 && u.completedModules < 4);
    } else if (statusFilter === 'not-started') {
      result = result.filter((u) => u.completedModules === 0);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    // Alphabetical sort by name
    result.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [data, statusFilter, searchQuery, sortAsc]);

  // =========================================================================
  // 1. ADMIN LOGIN VIEW (Minimal and clean)
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="py-10 sm:py-14 max-w-md mx-auto px-4">
        {/* Back to Home Button */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-700 mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('btnBackToHome')}</span>
        </button>

        {/* Minimal Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
          <div className="mb-5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('adminLoginTitle')}</h1>
          </div>

          {/* Error Message */}
          {loginError && (
            <div
              role="alert"
              className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Admin ID Field */}
            <div>
              <label
                htmlFor="admin-id"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                {t('adminIdLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-id"
                  type="text"
                  value={adminIdInput}
                  onChange={(e) => setAdminIdInput(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors bg-white text-slate-900 shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                {t('adminPasswordLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors bg-white text-slate-900 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label={showPassword ? t('adminHidePassword') : t('adminShowPassword')}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t('adminVerifying')}</span>
                  </>
                ) : (
                  <span>{t('adminSignInBtn')}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. ADMIN DASHBOARD VIEW (Minimal and clean)
  // =========================================================================
  const summary = data?.summary || { totalUsers: 0, totalModules: 4, fullyCompletedUsers: 0 };
  const completionRate =
    summary.totalUsers > 0
      ? Math.round((summary.fullyCompletedUsers / summary.totalUsers) * 100)
      : 0;

  return (
    <div className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header & Navigation */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-700 transition-colors cursor-pointer group mb-3"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
          <span>{t('btnBackToHome')}</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('adminDashboardTitle')}
            </h1>
          </div>

          {/* Action Buttons: Refresh & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors disabled:opacity-50"
              title={t('adminRefreshBtn')}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              <span>{t('adminRefreshBtn')}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-lg shadow-2xs transition-colors"
              title={t('adminLogoutBtn')}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('adminLogoutBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {fetchError && (
        <div
          role="alert"
          className="mb-6 p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-900 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors shrink-0"
          >
            {t('adminRetryBtn')}
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <section aria-labelledby="summary-heading" className="mb-6">
        <h2 id="summary-heading" className="sr-only">{t('adminSummaryHeading')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Total Users */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {t('adminTotalUsers')}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {loading && !data ? '—' : summary.totalUsers}
            </div>
          </div>

          {/* Card 2: Total Modules */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {t('adminTotalModules')}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              4
            </div>
          </div>

          {/* Card 3: Fully Completed Users */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t('adminFullyCompletedUsers')}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                {completionRate}%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {loading && !data ? '—' : summary.fullyCompletedUsers}
            </div>
          </div>
        </div>
      </section>

      {/* Users Progress Section */}
      <section aria-labelledby="table-heading" className="space-y-4">
        {/* Controls: Search and Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 id="table-heading" className="text-base sm:text-lg font-bold text-slate-900">
              {t('adminRegisteredUsers')}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={t('adminSearchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {t('adminFilterAll')}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {t('adminFilterCompleted')}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('in-progress')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'in-progress'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {t('adminFilterInProgress')}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('not-started')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'not-started'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {t('adminFilterNotStarted')}
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Responsive Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {loading && !data ? (
            /* Loading State */
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs sm:text-sm font-semibold text-slate-700">{t('adminLoadingUsers')}</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty State */
            <div className="py-12 px-4 text-center space-y-2">
              <p className="text-sm font-bold text-slate-800">
                {data?.users?.length === 0 ? t('adminNoUsers') : t('adminNoMatchingUsers')}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs font-semibold text-blue-700 hover:underline"
                >
                  {t('adminClearSearch')}
                </button>
              )}
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700 border-collapse">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-2xs font-bold text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="py-3 px-4 sm:px-6">
                      <button
                        type="button"
                        onClick={() => setSortAsc(!sortAsc)}
                        className="inline-flex items-center gap-1 hover:text-blue-700 transition-colors focus:outline-none"
                        title={t('adminToggleSort')}
                      >
                        <span>{t('adminTableName')}</span>
                        {sortAsc ? (
                          <ArrowUp className="w-3 h-3 text-blue-600" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-blue-600" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="py-3 px-4 sm:px-6">
                      {t('adminTableEmail')}
                    </th>
                    <th scope="col" className="py-3 px-4 sm:px-6 min-w-[200px]">
                      {t('adminTableProgress')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((item) => {
                    const isComplete = item.completedModules >= item.totalModules;
                    const hasStarted = item.completedModules > 0;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Name Column */}
                        <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-200">
                              {item.name.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="truncate">{item.name}</span>
                          </div>
                        </td>

                        {/* Email Column */}
                        <td className="py-3.5 px-4 sm:px-6 text-slate-600">
                          <div className="flex items-center gap-1.5 font-mono text-xs">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{item.email}</span>
                          </div>
                        </td>

                        {/* Progress Column */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="space-y-1.5">
                            {/* Text labels: "3 / 4 modules" & "75%" */}
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-slate-800">
                                {t('adminModulesCount', { completed: item.completedModules, total: item.totalModules })}
                              </span>
                              <span
                                className={`${
                                  isComplete
                                    ? 'text-emerald-700 font-bold'
                                    : hasStarted
                                    ? 'text-blue-700 font-bold'
                                    : 'text-slate-400'
                                }`}
                              >
                                {item.percentage}%
                              </span>
                            </div>

                            {/* Minimal visual progress bar matching ModulesPage */}
                            <div
                              className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/80"
                              role="progressbar"
                              aria-valuenow={item.percentage}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${item.name}'s progress: ${item.percentage}%`}
                            >
                              <div
                                style={{ width: `${item.percentage}%` }}
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isComplete
                                    ? 'bg-emerald-600'
                                    : hasStarted
                                    ? 'bg-blue-600'
                                    : 'bg-slate-300'
                                }`}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
