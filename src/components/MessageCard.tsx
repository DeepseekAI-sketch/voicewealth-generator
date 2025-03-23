
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageCardProps {
  message: string;
  language: string;
  isCurrentMessage: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export function MessageCard({ 
  message, 
  language,
  isCurrentMessage, 
  isPlaying, 
  onPlay, 
  onPause 
}: MessageCardProps) {
  const isRightToLeft = language === 'ar-SA';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300 group",
        isCurrentMessage ? "ring-2 ring-primary/50" : "hover:ring-1 hover:ring-primary/30"
      )}
    >
      <div className="flex flex-col h-full">
        <div 
          className={cn(
            "flex-1 mb-4 text-base md:text-lg leading-relaxed",
            isRightToLeft ? "text-right font-medium" : ""
          )}
          dir={isRightToLeft ? "rtl" : "ltr"}
        >
          {message}
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className={cn(
              "premium-btn flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
              isCurrentMessage && isPlaying
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {isCurrentMessage && isPlaying ? (
              <>
                <Pause size={16} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Play</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
