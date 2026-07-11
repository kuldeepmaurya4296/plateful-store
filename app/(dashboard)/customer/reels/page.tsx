'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/features/auth/context/AuthContext';
import { FileUpload } from '@/components/ui/FileUpload';
import { Modal } from '@/components/ui/Modal';
import { putBlob } from '@/lib/indexedDb';
import { sanitize } from '@/lib/sanitize';
import { Heart, MessageSquare, Share2, Bookmark, Music, Volume2, VolumeX, Sparkles, Send, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  name: string;
  avatar: string;
  text: string;
}

interface Reel {
  id: string;
  authorName: string;
  avatar: string;
  caption: string;
  musicName: string;
  gradientStyle?: string;
  videoUrl?: string; // used for custom video
  likesCount: number;
  commentsCount: number;
  commentsList: Comment[];
}

// Mock Reels Data
const MOCK_REELS: Reel[] = [
  {
    id: 'r1',
    authorName: 'Spice Route',
    avatar: 'SR',
    caption: 'Pouring hot clarified butter on our legendary dry-ice Paneer Tikka! 🔥 Plating rating: 4.9/5. #platingart #gastronomy #mumbai',
    musicName: 'Original Audio - Spice Route',
    gradientStyle: 'from-amber-600 via-orange-500 to-red-700',
    likesCount: 345,
    commentsCount: 24,
    commentsList: [
      { id: 'rc1', name: 'Riya Kapoor', avatar: 'RK', text: 'This presentation was out of this world!' },
      { id: 'rc2', name: 'Karan Malhotra', avatar: 'KM', text: 'Stunning smoke effects!' }
    ]
  },
  {
    id: 'r2',
    authorName: 'Riya Kapoor',
    avatar: 'RK',
    caption: 'Wait for that chocolate dome collapse! Pure bliss. 🍫 Rosewater Kulfi Sundae special! @Spice Route #chocolatedome #desserts',
    musicName: 'Sunset Melodies - Lofi Beats',
    gradientStyle: 'from-pink-400 via-purple-500 to-amber-300',
    likesCount: 289,
    commentsCount: 18,
    commentsList: [
      { id: 'rc3', name: 'Rahul Sharma', avatar: 'RS', text: 'My sweet tooth is tingling!' },
      { id: 'rc4', name: 'Nisha Sen', avatar: 'NS', text: 'Is this gluten-free?' }
    ]
  },
  {
    id: 'r3',
    authorName: 'Grill House',
    avatar: 'GH',
    caption: 'Hickory-smoke leaking from under the cloche! Juicy lamb chops cooked to medium-rare. 🍖 #smoked #lambchops #foodblogger',
    musicName: 'Rock Steady - Jazz Band',
    gradientStyle: 'from-red-800 via-yellow-900 to-stone-900',
    likesCount: 412,
    commentsCount: 37,
    commentsList: [
      { id: 'rc5', name: 'Karan Malhotra', avatar: 'KM', text: 'Smoked lamb chops are a must try!' },
      { id: 'rc6', name: 'Aman Joshi', avatar: 'AJ', text: 'Smell is incredible!' }
    ]
  }
];

