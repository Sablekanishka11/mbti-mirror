import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Download, Share2, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareableCardProps {
  mbtiType: string;
  overview: string;
  strengths: string[];
  weaknesses: string[];
  onClose: () => void;
}

export default function ShareableCard({ mbtiType, overview, strengths, weaknesses, onClose }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0f0f1a',
      });
      const link = document.createElement('a');
      link.download = `mbti-${mbtiType.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Card downloaded!');
    } catch (err) {
      toast.error('Failed to download card');
    }
    setDownloading(false);
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2, backgroundColor: '#0f0f1a' });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `mbti-${mbtiType.toLowerCase()}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `My MBTI Type: ${mbtiType}`,
          text: `I discovered I'm an ${mbtiType}! Find out your personality type.`,
          files: [file],
        });
      } else {
        await navigator.clipboard.writeText(`I'm an ${mbtiType}! Discover your MBTI type at MBTI Mirror.`);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      toast.error('Failed to share');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* The actual card to be captured */}
        <div
          ref={cardRef}
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
            padding: '2rem',
          }}
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/70 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              MBTI Mirror
            </div>
            <div
              className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)',
              }}
            >
              <span className="text-3xl font-bold text-white">{mbtiType}</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">I'm an {mbtiType}!</h2>
          </div>

          <p className="text-white/80 text-sm text-center mb-6 leading-relaxed">
            {overview.length > 150 ? `${overview.slice(0, 150)}...` : overview}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <h4 className="text-xs font-semibold text-emerald-400 mb-2">Strengths</h4>
              <ul className="space-y-1">
                {strengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="text-white/70 text-xs">• {s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <h4 className="text-xs font-semibold text-rose-400 mb-2">Challenges</h4>
              <ul className="space-y-1">
                {weaknesses.slice(0, 3).map((w, i) => (
                  <li key={i} className="text-white/70 text-xs">• {w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/40 text-xs">Discover your personality type</p>
            <p className="text-white/60 text-sm font-medium">mbtimirror.lovable.app</p>
          </div>
        </div>

        {/* Action buttons outside the captured area */}
        <div className="flex gap-3 mt-4">
          <Button
            variant="glass"
            className="flex-1"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download className="w-4 h-4 mr-2" />
            {downloading ? 'Saving...' : 'Download'}
          </Button>
          <Button variant="hero" className="flex-1" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
