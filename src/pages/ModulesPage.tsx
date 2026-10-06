import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Circle, ArrowRight, BookOpen, Play } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { modulesData } from '../data/modulesData';
import { ViewState } from '../types';

interface ModulesPageProps {
  onNavigate: (view: ViewState) => void;
}

export const ModulesPage: React.FC<ModulesPageProps> = ({ onNavigate }) => {
  const { t, strings } = useLanguage();
  const { user } = useAuth();

  const [completedModules, setCompletedModules] = useState<Record<number, boolean>>({});
  const [updatingModule, setUpdatingModule] = useState<number | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<Record<number, boolean>>({});

  // 1. Single query to fetch module progress on initial load
  const loadProgress = useCallback(async () => {
    if (!user) {
      return;
    }

    // Check localStorage cache first for fast display
    const cached = localStorage.getItem(`cyber_safe_progress_${user.id}`);
    if (cached) {
      try {
        setCompletedModules(JSON.parse(cached));
      } catch {
        // ignore parse error
      }
    }

    if (!isSupabaseConfigured) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('module_progress')
        .select('module_id, completed')
        .eq('user_id', user.id);

      if (error) {
        console.warn('Progress load note:', error.message);
      } else if (data) {
        const progressMap: Record<number, boolean> = {};
        data.forEach((row: { module_id: number; completed: boolean }) => {
          if (row.completed) {
            progressMap[row.module_id] = true;
          }
        });
        setCompletedModules(progressMap);
        localStorage.setItem(`cyber_safe_progress_${user.id}`, JSON.stringify(progressMap));
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  }, [user]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // 2. Mark module completed
  const handleCompleteModule = async (moduleId: number) => {
    if (completedModules[moduleId] || updatingModule === moduleId || !user) {
      return;
    }

    setUpdatingModule(moduleId);

    // Optimistically update local state immediately
    const nextCompleted = { ...completedModules, [moduleId]: true };
    setCompletedModules(nextCompleted);
    localStorage.setItem(`cyber_safe_progress_${user.id}`, JSON.stringify(nextCompleted));

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('module_progress')
          .upsert(
            {
              user_id: user.id,
              module_id: moduleId,
              completed: true,
              completed_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,module_id' }
          );

        if (error) {
          console.warn('Database note on module progress save:', error.message);
        }
      } catch (err) {
        console.error('Failed to persist module progress:', err);
      }
    }

    setUpdatingModule(null);
  };

  const completedCount = Object.values(completedModules).filter(Boolean).length;
  const totalModules = 4;
  const percentCompleted = (completedCount / totalModules) * 100;
  const isAllCompleted = completedCount === totalModules;

  return (
    <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('modulesTitle')}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {t('homeDescription')}
        </p>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">
              {t('progressTitle')}
            </h2>
          </div>
          <span className="text-sm font-semibold text-slate-700">
            {t('progressCompleted', {
              completed: completedCount,
              percent: percentCompleted,
            })}
          </span>
        </div>

        {/* Progress Bar Track */}
        <div
          className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200"
          role="progressbar"
          aria-valuenow={percentCompleted}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isAllCompleted ? 'bg-emerald-600' : 'bg-blue-600'
            }`}
            style={{ width: `${percentCompleted}%` }}
          />
        </div>

        {/* Quiz Unlock Button Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {isAllCompleted ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                All modules completed! The quiz is now unlocked.
              </span>
            ) : (
              <span>{t('btnTakeQuizDisabledNotice')}</span>
            )}
          </div>

          <button
            type="button"
            disabled={!isAllCompleted}
            onClick={() => onNavigate('quiz')}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isAllCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-600 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <span>{t('btnTakeQuiz')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-10">
        {modulesData.map((item) => {
          const isCompleted = Boolean(completedModules[item.id]);
          const isVideoActive = Boolean(activeVideoId[item.id]);

          // Get translated module title, transcript, and takeaways
          const title = strings[item.titleKey as keyof typeof strings] as string || '';
          const transcript = strings[item.transcriptKey as keyof typeof strings] as string || '';
          const takeaways = (strings[item.takeawaysKey as keyof typeof strings] as unknown as string[]) || [];

          return (
            <article
              key={item.id}
              className={`bg-white rounded-lg border transition-colors overflow-hidden ${
                isCompleted
                  ? 'border-emerald-300 shadow-sm'
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              {/* Module Header */}
              <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded bg-blue-100 text-blue-800 border border-blue-200">
                    {t('moduleLabel')} {item.id}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {title}
                  </h3>
                </div>

                {/* Completion Status Badge */}
                {isCompleted && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Completed</span>
                  </span>
                )}
              </div>

              <div className="p-5 sm:p-6 space-y-6">
                {/* Performance-Friendly YouTube Embed */}
                <div>
                  <div className="relative aspect-video w-full rounded-md overflow-hidden bg-slate-900 shadow-inner">
                    {isVideoActive ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1`}
                        title={`Module ${item.id} - ${title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full border-0"
                      />
                    ) : (
                      /* Facade: Loads lightweight thumbnail with play button, loads iframe on click */
                      <div className="relative w-full h-full flex flex-col items-center justify-center group">
                        <img
                          src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
                          alt={`Thumbnail for ${title}`}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                        />
                        <button
                          type="button"
                          onClick={() => setActiveVideoId((prev) => ({ ...prev, [item.id]: true }))}
                          className="relative z-10 w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-400"
                          aria-label={`Play video for ${title}`}
                        >
                          <Play className="w-8 h-8 fill-white ml-1" />
                        </button>
                        <span className="relative z-10 mt-3 text-xs font-semibold text-white bg-black/60 px-3 py-1 rounded">
                          Click to Play Video
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transcript Section */}
                <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {t('transcriptLabel')}
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {transcript}
                  </p>
                </div>

                {/* Key Takeaways Section */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2.5">
                    {t('keyTakeaways')}
                  </h4>
                  <ul className="space-y-2">
                    {takeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Complete Module Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={isCompleted || updatingModule === item.id}
                    onClick={() => handleCompleteModule(item.id)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
                        : 'bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-600 cursor-pointer'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{t('btnCompleted')}</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-white" />
                        <span>{updatingModule === item.id ? 'Saving...' : t('btnComplete')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom Sticky/Prompt for Quiz */}
      <div className="mt-12 text-center p-6 bg-slate-100 rounded-lg border border-slate-300">
        <p className="text-sm text-slate-700 mb-4 font-medium">
          {isAllCompleted
            ? 'Ready to test your knowledge? Take the 10-question scam awareness quiz.'
            : `${totalModules - completedCount} more module(s) to complete before taking the quiz.`}
        </p>
        <button
          type="button"
          disabled={!isAllCompleted}
          onClick={() => onNavigate('quiz')}
          className={`inline-flex items-center gap-2 px-7 py-3 text-sm font-bold rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isAllCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-600 cursor-pointer'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>{t('btnTakeQuiz')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
