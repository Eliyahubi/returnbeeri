import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Play, QrCode } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  const surveyUrl = window.location.origin + '/survey';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo/Image Placeholder */}
        <div className="w-32 h-32 mx-auto mb-8 rounded-2xl gradient-primary shadow-primary flex items-center justify-center animate-float">
          <span className="text-5xl">📊</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          ברוכים הבאים לסקר
        </h1>
        
        <p className="text-muted-foreground text-center mb-8 text-lg">
          סקר פתיחה - מוכנות למבחנים
        </p>

        {/* QR Code Section */}
        <div className="bg-card rounded-2xl p-6 shadow-card mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="w-5 h-5 text-secondary" />
            <span className="text-sm text-muted-foreground">סרקו את הקוד להתחלה</span>
          </div>
          <div className="flex justify-center p-4 bg-background rounded-xl">
            <QRCodeSVG 
              value={surveyUrl} 
              size={160}
              level="H"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={() => navigate('/survey')}
          size="lg"
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-all duration-300 shadow-primary rounded-xl"
        >
          <Play className="w-5 h-5 ml-2" />
          להתחלת הסקר לחצו כאן
        </Button>

        {/* Image upload placeholder hint */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          מקום להוספת לוגו או תמונה
        </p>
      </div>
    </div>
  );
};

export default Welcome;
