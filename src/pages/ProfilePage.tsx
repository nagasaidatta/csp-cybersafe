import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  CircleDot,
  Edit3,
  ExternalLink,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Avatar } from '../components/Avatar';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { modulesData } from '../data/modulesData';
import { ViewState } from '../types';

interface ProfilePageProps {
  onNavigate: (view: ViewState) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [highestQuizScore, setHighestQuizScore] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    let score: number | null = null;
    const completed: Record<number, boolean> = {};

    try {
      const localScore = localStorage.getItem(`cyber_safe_quiz_score_${user.id}`);
      const parsedScore = localScore === null ? NaN : Number.parseInt(localScore, 10);
      if (!Number.isNaN(parsedScore) && parsedScore >= 0) {
        score = parsedScore;
      }
      const localProgress = localStorage.getItem(`cyber_safe_progress_${user.id}`);
      if (localProgress) {
        const parsed = JSON.parse(localProgress) as Record<string, boolean>;
        Object.entries(parsed).forEach(([id, done]) => {
          if (done) completed[Number(id)] = true;
        });
      }
    } catch {
      // Local progress fallback
    }

    if (isSupabaseConfigured) {
      try {
        const [{ data: scoreData }, { data: moduleData }] = await Promise.all([
          supabase.from('quiz_scores').select('highest_score').eq('user_id', user.id).maybeSingle(),
          supabase.from('module_progress').select('module_id, completed').eq('user_id', user.id),
        ]);

        if (typeof scoreData?.highest_score === 'number') {
          score = Math.max(score ?? 0, scoreData.highest_score);
        }

        moduleData?.forEach((item: { module_id: number; completed: boolean }) => {
          if (item.completed) completed[item.module_id] = true;
        });
      } catch (error) {
        console.warn('Unable to load profile progress:', error);
      }
    }

    setHighestQuizScore(score);
    setCompletedModules(completed);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const totalModules = modulesData.length;
  const completedCount = modulesData.filter((module) => completedModules[module.id]).length;
  const completion = totalModules ? Math.round((completedCount / totalModules) * 100) : 0;
  const displayName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Learner';
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 pb-16">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-7">
        {/* Navigation Breadcrumb */}
        <div className="mb-1 sm:mb-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 py-1 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-700 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
            <span>{t('navHome')}</span>
          </button>
        </div>

        {/* Profile Header Card */}
        <section className="rounded-2xl bg-white p-4 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3.5 sm:gap-5 min-w-0">
              {/* Avatar */}
              <div className="shrink-0">
                <Avatar
                  avatarId={profile?.avatar_id}
                  size="lg"
                  className="w-16 h-16 sm:w-20 sm:h-20 ring-2 ring-slate-100 shadow-xs"
                />
              </div>

              {/* User Details */}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 truncate">
                  {displayName}
                </h1>

