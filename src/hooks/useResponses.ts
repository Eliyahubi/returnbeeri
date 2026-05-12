import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ResponseRow {
  id: string;
  created_at: string;
}
export interface AnswerRow {
  id: string;
  response_id: string;
  question_id: string;
  selected_options: string[];
}

export function useResponses() {
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const [{ data: r }, { data: a }] = await Promise.all([
      supabase.from("survey_responses").select("*").order("created_at", { ascending: false }),
      supabase.from("response_answers").select("*"),
    ]);
    if (r) setResponses(r as ResponseRow[]);
    if (a) setAnswers(a as AnswerRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
    const channel = supabase
      .channel("responses-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "survey_responses" }, refetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "response_answers" }, refetch)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const submitResponse = async (selections: Record<string, string[]>) => {
    const { data: resp, error: e1 } = await supabase
      .from("survey_responses")
      .insert({})
      .select()
      .single();
    if (e1 || !resp) throw e1;
    const rows = Object.entries(selections).map(([question_id, selected_options]) => ({
      response_id: resp.id,
      question_id,
      selected_options,
    }));
    if (rows.length) {
      const { error: e2 } = await supabase.from("response_answers").insert(rows);
      if (e2) throw e2;
    }
    return resp.id;
  };

  const clearAll = async () => {
    await supabase.from("response_answers").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("survey_responses").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await refetch();
  };

  return { responses, answers, loading, submitResponse, clearAll, refetch };
}
