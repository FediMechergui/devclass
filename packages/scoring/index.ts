export type Metric = 'ANL' | 'CRT' | 'CRE' | 'DOM' | 'FOC' | 'CUR' | 'INT' | 'REG' | 'COM';

export type QuestionDefinition = {
  id: string;
  type: 'likert' | 'forced_choice' | 'free_text' | 'behavioral';
  loadings?: Partial<Record<Metric, number>>;
  options?: Array<{
    text: string;
    loadings: Partial<Record<Metric, number>>;
  }>;
};

export type Answer = {
  questionId: string;
  value: number | string; // likert value 1-5, or option index for forced_choice
};

export const calculateScores = (
  questions: QuestionDefinition[],
  answers: Answer[]
): Record<Metric, number> => {
  const rawScores: Record<Metric, number> = {
    ANL: 0, CRT: 0, CRE: 0, DOM: 0, FOC: 0, CUR: 0, INT: 0, REG: 0, COM: 0
  };
  const minPossible: Record<Metric, number> = {
    ANL: 0, CRT: 0, CRE: 0, DOM: 0, FOC: 0, CUR: 0, INT: 0, REG: 0, COM: 0
  };
  const maxPossible: Record<Metric, number> = {
    ANL: 0, CRT: 0, CRE: 0, DOM: 0, FOC: 0, CUR: 0, INT: 0, REG: 0, COM: 0
  };

  for (const answer of answers) {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) continue;

    if (question.type === 'likert') {
      const val = typeof answer.value === 'number' ? answer.value : parseInt(answer.value as string, 10);
      for (const [m, loading] of Object.entries(question.loadings || {})) {
        const metric = m as Metric;
        rawScores[metric] += val * loading;
        
        if (loading > 0) {
          maxPossible[metric] += 5 * loading;
          minPossible[metric] += 1 * loading;
        } else {
          maxPossible[metric] += 1 * loading;
          minPossible[metric] += 5 * loading;
        }
      }
    } else if (question.type === 'forced_choice') {
      const selectedIndex = typeof answer.value === 'number' ? answer.value : parseInt(answer.value as string, 10);
      const selectedOption = question.options?.[selectedIndex];
      
      if (selectedOption) {
        for (const [m, loading] of Object.entries(selectedOption.loadings || {})) {
          const metric = m as Metric;
          rawScores[metric] += loading;
        }
      }

      if (question.options) {
        const metricBounds = new Map<Metric, { max: number, min: number }>();
        for (const option of question.options) {
          for (const [m, loading] of Object.entries(option.loadings || {})) {
            const metric = m as Metric;
            if (!metricBounds.has(metric)) {
              metricBounds.set(metric, { max: loading, min: loading });
            } else {
              const bounds = metricBounds.get(metric)!;
              bounds.max = Math.max(bounds.max, loading);
              bounds.min = Math.min(bounds.min, loading);
            }
          }
        }

        for (const [metric, bounds] of metricBounds.entries()) {
          maxPossible[metric] += bounds.max;
          minPossible[metric] += bounds.min;
        }
      }
    }
  }

  const normalizedScores: Record<Metric, number> = {
    ANL: 0, CRT: 0, CRE: 0, DOM: 0, FOC: 0, CUR: 0, INT: 0, REG: 0, COM: 0
  };

  for (const m of Object.keys(rawScores) as Metric[]) {
    const range = maxPossible[m] - minPossible[m];
    if (range === 0) {
      normalizedScores[m] = 50; 
    } else {
      normalizedScores[m] = Math.round(((rawScores[m] - minPossible[m]) / range) * 100);
      normalizedScores[m] = Math.max(0, Math.min(100, normalizedScores[m]));
    }
  }

  return normalizedScores;
};
