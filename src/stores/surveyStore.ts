import { create } from 'zustand';
import { Question, SurveyResponse, defaultQuestions } from '@/types/survey';

interface SurveyState {
  questions: Question[];
  responses: SurveyResponse[];
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, question: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  addResponse: (response: SurveyResponse) => void;
  getResponseCounts: (questionId: string) => Record<string, number>;
  getTotalResponses: () => number;
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  questions: defaultQuestions,
  responses: [],
  
  setQuestions: (questions) => set({ questions }),
  
  addQuestion: (question) => set((state) => ({
    questions: [...state.questions, question],
  })),
  
  updateQuestion: (id, updatedQuestion) => set((state) => ({
    questions: state.questions.map((q) =>
      q.id === id ? { ...q, ...updatedQuestion } : q
    ),
  })),
  
  deleteQuestion: (id) => set((state) => ({
    questions: state.questions.filter((q) => q.id !== id),
  })),
  
  addResponse: (response) => set((state) => ({
    responses: [...state.responses, response],
  })),
  
  getResponseCounts: (questionId) => {
    const { responses, questions } = get();
    const question = questions.find((q) => q.id === questionId);
    if (!question) return {};
    
    const counts: Record<string, number> = {};
    question.options.forEach((option) => {
      counts[option] = 0;
    });
    
    responses.forEach((response) => {
      const selectedOptions = response.answers[questionId] || [];
      selectedOptions.forEach((option) => {
        if (counts[option] !== undefined) {
          counts[option]++;
        }
      });
    });
    
    return counts;
  },
  
  getTotalResponses: () => get().responses.length,
}));
