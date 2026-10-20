import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Award, AlertCircle, RotateCcw, Trophy } from 'lucide-react';
import { quizQuestions } from '../data/quizData';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { ViewState } from '../types';

interface QuizPageProps {
  onNavigate: (view: ViewState) => void;
  returnTo?: 'home' | 'modules';
}

export const QuizPage: React.FC<QuizPageProps> = ({ onNavigate, returnTo = 'modules' }) => {
  const { t, strings } = useLanguage();
  const { user } = useAuth();

  // Selected answers: questionId -> chosen index (0 or 1)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highestScore, setHighestScore] = useState<number | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Load existing highest score for this user
  const loadHighestScore = useCallback(async () => {
    if (!user) return;

    let currentHighest: number | null = null;

    // 1. Check local storage first
    try {
      const stored = localStorage.getItem(`cyber_safe_quiz_score_${user.id}`);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          currentHighest = parsed;
          setHighestScore(parsed);
        }
      }
    } catch {
      // ignore
    }

    // 2. Fetch from database if configured
    if (isSupabaseConfigured) {
      try {
        // Check quiz_scores table
        const { data: scoreData, error: scoreErr } = await supabase
          .from('quiz_scores')
          .select('highest_score')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!scoreErr && scoreData && typeof scoreData.highest_score === 'number') {
          const dbScore = scoreData.highest_score;
          const best = currentHighest !== null ? Math.max(currentHighest, dbScore) : dbScore;
          setHighestScore(best);
          localStorage.setItem(`cyber_safe_quiz_score_${user.id}`, String(best));
          return;
        }

        // Fallback: check profiles table
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('highest_quiz_score')
          .eq('id', user.id)
          .maybeSingle();

        if (!profileErr && profileData && typeof profileData.highest_quiz_score === 'number') {
          const profileScore = profileData.highest_quiz_score;
          const best = currentHighest !== null ? Math.max(currentHighest, profileScore) : profileScore;
          setHighestScore(best);
          localStorage.setItem(`cyber_safe_quiz_score_${user.id}`, String(best));
        }
      } catch (err) {
        console.warn('Highest quiz score fetch note:', err);
      }
    }
  }, [user]);

  useEffect(() => {
    loadHighestScore();
  }, [loadHighestScore]);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (submitted) return; // Do not alter answers after submit unless retaking
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setErrorNotice(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate score locally (No unnecessary backend calls)
    let calculatedScore = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        calculatedScore += 1;
      }
    });

    const previousHighest = highestScore;
    const isNew = previousHighest === null || calculatedScore > previousHighest;
    const newHighest = previousHighest === null ? calculatedScore : Math.max(previousHighest, calculatedScore);

    setScore(calculatedScore);
    setHighestScore(newHighest);
    setIsNewHighScore(isNew);
    setSubmitted(true);
    setErrorNotice(null);

    // Save locally
    if (user?.id) {
      try {
        localStorage.setItem(`cyber_safe_quiz_score_${user.id}`, String(newHighest));
        localStorage.setItem(`cyber_safe_quiz_last_score_${user.id}`, String(calculatedScore));
      } catch {
        // ignore
      }

      // Asynchronously sync to database
      if (isSupabaseConfigured) {
        const payload = {
          user_id: user.id,
          highest_score: newHighest,
          last_score: calculatedScore,
          total_questions: quizQuestions.length,
          completed_at: new Date().toISOString(),
        };

        // Asynchronously sync to database
        (async () => {
          try {
            // 1. Upsert into quiz_scores table
            const { error: quizErr } = await supabase
              .from('quiz_scores')
              .upsert(payload, { onConflict: 'user_id' });
            if (quizErr) console.warn('Quiz score table upsert note:', quizErr.message);

            // 2. Also update profiles table column
            const { error: profileErr } = await supabase
              .from('profiles')
              .update({ highest_quiz_score: newHighest })
              .eq('id', user.id);
            if (profileErr) console.warn('Profiles highest score update note:', profileErr.message);
          } catch (syncErr) {
            console.warn('Quiz score sync note:', syncErr);
          }
        })();
      }
    }

    // Scroll to results summary at top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setIsNewHighScore(false);
    setErrorNotice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-10 max-w-3xl mx-auto px-4 sm:px-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate(returnTo)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{returnTo === 'home' ? t('btnBackToHome') : t('btnBackToModules')}</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('quizTitle')}
          </h1>
          {highestScore !== null && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs font-bold shrink-0 shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {t('quizHighestScore')}: <strong>{highestScore}/{quizQuestions.length}</strong>
              </span>
            </div>
          )}
        </div>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {t('quizSubtitle')}
        </p>
      </div>

      {/* RESULTS DISPLAY (Calculated locally, only visible after submission) */}
      {submitted && (
        <div className="mb-10 bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  {t('quizResultHeading')}
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {t('yourScore')}: {score}/{quizQuestions.length}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span>
                    {t('correctAnswers')}: <strong>{score}</strong> | {t('totalQuestions')}: <strong>{quizQuestions.length}</strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                    <Trophy className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('quizHighestScore')}: {highestScore}/{quizQuestions.length}</span>
                  </span>
                  {isNewHighScore && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold animate-pulse">
                      🎉 {t('quizNewHighestScore')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-xl shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('btnRetakeQuiz')}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate(returnTo)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-xs hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-all"
              >
                <span>{returnTo === 'home' ? t('btnBackToHome') : t('btnBackToModules')}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-700">
            {score === 10 ? (
              <p className="text-emerald-700 font-semibold">{t('perfectScoreMessage')}</p>
            ) : (
              <p className="text-slate-600">{t('goodScoreMessage')}</p>
            )}
          </div>
        </div>
      )}

      {/* Incomplete Error Alert */}
      {errorNotice && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-red-100 text-red-900 text-sm flex items-center gap-2.5"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-medium">{errorNotice}</span>
        </div>
      )}

      {/* QUIZ FORM: All 10 questions on a single page */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {quizQuestions.map((q, qIndex) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const chosenOpt = selectedAnswers[q.id];
          const isCorrect = chosenOpt === q.correctIndex;

          const questionText = strings[q.questionKey as keyof typeof strings] as string || '';
          const opt1Text = strings[q.optionsKeys[0] as keyof typeof strings] as string || '';
          const opt2Text = strings[q.optionsKeys[1] as keyof typeof strings] as string || '';
          const options = [opt1Text, opt2Text];

          return (
            <div
              key={q.id}
              id={`question-${q.id}`}
              className={`p-5 sm:p-6 rounded-2xl transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-50/90 shadow-sm'
                    : isAnswered
                    ? 'bg-red-50/90 shadow-sm'
                    : 'bg-slate-100/70 shadow-none'
                  : isAnswered
                  ? 'bg-blue-50/40 shadow-md ring-1 ring-blue-500/20'
                  : 'bg-white shadow-sm hover:shadow-md'
              }`}
            >
              {/* Question Number & Text */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {questionText}
                  </h3>
                </div>

                {/* Score Indicator after submission */}
                {submitted && (
                  <span className="shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('correctBadge')}</span>
                      </span>
                    ) : isAnswered ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-800 bg-red-100 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>{t('incorrectBadge')}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        <span>{t('unattemptedBadge')}</span>
                      </span>
                    )}
                  </span>
                )}
              </div>

              {/* Two Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 sm:pl-10">
                {options.map((optLabel, optIdx) => {
                  const isSelected = chosenOpt === optIdx;
                  const isThisCorrect = optIdx === q.correctIndex;

                  let optionStyles = 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800';

                  if (submitted) {
                    if (isThisCorrect) {
                      optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                    } else if (isSelected && !isThisCorrect) {
                      optionStyles = 'border-red-400 bg-red-50 text-red-950';
                    } else {
                      optionStyles = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyles = 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold ring-1 ring-blue-600 shadow-2xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${optionStyles}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-blue-700 bg-blue-700 text-white'
                            : 'border-slate-400 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="leading-snug">{optLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Submit Button */}
        {!submitted && (
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 text-base font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-xs hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              {t('btnSubmitQuiz')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
