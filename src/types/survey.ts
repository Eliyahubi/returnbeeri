export type QuestionType = "single" | "multiple";
export type ChartType = "pie" | "bar";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  chart_type: ChartType;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ResponseAnswer {
  id?: string;
  response_id: string;
  question_id: string;
  selected_options: string[];
}
