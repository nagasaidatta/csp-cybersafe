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
  const [syncNote, setSyncNote] = useState<string | null>(null);

  // 1. Fetch module progress on initial load with cache preservation
  const loadProgress = useCallback(async () => {
    if (!user) {
      return;
    }

    // Check localStorage cache first for fast display
    const cachedStr = localStorage.getItem(`cyber_safe_progress_${user.id}`);
    let cachedMap: Record<number, boolean> = {};
    if (cachedStr) {
      try {
        cachedMap = JSON.parse(cachedStr) || {};
        setCompletedModules(cachedMap);
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
        // Do NOT overwrite local progress if database query errored
        return;
      }

      if (data && data.length > 0) {
        // Database has records: reflect verified state
        const progressMap: Record<number, boolean> = {};
        data.forEach((row: { module_id: number; completed: boolean }) => {
          if (row.completed) {
            progressMap[row.module_id] = true;
          }
        });
        setCompletedModules(progressMap);
        localStorage.setItem(`cyber_safe_progress_${user.id}`, JSON.stringify(progressMap));
      } else if (data && data.length === 0) {
        // If DB returned 0 records but the user has local progress,
        // proactively sync the locally completed modules so progress is NOT lost!
        const cachedCompletedIds = Object.keys(cachedMap)
          .map(Number)
          .filter((id) => cachedMap[id]);

        if (cachedCompletedIds.length > 0) {
          for (const mid of cachedCompletedIds) {
            try {
              await supabase.from('module_progress').upsert(
                {
                  user_id: user.id,
                  module_id: mid,
                  completed: true,
                  completed_at: new Date().toISOString(),
                },
                { onConflict: 'user_id,module_id' }
              );
            } catch (syncErr) {
              console.warn('Initial sync note for module', mid, syncErr);
            }
          }
        } else {
          // Fresh user with 0 completed modules
          setCompletedModules({});
          localStorage.setItem(`cyber_safe_progress_${user.id}`, JSON.stringify({}));
        }
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  }, [user]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // 2. Toggle module completion (Completed <-> Uncompleted)
  const handleToggleModule = async (moduleId: number) => {
    if (updatingModule === moduleId || !user) {
      return;
    }

    const currentStatus = Boolean(completedModules[moduleId]);
    const nextStatus = !currentStatus;

    setUpdatingModule(moduleId);
    setSyncNote(null);

    // Optimistically update local state & localStorage immediately
    const nextCompleted = { ...completedModules, [moduleId]: nextStatus };
    setCompletedModules(nextCompleted);
    localStorage.setItem(`cyber_safe_progress_${user.id}`, JSON.stringify(nextCompleted));

    if (isSupabaseConfigured) {
      try {
        let saveSucceeded = false;
        let lastError: any = null;

        // Primary strategy: Upsert with onConflict
        const { error: upsertErr } = await supabase
          .from('module_progress')
          .upsert(
            {
              user_id: user.id,
              module_id: moduleId,
              completed: nextStatus,
              completed_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,module_id' }
          );

        if (!upsertErr) {
          saveSucceeded = true;
        } else {
          lastError = upsertErr;
          console.warn('Upsert note, trying fallback update/insert:', upsertErr.message);

          // Fallback Strategy: Direct update
          const { data: updateData, error: updateErr } = await supabase
            .from('module_progress')
            .update({
              completed: nextStatus,
              completed_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .eq('module_id', moduleId)
            .select();

          if (!updateErr && updateData && updateData.length > 0) {
            saveSucceeded = true;
          } else {
            if (updateErr) lastError = updateErr;
            // Fallback Strategy: Row doesn't exist yet, direct insert
            const { error: insertErr } = await supabase
              .from('module_progress')
              .insert({
                user_id: user.id,
                module_id: moduleId,
                completed: nextStatus,
                completed_at: new Date().toISOString(),
              });

            if (!insertErr) {
              saveSucceeded = true;
            } else {
              lastError = insertErr;
            }
          }
        }

        if (!saveSucceeded && lastError) {
          console.error('Failed to persist module progress to database:', lastError);
          setSyncNote('Progress saved locally. Database sync will retry on next action.');
        }
      } catch (err) {
        console.error('Failed to persist module progress:', err);
        setSyncNote('Progress saved locally. Database sync will retry on next action.');
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

      {/* Sync / Connectivity Notice */}
      {syncNote && (
        <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between shadow-sm">
          <span>{syncNote}</span>
          <button
            type="button"
            onClick={() => setSyncNote(null)}
            className="text-amber-700 hover:text-amber-900 font-bold ml-2 text-sm px-1"
            aria-label="Dismiss note"
          >
            ✕
          </button>
        </div>
      )}

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
                {t('allModulesCompletedNotice')}
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
                    <span>{t('badgeCompleted')}</span>
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
                          {t('clickToPlayVideo')}
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

                {/* Module Completion Toggle Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2.5">
                  {isCompleted && (
                    <span className="text-xs text-slate-500 font-medium select-none">
                      {t('btnCompletedTooltip')}
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={updatingModule === item.id}
                    onClick={() => handleToggleModule(item.id)}
                    title={isCompleted ? t('btnCompletedTooltip') : t('btnComplete')}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 ${
                      isCompleted
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 hover:border-emerald-400 cursor-pointer'
                        : 'bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-600 cursor-pointer'
                    } ${updatingModule === item.id ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {updatingModule === item.id ? (
                      <>
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>{t('saving')}</span>
                      </>
                    ) : isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{t('btnCompleted')}</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-white shrink-0" />
                        <span>{t('btnComplete')}</span>
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
            ? t('quizReadyPrompt')
            : t('quizRemainingPrompt', { remaining: totalModules - completedCount })}
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
