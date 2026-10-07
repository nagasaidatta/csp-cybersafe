import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Award, AlertCircle, RotateCcw } from 'lucide-react';
import { quizQuestions } from '../data/quizData';
import { useLanguage } from '../context/LanguageContext';
import { ViewState } from '../types';

interface QuizPageProps {
  onNavigate: (view: ViewState) => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({ onNavigate }) => {
  const { t, strings } = useLanguage();

  // Selected answers: questionId -> chosen index (0 or 1)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

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

    // Verify all 10 questions have been answered
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < quizQuestions.length) {
      setErrorNotice(t('quizIncompleteAlert'));
      // Scroll to the first unanswered question
      const firstUnanswered = quizQuestions.find((q) => selectedAnswers[q.id] === undefined);
      if (firstUnanswered) {
        const el = document.getElementById(`question-${firstUnanswered.id}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Calculate score locally (No unnecessary backend calls)
    let calculatedScore = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setSubmitted(true);
    setErrorNotice(null);

    // Scroll to results summary at top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setErrorNotice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-10 max-w-3xl mx-auto px-4 sm:px-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate('modules')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('btnBackToModules')}</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('quizTitle')}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {t('quizSubtitle')}
        </p>
      </div>

      {/* RESULTS DISPLAY (Calculated locally, only visible after submission) */}
      {submitted && (
        <div className="mb-10 bg-white p-6 sm:p-8 rounded-lg border-2 border-blue-600 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  {t('quizResultHeading')}
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {t('yourScore')}: {score}/{quizQuestions.length}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {t('correctAnswers')}: <strong>{score}</strong> | {t('totalQuestions')}: <strong>{quizQuestions.length}</strong>
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('btnRetakeQuiz')}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('modules')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <span>{t('btnBackToModules')}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-700">
            {score === 10 ? (
              <p className="text-emerald-700 font-medium">{t('perfectScoreMessage')}</p>
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
          className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5"
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
              className={`bg-white p-5 sm:p-6 rounded-lg border transition-colors ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-red-300 bg-red-50/20'
                  : isAnswered
                  ? 'border-blue-300'
                  : 'border-slate-200'
              } shadow-sm`}
            >
              {/* Question Number & Text */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
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
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {t('correctBadge')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded">
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        {t('incorrectBadge')}
                      </span>
                    )}
                  </span>
                )}
              </div>

              {/* Two Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10">
                {options.map((optLabel, optIdx) => {
                  const isSelected = chosenOpt === optIdx;
                  const isThisCorrect = optIdx === q.correctIndex;

                  let optionStyles = 'border-slate-300 hover:border-slate-400 bg-white text-slate-800';

                  if (submitted) {
                    if (isThisCorrect) {
                      optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isSelected && !isThisCorrect) {
                      optionStyles = 'border-red-400 bg-red-50 text-red-900';
                    } else {
                      optionStyles = 'border-slate-200 bg-slate-50 text-slate-400 opacity-70';
                    }
                  } else if (isSelected) {
                    optionStyles = 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold ring-1 ring-blue-600';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded border text-sm transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-600 ${optionStyles}`}
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
              className="px-8 py-3.5 text-base font-bold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              {t('btnSubmitQuiz')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
