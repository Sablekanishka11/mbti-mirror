import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { questions, calculateMBTI } from '@/lib/mbti-questions';
import { getMBTIInfo } from '@/lib/mbti-data';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect unauthenticated users to auth page
  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: 'A' | 'B') => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 300);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);

    const mbtiType = calculateMBTI(answers);
    const info = getMBTIInfo(mbtiType);

    if (!info) {
      toast.error('Could not calculate your MBTI type');
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from('quiz_results').insert({
      user_id: user.id,
      mbti_type: mbtiType,
      answers: answers,
      personality_overview: info.overview,
      strengths: info.strengths,
      weaknesses: info.weaknesses,
      communication_style: info.communicationStyle,
      career_inclination: info.careerInclination,
      relationship_traits: info.relationshipTraits,
      celebrities: info.celebrities,
    });

    if (error) {
      toast.error('Failed to save results');
    } else {
      toast.success('Your results have been saved!');
      navigate('/dashboard');
    }
    setIsSubmitting(false);
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-center"
          >
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-8 text-center">
              {currentQuestion.text}
            </h2>

            <div className="space-y-4">
              {['A', 'B'].map((option) => {
                const optionData = option === 'A' ? currentQuestion.optionA : currentQuestion.optionB;
                const isSelected = answers[currentQuestion.id] === option;
                return (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option as 'A' | 'B')}
                    className={`w-full p-6 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-glow'
                        : 'glass border border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-lg">{optionData.text}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button variant="hero" onClick={handleSubmit} disabled={!allAnswered || isSubmitting}>
              {isSubmitting ? 'Saving...' : 'See Results'}
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={!answers[currentQuestion.id]}
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
