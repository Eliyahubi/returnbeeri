import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Question } from "@/types/survey";

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("display_order", { ascending: true });
    if (!error && data) setQuestions(data as Question[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
    const channel = supabase
      .channel("questions-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "questions" }, () => {
        refetch();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const addQuestion = async (q: Omit<Question, "id">) => {
    const { error } = await supabase.from("questions").insert(q);
    if (error) throw error;
  };

  const updateQuestion = async (id: string, q: Partial<Question>) => {
    const { error } = await supabase.from("questions").update(q).eq("id", id);
    if (error) throw error;
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) throw error;
  };

  return { questions, loading, refetch, addQuestion, updateQuestion, deleteQuestion };
}
