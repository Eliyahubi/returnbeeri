import { useState } from 'react';
import { useSurveyStore } from '@/stores/surveyStore';
import { Question } from '@/types/survey';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical, Save, PieChart, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const AdminEdit = () => {
  const { questions, setQuestions, addQuestion, updateQuestion, deleteQuestion } = useSurveyStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      questionText: 'שאלה חדשה',
      type: 'single_choice',
      options: ['תשובה 1', 'תשובה 2'],
      chartType: 'pie',
    };
    addQuestion(newQuestion);
    setEditingId(newQuestion.id);
    toast.success('שאלה חדשה נוספה');
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    updateQuestion(id, updates);
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) {
      toast.error('חייבת להישאר לפחות שאלה אחת');
      return;
    }
    deleteQuestion(id);
    toast.success('השאלה נמחקה');
  };

  const handleAddOption = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      updateQuestion(questionId, {
        options: [...question.options, `תשובה ${question.options.length + 1}`],
      });
    }
  };

  const handleUpdateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleDeleteOption = (questionId: string, optionIndex: number) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.options.length > 2) {
      const newOptions = question.options.filter((_, idx) => idx !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    } else {
      toast.error('חייבות להישאר לפחות 2 תשובות');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">עריכת שאלות</h1>
            <p className="text-muted-foreground">הוספה ועריכה של שאלות הסקר</p>
          </div>
          <Button onClick={handleAddQuestion} className="gradient-primary rounded-xl">
            <Plus className="w-5 h-5 ml-2" />
            הוסף שאלה
          </Button>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card
              key={question.id}
              className={cn(
                'p-6 shadow-card transition-all duration-200',
                editingId === question.id && 'ring-2 ring-primary'
              )}
            >
              {/* Question Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="w-5 h-5" />
                  <span className="font-semibold text-lg">{index + 1}</span>
                </div>

                <div className="flex-1">
                  <Input
                    value={question.questionText}
                    onChange={(e) =>
                      handleUpdateQuestion(question.id, { questionText: e.target.value })
                    }
                    className="text-lg font-medium border-transparent hover:border-border focus:border-primary"
                    placeholder="הזן את השאלה..."
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Question Settings */}
              <div className="flex flex-wrap gap-6 mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Label className="text-sm text-muted-foreground">בחירה מרובה:</Label>
                  <Switch
                    checked={question.type === 'multi_select'}
                    onCheckedChange={(checked) =>
                      handleUpdateQuestion(question.id, {
                        type: checked ? 'multi_select' : 'single_choice',
                      })
                    }
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Label className="text-sm text-muted-foreground">סוג תרשים:</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={question.chartType === 'pie' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateQuestion(question.id, { chartType: 'pie' })}
                      className="rounded-lg"
                    >
                      <PieChart className="w-4 h-4 ml-1" />
                      עוגה
                    </Button>
                    <Button
                      variant={question.chartType === 'bar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateQuestion(question.id, { chartType: 'bar' })}
                      className="rounded-lg"
                    >
                      <BarChart3 className="w-4 h-4 ml-1" />
                      עמודות
                    </Button>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">תשובות:</Label>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      {optIndex + 1}
                    </div>
                    <Input
                      value={option}
                      onChange={(e) => handleUpdateOption(question.id, optIndex, e.target.value)}
                      className="flex-1"
                      placeholder="הזן תשובה..."
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteOption(question.id, optIndex)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddOption(question.id)}
                  className="mt-2 rounded-lg"
                >
                  <Plus className="w-4 h-4 ml-1" />
                  הוסף תשובה
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Save Indicator */}
        <div className="fixed bottom-6 left-6 flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-xl shadow-card">
          <Save className="w-4 h-4" />
          השינויים נשמרים אוטומטית
        </div>
      </div>
    </div>
  );
};

export default AdminEdit;
