export interface Question {
  id: string;
  questionText: string;
  type: 'single_choice' | 'multi_select';
  options: string[];
  chartType: 'pie' | 'bar';
}

export interface Answer {
  id: string;
  questionId: string;
  selectedOptions: string[];
  timestamp: Date;
}

export interface SurveyResponse {
  id: string;
  answers: Record<string, string[]>;
  submittedAt: Date;
}

export const defaultQuestions: Question[] = [
  {
    id: 'q1',
    questionText: 'האם לדעתכם יש קשר בין ההכנה לדייט ראשון לבין ההכנה למבחן?',
    type: 'single_choice',
    options: ['כן', 'לא'],
    chartType: 'pie',
  },
  {
    id: 'q2',
    questionText: 'באילו מהתחומים הבאים המיומנויות שאתם מפתחים כרגע בהכנה למבחן, ישרתו אתכם בעתיד? (סמנו את כל הרלוונטיים)',
    type: 'multi_select',
    options: [
      'ראיון עבודה',
      'הגשת מכרז או הצעת מחיר',
      'התנהלות שוטפת בעבודה (ניהול משימות)',
      'פרזנטציה מול לקוח או הנהלה',
    ],
    chartType: 'bar',
  },
  {
    id: 'q3',
    questionText: 'האם המוח שלנו יודע להבדיל בין הפחד מכישלון במבחן לבין סכנה פיזית ממשית?',
    type: 'single_choice',
    options: ['לא (או בקושי רב)', 'כן, בוודאי'],
    chartType: 'pie',
  },
];
