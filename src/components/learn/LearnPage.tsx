import React, { useState } from 'react';
import { BookOpen, Zap, Clock, CheckCircle, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Lesson } from '../../types';

export const LearnPage: React.FC = () => {
  const { lessons, completeLessonQuiz, setActiveTab, setActiveMissionDetail, missions } = useApp();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [inQuiz, setInQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const openLesson = (l: Lesson) => {
    setSelectedLesson(l);
    setSlideIdx(0);
    setInQuiz(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleNextSlide = () => {
    if (!selectedLesson) return;
    if (slideIdx < selectedLesson.slides.length - 1) {
      setSlideIdx(slideIdx + 1);
    } else {
      setInQuiz(true);
    }
  };

  const handleAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = () => {
    if (!selectedLesson) return;
    setQuizSubmitted(true);
    // Only award XP if the lesson hasn't already been completed
    if (!selectedLesson.isCompleted) {
      completeLessonQuiz(selectedLesson.id);
    }
  };

  const allAnswered = selectedLesson
    ? Object.keys(quizAnswers).length === selectedLesson.quiz.length
    : false;

  // Score: number of correct answers
  const score = selectedLesson
    ? selectedLesson.quiz.reduce((acc, q, idx) => {
        return quizAnswers[idx] === q.correctIndex ? acc + 1 : acc;
      }, 0)
    : 0;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>ECOQUEST ACADEMY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Learn Practical Environmental Concepts
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
          Quick 4-minute lessons. Complete the quiz to earn <strong className="text-emerald-700">+50 XP</strong> and unlock related real-world missions.
        </p>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 shadow-xs group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 inline-block">
                  {lesson.icon}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                  +{lesson.xpReward} XP
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {lesson.category} • {lesson.readTime}
                </span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {lesson.summary}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {lesson.isCompleted ? (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Mastered (+{lesson.xpReward} XP earned)</span>
                </span>
              ) : (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Short quiz included</span>
                </span>
              )}

              <button
                onClick={() => openLesson(lesson)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{lesson.isCompleted ? 'Review Lesson' : 'Start Lesson'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Lesson Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
            
            <button
              onClick={() => setSelectedLesson(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-5">
              <span className="text-xs font-bold text-emerald-700 block mb-1">
                {selectedLesson.icon} {selectedLesson.category} • {inQuiz ? 'Knowledge Quiz' : `Slide ${slideIdx + 1} of ${selectedLesson.slides.length}`}
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedLesson.title}
              </h2>
            </div>

            {/* Slide Reading Mode */}
            {!inQuiz ? (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedLesson.slides[slideIdx].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {selectedLesson.slides[slideIdx].content}
                  </p>
                  {selectedLesson.slides[slideIdx].keyStat && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                      💡 {selectedLesson.slides[slideIdx].keyStat}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <strong className="text-slate-800">Key Takeaway: </strong>
                    {selectedLesson.slides[slideIdx].takeaway}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-1.5">
                    {selectedLesson.slides.map((_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-1.5 rounded-full ${i === slideIdx ? 'bg-emerald-600' : 'bg-slate-200'}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextSlide}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>{slideIdx < selectedLesson.slides.length - 1 ? 'Next Slide' : `Take Quiz & Claim ${selectedLesson.xpReward} XP`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Mode */
              <div className="space-y-5">
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  {selectedLesson.quiz.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = quizAnswers[qIdx] === optIdx;
                          const isCorrect = q.correctIndex === optIdx;
                          let style = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80';

                          if (quizSubmitted) {
                            if (isCorrect) style = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                            else if (isSelected && !isCorrect) style = 'bg-rose-50 border-rose-400 text-rose-800';
                          } else if (isSelected) {
                            style = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleAnswer(qIdx, optIdx)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${style}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Score summary after submit */}
                {quizSubmitted && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between">
                    <span>Score: {score} / {selectedLesson.quiz.length} correct</span>
                    {!selectedLesson.isCompleted && (
                      <span className="font-black text-emerald-700">+{selectedLesson.xpReward} XP Awarded!</span>
                    )}
                    {selectedLesson.isCompleted && (
                      <span className="text-slate-500">Already completed — XP was earned previously</span>
                    )}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  {!quizSubmitted ? (
                    <button
                      onClick={submitQuiz}
                      disabled={!allAnswered}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-50 transition-colors shadow-xs"
                    >
                      {allAnswered
                        ? `Submit Answers & Claim +${selectedLesson.xpReward} XP`
                        : `Answer all ${selectedLesson.quiz.length} questions to continue`}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const targetM = missions.find(m => m.id === selectedLesson.actionMissionId);
                        setSelectedLesson(null);
                        if (targetM) setActiveMissionDetail(targetM);
                        setActiveTab('missions');
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Put Into Practice: Take Related Mission</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
