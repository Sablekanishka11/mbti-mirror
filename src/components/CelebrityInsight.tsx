import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CelebrityInsightProps {
  name: string;
  profession: string;
  explanation: string;
  mbtiType: string;
}

export default function CelebrityInsight({ name, profession, explanation, mbtiType }: CelebrityInsightProps) {
  const [expanded, setExpanded] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAiInsight = async () => {
    if (aiInsight) {
      setExpanded(!expanded);
      return;
    }

    setExpanded(true);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('celebrity-insights', {
        body: { mbtiType, celebrityName: name, profession },
      });

      if (error) throw error;
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setAiInsight(data.insight);
    } catch (err) {
      toast.error('Failed to generate insight');
      setExpanded(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      className="bg-card rounded-xl p-4 border border-border/50 cursor-pointer hover:border-primary/30 transition-all"
      onClick={fetchAiInsight}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-primary">{profession}</p>
          <p className="text-xs text-muted-foreground mt-2">{explanation}</p>
        </div>
        <button className="p-1 text-muted-foreground hover:text-primary transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-primary mb-2">
                <Sparkles className="w-3 h-3" />
                <span>AI-Powered Insight</span>
              </div>
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating personalized insight...
                </div>
              ) : (
                <p className="text-sm text-foreground/80 leading-relaxed">{aiInsight}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
