import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, Brain, Users, History } from 'lucide-react';

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate('/dashboard');
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl">MBTI Mirror</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/auth')}>Sign In</Button>
            <Button variant="hero" onClick={() => navigate('/auth')}>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <section className="min-h-[90vh] flex items-center justify-center px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl relative z-10"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8"
            >
              <Sparkles className="w-12 h-12 text-primary animate-pulse-soft" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              Discover Your <span className="gradient-text">True Self</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Unlock the secrets of your personality with our scientifically-designed MBTI assessment. Explore your strengths, career paths, and famous personalities who share your type.
            </p>
            <Button variant="hero" size="xl" onClick={() => navigate('/auth')}>
              Start Your Journey
            </Button>
          </motion.div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: 'Smart Quiz', desc: '20 scenario-based questions designed to reveal your true personality type.' },
              { icon: Users, title: 'Celebrity Matches', desc: 'Discover famous personalities who share your MBTI type.' },
              { icon: History, title: 'Track Progress', desc: 'Save your results and see how your personality evolves over time.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 border border-border/50 hover:shadow-card transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="py-8 px-4 border-t border-border">
          <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
            <p>© 2024 MBTI Mirror. All results are for entertainment and self-reflection purposes only.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