                <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-slate-500">
                  <p className="flex items-center gap-1.5 truncate text-slate-600">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{user?.email}</span>
                  </p>
                  {memberSince && (
                    <p className="flex items-center gap-1.5 text-slate-400 text-xs shrink-0">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{t('profileMemberSince')} {memberSince}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Profile CTA */}
            <button
              type="button"
              onClick={() => onNavigate('edit-profile')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 shrink-0 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{t('profileEditAction')}</span>
            </button>
          </div>
        </section>

        {/* Learning Dashboard Overview */}
        <section aria-labelledby="learning-heading" className="space-y-3.5 sm:space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 id="learning-heading" className="text-base sm:text-xl font-bold tracking-tight text-slate-900">
                {t('profileProgressSection')}
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                {t('profileProgressSubtitle')}
              </p>
            </div>
            <button
              type="button"
              onClick={loadProgress}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors disabled:opacity-50 cursor-pointer shrink-0 mt-0.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* 3 Stat Cards Side by Side - Clean, uncluttered KPI cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* Card 1: Quiz Score */}
            <div
              onClick={() => onNavigate('quiz')}
              className="flex flex-col justify-between h-full rounded-xl sm:rounded-2xl bg-white p-3 sm:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="grid h-6 w-6 sm:h-8 sm:w-8 place-items-center rounded-lg bg-blue-100/70 text-blue-700 shrink-0">
                    <Award className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
                  </span>
                  <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-600 line-clamp-1 leading-tight">
                    {t('profileHighestQuizScore')}
                  </p>
                </div>

                <p className="mt-2.5 sm:mt-3.5 text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                  {isLoading ? '—' : `${highestQuizScore ?? 0} / 10`}
                </p>
              </div>

              <div className="mt-2 sm:mt-3 pt-2 border-t border-slate-100">
                <p className="text-[10px] sm:text-xs font-medium text-slate-500 truncate">
                  {highestQuizScore !== null
                    ? highestQuizScore >= 8
                      ? 'Mastery achieved'
                      : 'Keep practicing'
                    : t('profileQuizNotAttempted')}
                </p>
              </div>
            </div>

            {/* Card 2: Total Modules */}
            <div
              onClick={() => onNavigate('modules')}
              className="flex flex-col justify-between h-full rounded-xl sm:rounded-2xl bg-white p-3 sm:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="grid h-6 w-6 sm:h-8 sm:w-8 place-items-center rounded-lg bg-emerald-100/70 text-emerald-700 shrink-0">
                    <BookOpen className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
                  </span>
                  <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-600 line-clamp-1 leading-tight">
                    {t('adminTotalModules')}
                  </p>
                </div>

                <p className="mt-2.5 sm:mt-3.5 text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                  {isLoading ? '—' : `${completedCount} / ${totalModules}`}
                </p>
              </div>

              <div className="mt-2 sm:mt-3 pt-2 border-t border-slate-100">
                <p className="text-[10px] sm:text-xs font-medium text-slate-500 truncate">
                  {completedCount === totalModules
                    ? 'All completed'
                    : `${totalModules - completedCount} remaining`}
                </p>
              </div>
            </div>

            {/* Card 3: Course Completion */}
            <div
              onClick={() => onNavigate('modules')}
              className="flex flex-col justify-between h-full rounded-xl sm:rounded-2xl bg-white p-3 sm:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="grid h-6 w-6 sm:h-8 sm:w-8 place-items-center rounded-lg bg-indigo-100/70 text-indigo-700 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
                  </span>
                  <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-600 line-clamp-1 leading-tight">
                    {t('profileCourseCompletion')}
                  </p>
                </div>

                <p className="mt-2.5 sm:mt-3.5 text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                  {isLoading ? '—' : `${completion}%`}
                </p>
              </div>

              <div className="mt-2 sm:mt-3 pt-2 border-t border-slate-100">
                <div className="h-1.5 sm:h-2 overflow-hidden rounded-full bg-slate-100 mb-1">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <p className="text-[10px] sm:text-xs font-medium text-slate-500 truncate">
                  {completedCount} of {totalModules} complete
                </p>
              </div>
            </div>
          </div>

          {/* Clean Action Buttons Row - Spacious, easy to tap, no text truncation */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('quiz')}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:shadow hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
              <span className="truncate">{highestQuizScore !== null ? t('profileRetakeQuiz') : t('profileTakeQuiz')}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('modules')}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-blue-600 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">{completedCount > 0 ? t('profileContinueLearning') : t('profileStartLearning')}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 hidden xs:inline" />
            </button>
          </div>
        </section>

        {/* Course Activity Breakdown Section */}
        <section
          className="overflow-hidden rounded-2xl bg-white shadow-sm"
          aria-labelledby="modules-heading"
        >
          <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-6 gap-3">
            <div className="min-w-0">
              <h2 id="modules-heading" className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {t('profileModuleBreakdown')}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 truncate">
                Learning curriculum and completion records
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 shrink-0 bg-slate-100 px-2.5 py-1 rounded-full">
              {completedCount} / {totalModules} Completed
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {modulesData.map((module, index) => {
              const done = Boolean(completedModules[module.id]);
              return (
                <div
                  key={module.id}
                  className="flex items-center justify-between gap-3 p-3.5 sm:px-6 sm:py-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                        done
                          ? 'bg-emerald-100/80 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {done ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : index + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-2 leading-snug">
                      {t(module.titleKey as never)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium ${
                        done ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <CircleDot className="w-3.5 h-3.5 text-slate-300" />
                      )}
                      <span>
                        {done ? t('profileModuleStatusDone') : t('profileModuleStatusPending')}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('modules')}
                      className="p-1.5 text-slate-400 hover:text-blue-700 transition-colors cursor-pointer rounded-lg hover:bg-slate-100 active:bg-slate-200"
                      aria-label={`View ${t(module.titleKey as never)}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
