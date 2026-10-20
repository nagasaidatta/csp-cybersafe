import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  Play,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
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

  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const [completedModules, setCompletedModules] = useState<Record<number, boolean>>({});
  const [updatingModule, setUpdatingModule] = useState<number | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<Record<number, boolean>>({});
  const [expandedTranscripts, setExpandedTranscripts] = useState<Record<number, boolean>>({});
  const [syncNote, setSyncNote] = useState<string | null>(null);

  // 1. Fetch module progress on initial load with cache preservation
  const loadProgress = useCallback(async () => {
    if (!user) {
      return;
    }

    const cachedStr = localStorage.getItem(`cyber_safe_progress_${user.id}`);
    let cachedMap: Record<number, boolean> = {};
    if (cachedStr) {
      try {
        cachedMap = JSON.parse(cachedStr) || {};
        setCompletedModules(cachedMap);

        const firstIncomplete = modulesData.find((m) => !cachedMap[m.id]);
        if (firstIncomplete) {
          setActiveModuleId(firstIncomplete.id);
        }
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
        return;
      }

      if (data && data.length > 0) {
        const progressMap: Record<number, boolean> = {};
        data.forEach((row: { module_id: number; completed: boolean }) => {
          if (row.completed) {
            progressMap[row.module_id] = true;
          }
        });
        setCompletedModules(progressMap);
        localStorage.setItem(`cyber_safe_progress_${user.id}`, JSON.stringify(progressMap));

        const firstIncomplete = modulesData.find((m) => !progressMap[m.id]);
        if (firstIncomplete && !cachedStr) {
          setActiveModuleId(firstIncomplete.id);
        }
      } else if (data && data.length === 0) {
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

    const nextCompleted = { ...completedModules, [moduleId]: nextStatus };
    setCompletedModules(nextCompleted);
    localStorage.setItem(`cyber_safe_progress_${user.id}`, JSON.stringify(nextCompleted));

    if (isSupabaseConfigured) {
      try {
        let saveSucceeded = false;
        let lastError: any = null;

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
          setSyncNote('Progress saved locally. Database sync will retry on next action.');
        }
      } catch (err) {
        console.error('Failed to persist module progress:', err);
        setSyncNote('Progress saved locally. Database sync will retry on next action.');
      }
    }

    setUpdatingModule(null);
  };

  const toggleTranscript = (moduleId: number) => {
    setExpandedTranscripts((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const completedCount = Object.values(completedModules).filter(Boolean).length;
  const totalModules = 4;
  const percentCompleted = Math.round((completedCount / totalModules) * 100);
  const isAllCompleted = completedCount === totalModules;

  const currentModule = modulesData.find((m) => m.id === activeModuleId) || modulesData[0];
  const isCurrentCompleted = Boolean(completedModules[currentModule.id]);
  const isCurrentVideoActive = Boolean(activeVideoId[currentModule.id]);
  const isCurrentTranscriptOpen = Boolean(expandedTranscripts[currentModule.id]);

  const currentTitle = strings[currentModule.titleKey as keyof typeof strings] as string || '';
  const currentTranscript = strings[currentModule.transcriptKey as keyof typeof strings] as string || '';
  const currentTakeaways = (strings[currentModule.takeawaysKey as keyof typeof strings] as unknown as string[]) || [];

  const handleNext = () => {
    if (activeModuleId < totalModules) {
      setActiveModuleId(activeModuleId + 1);
    }
  };

  const handlePrev = () => {
    if (activeModuleId > 1) {
      setActiveModuleId(activeModuleId - 1);
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Top Navigation & Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-700 transition-colors cursor-pointer group mb-3"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
          <span>{t('navHome')}</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('modulesTitle')}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
              {t('modulesSubtitle')}
            </p>
          </div>

          {/* Minimal Progress Indicator */}
          <div className="shrink-0 flex items-center gap-3 bg-white px-3.5 py-2 rounded-xl shadow-sm">
            <div className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              {completedCount} / {totalModules} {t('badgeCompleted')}
            </div>
            <div className="w-28 bg-slate-200/70 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isAllCompleted ? 'bg-emerald-600' : 'bg-blue-600'
                }`}
                style={{ width: `${percentCompleted}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sync Notice */}
      {syncNote && (
        <div className="mb-5 p-3 bg-amber-100 text-amber-900 rounded-xl text-xs flex items-center justify-between">
          <span>{syncNote}</span>
          <button
            type="button"
            onClick={() => setSyncNote(null)}
            className="text-amber-700 hover:text-amber-900 font-bold ml-2 text-sm px-1.5 cursor-pointer"
            aria-label="Dismiss note"
          >
            ✕
          </button>
        </div>
      )}

      {/* Clean Module Tabs */}
      <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {modulesData.map((item) => {
          const isCompleted = Boolean(completedModules[item.id]);
          const isActive = item.id === activeModuleId;
          const tabTitle = strings[item.titleKey as keyof typeof strings] as string || '';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveModuleId(item.id)}
              className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                isActive
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white text-slate-800 shadow-sm hover:shadow-md hover:bg-slate-50'
              }`}
            >
              <div className="truncate">
                <span className={`text-[10px] font-bold block ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                  {t('moduleLabel')} {item.id}
                </span>
                <span className={`text-xs font-semibold truncate block ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {tabTitle}
                </span>
              </div>

              {isCompleted ? (
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-emerald-600'}`} />
              ) : (
                <div className={`w-3.5 h-3.5 rounded-full border shrink-0 ${isActive ? 'border-white/60' : 'border-slate-300'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Module Focused Card */}
      <article className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Module Title Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {t('moduleLabel')} 0{currentModule.id}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {currentTitle}
            </h2>
          </div>
          {isCurrentCompleted && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('badgeCompleted')}</span>
            </span>
          )}
        </div>

        {/* Main Content: Video on Left, Takeaways & Transcript on Right */}
        <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left Column: Video */}
          <div className="lg:col-span-7">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 shadow-xs">
              {isCurrentVideoActive ? (
                <iframe
                  src={`https://www.youtube.com/embed/${currentModule.videoId}?autoplay=1`}
                  title={`Module ${currentModule.id} - ${currentTitle}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full border-0"
                />
              ) : (
                <div
                  className="relative w-full h-full flex items-center justify-center group cursor-pointer"
                  onClick={() => setActiveVideoId((prev) => ({ ...prev, [currentModule.id]: true }))}
                >
                  <img
                    src={`https://img.youtube.com/vi/${currentModule.videoId}/hqdefault.jpg`}
                    alt={`Thumbnail for ${currentTitle}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors" />
                  <div className="relative z-10 w-13 h-13 rounded-full bg-slate-900/85 hover:bg-blue-600 text-white backdrop-blur-xs flex items-center justify-center shadow-lg transform transition-all group-hover:scale-110">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Takeaways, Transcript & Completion */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div>
              {/* Key Takeaways */}
              <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  {t('keyTakeaways')}
                </h3>
                <ul className="space-y-2.5">
                  {currentTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Collapsible Transcript */}
              <div className="rounded-xl bg-slate-100/80 p-3.5">
                <button
                  type="button"
                  onClick={() => toggleTranscript(currentModule.id)}
                  className="inline-flex items-center justify-between w-full text-xs font-semibold text-slate-700 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isCurrentTranscriptOpen ? t('hideTranscript') : t('viewFullTranscript')}</span>
                  </span>
                  {isCurrentTranscriptOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
                {isCurrentTranscriptOpen ? (
                  <p className="mt-2.5 pt-2.5 border-t border-slate-200/60 text-xs text-slate-600 leading-relaxed max-h-48 overflow-y-auto">
                    {currentTranscript}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {currentTranscript}
                  </p>
                )}
              </div>
            </div>

            {/* Completion Button */}
            <div>
              <button
                type="button"
                disabled={updatingModule === currentModule.id}
                onClick={() => handleToggleModule(currentModule.id)}
                title={isCurrentCompleted ? t('btnCompletedTooltip') : t('btnComplete')}
                className={`w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  isCurrentCompleted
                    ? 'bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-900'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                } ${updatingModule === currentModule.id ? 'opacity-70 cursor-wait' : ''}`}
              >
                {updatingModule === currentModule.id ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>{t('saving')}</span>
                  </>
                ) : isCurrentCompleted ? (
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
        </div>

        {/* Bottom Step Navigation Bar */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-100/70 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={activeModuleId === 1}
            onClick={handlePrev}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeModuleId === 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('btnPrevModule')}</span>
          </button>

          {/* Stepper Dots */}
          <div className="flex items-center gap-1.5">
            {modulesData.map((m) => {
              const isDotActive = m.id === activeModuleId;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveModuleId(m.id)}
                  aria-label={`Go to module ${m.id}`}
                  className={`rounded-full transition-all cursor-pointer ${
                    isDotActive
                      ? 'w-5 h-1.5 bg-slate-800'
                      : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              );
            })}
          </div>

          {activeModuleId < totalModules ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-800 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>{t('btnNextModule')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : isAllCompleted ? (
            <button
              type="button"
              onClick={() => onNavigate('quiz')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
            >
              <span>{t('btnTakeQuiz')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled
              title={t('btnTakeQuizDisabledNotice')}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 bg-slate-200/60 cursor-not-allowed"
            >
              <span>{t('btnTakeQuiz')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </article>

    </div>
  );
};
