import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Play, LogOut, Calendar, Users, Sun, Moon, Palette, Minus } from 'lucide-react';
import { format } from 'date-fns';

interface QuizResult {
  id: string;
  mbti_type: string;
  personality_overview: string;
  strengths: string[];
  weaknesses: string[];
  communication_style: string;
  career_inclination: string;
  relationship_traits: string;
  celebrities: { name: string; profession: string; explanation: string }[];
  created_at: string;
}

const themes = [
  { id: 'light', name: 'Light', icon: Sun },
  { id: 'dark', name: 'Dark', icon: Moon },
  { id: 'pastel', name: 'Pastel', icon: Palette },
  { id: 'minimal', name: 'Minimal', icon: Minus },
];

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchResults();
  }, [user]);

  useEffect(() => {
    document.documentElement.className = currentTheme === 'dark' ? 'dark' : currentTheme === 'pastel' ? 'theme-pastel' : currentTheme === 'minimal' ? 'theme-minimal' : '';
  }, [currentTheme]);

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const typedResults = data.map((r) => ({
        ...r,
        strengths: r.strengths || [],
        weaknesses: r.weaknesses || [],
        celebrities: (r.celebrities as { name: string; profession: string; explanation: string }[]) || [],
      }));
      setResults(typedResults);
      if (typedResults.length > 0) setSelectedResult(typedResults[0]);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const handleThemeChange = async (theme: string) => {
    setCurrentTheme(theme);
    if (user) {
      await supabase.from('profiles').update({ preferred_theme: theme }).eq('user_id', user.id);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Sparkles className="w-8 h-8 animate-pulse text-primary" /></div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Your MBTI Journey</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="hero" onClick={() => navigate('/quiz')}>
              <Play className="w-4 h-4 mr-2" /> Take Quiz
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {selectedResult ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6 border border-border/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-display font-bold text-primary">{selectedResult.mbti_type}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{format(new Date(selectedResult.created_at), 'PPP')}</p>
                    <h2 className="text-xl font-display font-semibold">Your Personality Type</h2>
                  </div>
                </div>
                <p className="text-foreground/80 mb-6">{selectedResult.personality_overview}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-accent/30 rounded-xl p-4">
                    <h3 className="font-semibold text-primary mb-2">Strengths</h3>
                    <ul className="space-y-1 text-sm">{selectedResult.strengths.map((s, i) => <li key={i}>• {s}</li>)}</ul>
                  </div>
                  <div className="bg-destructive/10 rounded-xl p-4">
                    <h3 className="font-semibold text-destructive mb-2">Weaknesses</h3>
                    <ul className="space-y-1 text-sm">{selectedResult.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}</ul>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" /> Famous {selectedResult.mbti_type}s
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4 italic">Celebrity MBTI types are based on public behavior analysis and are not officially confirmed.</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {selectedResult.celebrities.map((c, i) => (
                      <div key={i} className="bg-card rounded-xl p-4 border border-border/50">
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-sm text-primary">{c.profession}</p>
                        <p className="text-xs text-muted-foreground mt-2">{c.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass rounded-2xl p-8 text-center border border-border/50">
                <Sparkles className="w-12 h-12 mx-auto text-primary mb-4" />
                <h2 className="text-xl font-display font-semibold mb-2">Discover Your Personality</h2>
                <p className="text-muted-foreground mb-4">Take the quiz to uncover your MBTI type</p>
                <Button variant="hero" onClick={() => navigate('/quiz')}>Start Quiz</Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 border border-border/50">
              <h3 className="font-display font-semibold mb-4">Theme</h3>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl transition-all ${currentTheme === t.id ? 'bg-primary text-primary-foreground' : 'bg-accent/50 hover:bg-accent'}`}
                  >
                    <t.icon className="w-4 h-4" />
                    <span className="text-sm">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-border/50">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> History
              </h3>
              {results.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {results.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedResult(r)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedResult?.id === r.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-accent/50'}`}
                    >
                      <span className="font-semibold">{r.mbti_type}</span>
                      <span className="text-xs text-muted-foreground">{format(new Date(r.created_at), 'MMM d, yyyy')}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No results yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
