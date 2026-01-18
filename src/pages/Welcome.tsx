import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QRCodeSVG } from 'qrcode.react';
import { Play, QrCode, Lock, Settings } from 'lucide-react';

const ADMIN_CODE = 'eli25105';

const Welcome = () => {
  const navigate = useNavigate();
  const surveyUrl = window.location.origin + '/survey';
  const [adminCode, setAdminCode] = useState('');
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = () => {
    if (adminCode === ADMIN_CODE) {
      navigate('/admin');
    } else {
      setError('קוד שגוי');
    }
  };

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

        {/* Admin Access */}
        <div className="mt-8 pt-6 border-t border-border">
          {!showAdminInput ? (
            <button
              onClick={() => setShowAdminInput(true)}
              className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-4 h-4" />
              כניסה לממשק ניהול
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">הזן קוד גישה</span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={adminCode}
                  onChange={(e) => {
                    setAdminCode(e.target.value);
                    setError('');
                  }}
                  placeholder="קוד גישה"
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
                <Button onClick={handleAdminLogin}>כניסה</Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Welcome;
