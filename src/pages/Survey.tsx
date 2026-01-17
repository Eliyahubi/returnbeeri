import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSurveyStore } from '@/stores/surveyStore';
import { Question } from '@/types/survey';
import { ChevronLeft, ChevronRight, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Survey = () => {
  const navigate = useNavigate();
  const { questions, addResponse } = useSurveyStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;

  const handleOptionSelect = (option: string) => {
    const questionId = currentQuestion.id;
    const currentAnswers = answers[questionId] || [];

    if (currentQuestion.type === 'single_choice') {
      setAnswers({ ...answers, [questionId]: [option] });
    } else {
      if (currentAnswers.includes(option)) {
        setAnswers({
          ...answers,
          [questionId]: currentAnswers.filter((a) => a !== option),
        });
      } else {
        setAnswers({
          ...answers,
          [questionId]: [...currentAnswers, option],
        });
      }
    }
  };

  const isOptionSelected = (option: string) => {
    return (answers[currentQuestion.id] || []).includes(option);
  };

  const canProceed = () => {
    const currentAnswers = answers[currentQuestion.id] || [];
    return currentAnswers.length > 0;
  };

  const handleNext = () => {
    if (isLastQuestion) {
      addResponse({
        id: Date.now().toString(),
        answers,
        submittedAt: new Date(),
      });
      navigate('/thank-you');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-lg mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">
            שאלה {currentIndex + 1} מתוך {questions.length}
          </span>
          <div className="flex gap-1.5">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all duration-300',
                  idx === currentIndex
                    ? 'bg-primary w-6'
                    : idx < currentIndex
                    ? 'bg-secondary'
                    : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-6 shadow-card animate-scale-in bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-6 leading-relaxed">
            {currentQuestion.questionText}
          </h2>

          {currentQuestion.type === 'multi_select' && (
            <p className="text-sm text-secondary mb-4 font-medium">
              ניתן לבחור יותר מתשובה אחת
            </p>
          )}

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={cn(
                  'w-full p-4 rounded-xl text-right transition-all duration-200 border-2 flex items-center gap-3',
                  isOptionSelected(option)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50 text-foreground'
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                    currentQuestion.type === 'multi_select' && 'rounded-md',
                    isOptionSelected(option)
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  )}
                >
                  {isOptionSelected(option) && (
                    <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {!isFirstQuestion && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1 h-12 rounded-xl"
            >
              <ChevronRight className="w-5 h-5 ml-1" />
              הקודם
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              'flex-1 h-12 rounded-xl gradient-primary hover:opacity-90 transition-all',
              !canProceed() && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isLastQuestion ? (
              <>
                <Send className="w-5 h-5 ml-1" />
                שלח תשובות
              </>
            ) : (
              <>
                הבא
                <ChevronLeft className="w-5 h-5 mr-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Survey;
