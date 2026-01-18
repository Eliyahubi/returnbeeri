import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/types/survey';
import { toast } from 'sonner';

interface DbQuestion {
  id: string;
  text: string;
  type: string;
  chart_type: string;
  options: string[];
  display_order: number;
}

const mapDbToQuestion = (dbQuestion: DbQuestion): Question => ({
  id: dbQuestion.id,
  questionText: dbQuestion.text,
  type: dbQuestion.type === 'multi' ? 'multi_select' : 'single_choice',
  options: dbQuestion.options,
  chartType: dbQuestion.chart_type as 'pie' | 'bar',
});

const mapQuestionToDb = (question: Question, order: number = 0) => ({
  id: question.id,
  text: question.questionText,
  type: question.type === 'multi_select' ? 'multi' : 'single',
  chart_type: question.chartType,
  options: question.options,
  display_order: order,
});

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('display_order');
    
    if (error) {
      console.error('Error fetching questions:', error);
      toast.error('שגיאה בטעינת השאלות');
      return;
    }
    
    if (data && data.length > 0) {
      setQuestions(data.map(mapDbToQuestion));
    }
    setLoading(false);
  };

  const addQuestion = async (question: Question) => {
    const dbQuestion = mapQuestionToDb(question, questions.length);
    const { error } = await supabase.from('questions').insert(dbQuestion);
    
    if (error) {
      console.error('Error adding question:', error);
      toast.error('שגיאה בהוספת השאלה');
      return false;
    }
    return true;
  };

  const updateQuestion = async (id: string, updates: Partial<Question>) => {
    const dbUpdates: Record<string, any> = {};
    if (updates.questionText !== undefined) dbUpdates.text = updates.questionText;
    if (updates.type !== undefined) dbUpdates.type = updates.type === 'multi_select' ? 'multi' : 'single';
    if (updates.chartType !== undefined) dbUpdates.chart_type = updates.chartType;
    if (updates.options !== undefined) dbUpdates.options = updates.options;
    
    const { error } = await supabase.from('questions').update(dbUpdates).eq('id', id);
    
    if (error) {
      console.error('Error updating question:', error);
      toast.error('שגיאה בעדכון השאלה');
      return false;
    }
    return true;
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase.from('questions').delete().eq('id', id);
    
    if (error) {
      console.error('Error deleting question:', error);
      toast.error('שגיאה במחיקת השאלה');
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetchQuestions();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('questions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'questions' },
        () => {
          fetchQuestions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    questions,
    loading,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    refetch: fetchQuestions,
  };
};
