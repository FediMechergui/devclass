'use client';

import { useState } from 'react';

type Question = {
  id: string;
  type: 'likert' | 'forced_choice';
  prompt: string;
  options?: { text: string }[];
};

export default function QuizClient({ initialQuestions }: { initialQuestions: Question[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (initialQuestions.length === 0) {
    return <div>No questions available.</div>;
  }

  const question = initialQuestions[currentIndex];
  const progress = ((currentIndex + 1) / initialQuestions.length) * 100;

  const handleAnswer = (value: number | string) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }));
    setTimeout(() => {
      if (currentIndex < initialQuestions.length - 1) {
        setCurrentIndex(curr => curr + 1);
      } else {
        handleSubmit();
      }
    }, 400); // Small delay for user feedback
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Send answers to API for scoring
    console.log("Submitting answers:", answers);
    // Simulate API delay
    setTimeout(() => {
      window.location.href = '/profile';
    }, 1500);
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Progress Rune */}
      <div className="w-full h-1 bg-[var(--color-surface)] mb-12 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500" key={question.id}>
        <h2 className="text-3xl md:text-4xl font-heading mb-12 text-balance leading-relaxed">
          {question.prompt}
        </h2>

        {question.type === 'likert' && (
          <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
            <div className="flex justify-between px-2 text-sm text-[var(--color-foreground)]/50 uppercase tracking-widest font-mono">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
            <div className="flex justify-between gap-4">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  onClick={() => handleAnswer(val)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-mono border transition-all
                    ${answers[question.id] === val 
                      ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-black scale-110' 
                      : 'border-[var(--color-foreground)]/20 hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface)]'
                    }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        )}

        {question.type === 'forced_choice' && question.options && (
          <div className="flex flex-col gap-4">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-6 text-left rounded-xl border transition-all text-lg
                  ${answers[question.id] === idx 
                    ? 'bg-[var(--color-surface)] border-[var(--color-primary)] shadow-[0_0_15px_rgba(201,168,106,0.2)]' 
                    : 'border-[var(--color-foreground)]/10 bg-[var(--color-surface)]/30 hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface)]'
                  }`}
              >
                {opt.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-12 flex justify-between items-center text-sm font-mono text-[var(--color-foreground)]/50">
        <button 
          onClick={() => setCurrentIndex(curr => Math.max(0, curr - 1))}
          disabled={currentIndex === 0 || isSubmitting}
          className="hover:text-[var(--color-primary)] disabled:opacity-30 disabled:hover:text-[var(--color-foreground)]/50 transition-colors"
        >
          ← Previous
        </button>
        <span>
          {currentIndex + 1} / {initialQuestions.length}
        </span>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-2xl font-heading text-[var(--color-primary)] animate-pulse">
            Analyzing your profile...
          </div>
        </div>
      )}
    </div>
  );
}
