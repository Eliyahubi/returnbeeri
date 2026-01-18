import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ResponseAnswer {
  question_id: string;
  selected_options: string[];
}

interface ResponseWithAnswers {
  id: string;
  created_at: string;
  answers: ResponseAnswer[];
}

export const useResponses = () => {
  const [responses, setResponses] = useState<ResponseWithAnswers[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResponses = useCallback(async () => {
    const { data: responsesData, error: responsesError } = await supabase
      .from('survey_responses')
      .select('*');

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
      return;
    }

    const { data: answersData, error: answersError } = await supabase
      .from('response_answers')
      .select('*');

    if (answersError) {
      console.error('Error fetching answers:', answersError);
      return;
    }

    const mappedResponses = (responsesData || []).map((response) => ({
      id: response.id,
      created_at: response.created_at,
      answers: (answersData || [])
        .filter((a) => a.response_id === response.id)
        .map((a) => ({
          question_id: a.question_id,
          selected_options: a.selected_options,
        })),
    }));

    setResponses(mappedResponses);
    setLoading(false);
  }, []);

  const addResponse = async (answers: Record<string, string[]>) => {
    // Create response
    const { data: responseData, error: responseError } = await supabase
      .from('survey_responses')
      .insert({})
      .select()
      .single();

    if (responseError || !responseData) {
      console.error('Error creating response:', responseError);
      toast.error('שגיאה בשליחת התשובות');
      return false;
    }

    // Create answer entries
    const answerEntries = Object.entries(answers).map(([questionId, selectedOptions]) => ({
      response_id: responseData.id,
      question_id: questionId,
      selected_options: selectedOptions,
    }));

    const { error: answersError } = await supabase
      .from('response_answers')
      .insert(answerEntries);

    if (answersError) {
      console.error('Error saving answers:', answersError);
      toast.error('שגיאה בשמירת התשובות');
      return false;
    }

    return true;
  };

  const clearResponses = async () => {
    const { error } = await supabase.from('survey_responses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (error) {
      console.error('Error clearing responses:', error);
      toast.error('שגיאה באיפוס התשובות');
      return false;
    }
    
    toast.success('התשובות נמחקו');
    return true;
  };

  const getResponseCounts = useCallback((questionId: string, options: string[]) => {
    const counts: Record<string, number> = {};
    options.forEach((option) => {
      counts[option] = 0;
    });

    responses.forEach((response) => {
      const answer = response.answers.find((a) => a.question_id === questionId);
      if (answer) {
        answer.selected_options.forEach((option) => {
          if (counts[option] !== undefined) {
            counts[option]++;
          }
        });
      }
    });

    return counts;
  }, [responses]);

  const getTotalResponses = useCallback(() => responses.length, [responses]);

  useEffect(() => {
    fetchResponses();

    // Subscribe to realtime changes
    const responsesChannel = supabase
      .channel('responses-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'survey_responses' },
        () => {
          fetchResponses();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'response_answers' },
        () => {
          fetchResponses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(responsesChannel);
    };
  }, [fetchResponses]);

  return {
    responses,
    loading,
    addResponse,
    clearResponses,
    getResponseCounts,
    getTotalResponses,
    refetch: fetchResponses,
  };
};