export default function CustomerReelsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [reels, setReels] = useState<Reel[]>([]);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  
  // Custom video playback URL cache
  const [videoCache, setVideoCache] = useState<{ [key: string]: string }>({});

  // Creator Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reelFile, setReelFile] = useState<File | null>(null);
  const [reelCaption, setReelCaption] = useState('');
  const [reelMusic, setReelMusic] = useState('Original Audio');
  const [isPublishing, setIsPublishing] = useState(false);

  // Slide up Comments Drawer
  const [activeCommentsReelId, setActiveCommentsReelId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Double tap like animation
  const [showHeartPop, setShowHeartPop] = useState(false);

  // Load from localStorage or mock
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('plateful_reels');
      if (stored) {
        try {
          setReels(JSON.parse(stored));
        } catch (e) {
          setReels(MOCK_REELS);
        }
      } else {
        setReels(MOCK_REELS);
        localStorage.setItem('plateful_reels', JSON.stringify(MOCK_REELS));
      }
    }
  }, []);

  // Sync to localstorage on changes
  const saveReels = (newReels: Reel[]) => {
    setReels(newReels);
    localStorage.setItem('plateful_reels', JSON.stringify(newReels));
  };

  const activeReel = reels[activeReelIndex];
  const commentsList = activeCommentsReelId 
    ? (reels.find(r => r.id === activeCommentsReelId)?.commentsList || []) 
    : [];

  const handleLike = (idx: number) => {
    const updated = reels.map((reel, rIdx) => {
      if (rIdx === idx) {
        return {
          ...reel,
          likesCount: reel.likesCount + 1
        };
      }
      return reel;
    });
    saveReels(updated);
  };

  const handleDoubleTap = (idx: number) => {
    handleLike(idx);
    setShowHeartPop(true);
    setTimeout(() => {
      setShowHeartPop(false);
    }, 800);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentsReelId) return;

    const newComment: Comment = {
      id: `rc_dyn_${Date.now()}`,
      name: user?.name || 'Riya Kapoor',
      avatar: user?.avatar || 'RK',
      text: sanitize(newCommentText)
    };

    const updated = reels.map(reel => {
      if (reel.id === activeCommentsReelId) {
        return {
          ...reel,
          commentsCount: reel.commentsCount + 1,
          commentsList: [...reel.commentsList, newComment]
        };
      }
      return reel;
    });

    saveReels(updated);
    setNewCommentText('');
    toast({
      type: 'success',
      title: 'Comment added',
      description: 'Your comment was posted to the reel.'
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    const index = Math.round(scrollTop / height);
    if (index !== activeReelIndex && index >= 0 && index < reels.length) {
      setActiveReelIndex(index);
    }
  };

  const handleCreateReelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelFile) {
      toast({
        type: 'error',
        title: 'Video Required',
        description: 'Please upload an MP4 cooking/plating video.'
      });
      return;
    }

    setIsPublishing(true);
    const mediaKey = `reel_${Date.now()}`;

    try {
      await putBlob(mediaKey, reelFile);
      const newReel: Reel = {
        id: `r_dyn_${Date.now()}`,
        authorName: user?.name || 'Anonymous',
        avatar: user?.avatar || 'AN',
        caption: sanitize(reelCaption),
        musicName: sanitize(reelMusic),
        videoUrl: `indexeddb://${mediaKey}`,
        likesCount: 1,
        commentsCount: 0,
        commentsList: []
      };

      const updated = [newReel, ...reels];
      saveReels(updated);
      setActiveReelIndex(0);
      setShowCreateModal(false);
      setReelFile(null);
      setReelCaption('');
      setReelMusic('Original Audio');
      toast({
        type: 'success',
        title: 'Reel Shared!',
        description: 'Your plating short is now live on Plateful.'
      });
    } catch (e) {
      console.error(e);
      toast({
        type: 'error',
        title: 'Error Publishing',
        description: 'Failed to save reel media.'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Video renderer child component to resolve indexeddb blobs safely
  const ReelVideo: React.FC<{ reel: Reel; isActive: boolean; isMuted: boolean }> = ({ reel, isActive, isMuted }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);

    useEffect(() => {
      let active = true;
      let urlToCleanup: string | null = null;

      if (reel.videoUrl && reel.videoUrl.startsWith('indexeddb://')) {
        const key = reel.videoUrl.replace('indexeddb://', '');
        import('@/lib/indexedDb').then(({ getBlob }) => {
          getBlob(key).then(blob => {
            if (blob && active) {
              const url = URL.createObjectURL(blob);
              urlToCleanup = url;
              setMediaUrl(url);
            }
          });
        });
      }

      return () => {
        active = false;
        if (urlToCleanup) URL.revokeObjectURL(urlToCleanup);
      };
    }, [reel.videoUrl]);

    useEffect(() => {
      if (videoRef.current) {
        if (isActive) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }
    }, [isActive]);

    if (reel.videoUrl && reel.videoUrl.startsWith('indexeddb://')) {
      return mediaUrl ? (
        <video
          ref={videoRef}
          src={mediaUrl}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
        />
      ) : (
        <div className="w-full h-full bg-stone-900 flex items-center justify-center text-white/50 text-xs">
          Loading plating reel...
        </div>
      );
    }

    // Fallback Mock Gradient
    return (
      <div className={`absolute inset-0 bg-gradient-to-tr ${reel.gradientStyle} opacity-90 flex flex-col justify-center items-center`}>
        <div className={`w-28 h-28 rounded-full border-4 border-white/20 flex items-center justify-center ${isActive && !isMuted ? 'animate-pulse scale-105' : ''} transition-all`}>
          <Sparkles className="w-12 h-12 text-white/70" />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-20 space-y-4">
      {/* Reels Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-serif font-bold text-ink">Plating shorts</h1>
          <p className="text-xs text-ink-soft font-medium mt-0.5 font-sans">Scroll vertically to discover verified cooking & plating reels.</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="flex gap-1 items-center !px-3 py-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs">Create</span>
          </Button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 border border-line bg-bg-card hover:bg-bg-alt rounded-full cursor-pointer text-ink-soft"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Snap Scroll Viewport */}
      <div 
        onScroll={handleScroll}
        className="w-full h-[580px] bg-black rounded-2xl overflow-y-scroll snap-y snap-mandatory relative scrollbar-none border border-line"
      >
        {reels.map((reel, idx) => {
          const isCurrent = idx === activeReelIndex;
          
          return (
            <div 
              key={reel.id}
              className="w-full h-full snap-start snap-always relative flex items-center justify-center overflow-hidden"
              onDoubleClick={() => handleDoubleTap(idx)}
            >
              <ReelVideo reel={reel} isActive={isCurrent} isMuted={isMuted} />

              {/* Black gradient mask at bottom for details readability */}
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/45 to-transparent pointer-events-none" />

              {/* Bottom details overlay */}
              <div className="absolute bottom-5 left-4 right-16 text-white text-left space-y-2 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 text-white font-bold text-xs flex items-center justify-center border border-white/30 backdrop-blur-md">
                    {reel.avatar}
                  </div>
                  <span className="text-xs font-bold">{reel.authorName}</span>
                  <button className="text-[10px] font-bold bg-primary text-bg px-2.5 py-0.5 rounded-full hover:bg-primary-hover">
                    Follow
                  </button>
                </div>
                <p className="text-xs text-white/95 leading-relaxed max-w-sm line-clamp-2">
                  {reel.caption}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-white/70">
                  <Music className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{reel.musicName}</span>
                </div>
              </div>

              {/* Side Right Hand Control Buttons */}
              <div className="absolute right-3 bottom-5 flex flex-col items-center gap-4 z-10">
                {/* Like Button */}
                <button
                  onClick={() => handleLike(idx)}
                  className="flex flex-col items-center text-white gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60">
                    <Heart className="w-4.5 h-4.5 text-white fill-white" />
                  </div>
                  <span className="text-[10px] font-bold">{reel.likesCount}</span>
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => setActiveCommentsReelId(reel.id)}
                  className="flex flex-col items-center text-white gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60">
                    <MessageSquare className="w-4.5 h-4.5 text-white fill-white" />
                  </div>
                  <span className="text-[10px] font-bold">{reel.commentsCount}</span>
                </button>

                {/* Share Button */}
                <button 
                  onClick={() => toast({ type: 'success', title: 'Link copied', description: 'Reel link copied to clipboard.' })}
                  className="flex flex-col items-center text-white gap-1 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60">
                    <Share2 className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold">Share</span>
                </button>

                {/* Bookmark Button */}
                <button 
                  onClick={() => toast({ type: 'success', title: 'Bookmarked', description: 'Saved to your Plateful collection.' })}
                  className="flex flex-col items-center text-white gap-1 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60">
                    <Bookmark className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold">Save</span>
                </button>

                {/* Spinning vinyl */}
                <div className="w-7 h-7 rounded-full border-2 border-white/50 bg-stone-900 animate-spin flex items-center justify-center" style={{ animationDuration: '4s' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
              </div>

              {/* Heart Pop Animation overlay on double tap */}
              <AnimatePresence>
                {showHeartPop && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute z-20 pointer-events-none"
                  >
                    <Heart className="w-20 h-20 text-red-500 fill-current drop-shadow-xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Slide up Comments Drawer */}
      <AnimatePresence>
        {activeCommentsReelId && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCommentsReelId(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative bg-bg-card border-t border-line rounded-t-2xl w-full max-w-xl h-[380px] z-10 flex flex-col justify-between"
            >
              <div className="p-4 border-b border-line flex justify-between items-center">
                <span className="font-bold text-sm text-ink">Reel Comments ({commentsList.length})</span>
                <button
                  onClick={() => setActiveCommentsReelId(null)}
                  className="p-1 rounded-full hover:bg-bg-alt text-ink-soft cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {commentsList.map(comment => (
                  <div key={comment.id} className="flex items-start gap-3 text-xs">
                    <div className="w-7 h-7 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center border border-primary/10">
                      {comment.avatar}
                    </div>
                    <div className="bg-bg p-2.5 rounded-lg flex-1 border border-line">
                      <span className="font-bold text-ink block mb-0.5">{comment.name}</span>
                      <p className="text-ink-soft leading-normal">{comment.text}</p>
                    </div>
                  </div>
                ))}
                {commentsList.length === 0 && (
                  <p className="text-xs text-ink-soft text-center py-10 italic">No comments yet. Start the conversation!</p>
                )}
              </div>

              <form onSubmit={handlePostComment} className="p-3 border-t border-line bg-bg/50 flex gap-2">
                <input
                  type="text"
                  placeholder="Say something nice..."
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  className="flex-1 text-xs border border-line bg-bg-card rounded-md px-3 py-2 text-ink"
                  maxLength={150}
                  required
                />
                <Button type="submit" variant="primary" size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Reel Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => !isPublishing && setShowCreateModal(false)}
        title="Share Plating Short"
      >
        <form onSubmit={handleCreateReelSubmit} className="space-y-4">
          <FileUpload
            aspectRatio="9:16"
            label="Select MP4 Video (Max 15MB)"
            onChange={setReelFile}
          />
          <Input
            label="Reel Caption"
            value={reelCaption}
            onChange={e => setReelCaption(e.target.value)}
            required
            placeholder="Introduce this amazing plating technique..."
          />
          <Input
            label="Background Music Track"
            value={reelMusic}
            onChange={e => setReelMusic(e.target.value)}
            required
            placeholder="e.g. Traditional Flute - Lofi Edit"
          />
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isPublishing}
            className="py-2.5"
          >
            <span>{isPublishing ? 'Publishing...' : 'Publish Reel'}</span>
          </Button>
        </form>
      </Modal>
    </div>
  );
}
