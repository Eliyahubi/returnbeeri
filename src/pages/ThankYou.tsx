import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home } from 'lucide-react';

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center animate-slide-up">
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-success/20 flex items-center justify-center animate-scale-in">
          <CheckCircle className="w-14 h-14 text-success" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-4">
          תודה על ההשתתפות בסקר!
        </h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          התשובות שלכם התקבלו בהצלחה
        </p>

        {/* Decorative Elements */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-primary/20"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Back Button */}
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="h-12 px-8 rounded-xl"
        >
          <Home className="w-5 h-5 ml-2" />
          חזרה לעמוד הראשי
        </Button>
      </div>
    </div>
  );
};

export default ThankYou;
