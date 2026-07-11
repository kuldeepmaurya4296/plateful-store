'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { X, Heart, MessageSquare, MapPin, Star, Play, Volume2, VolumeX, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock list of starting comments to make it feel organic
const INITIAL_COMMENTS: { [key: string]: any[] } = {
  p1: [
    { id: 'c1', name: 'Riya Kapoor', avatar: 'RK', text: 'This was literally so fluffy! The truffle aroma is amazing.', time: '2h ago' },
    { id: 'c2', name: 'Rahul Sharma', avatar: 'RS', text: 'Best naan in Mumbai hands down.', time: '1h ago' }
  ],
  p2: [
    { id: 'c3', name: 'Spice Route', avatar: 'SR', text: 'Thank you @riya.eats! Glad you enjoyed the dry-ice presentation!', time: '3h ago' },
    { id: 'c4', name: 'Karan Malhotra', avatar: 'KM', text: 'Wow, that plating looks insane. Gotta visit Bandra soon.', time: '2h ago' }
  ],
  p3: [
    { id: 'c5', name: 'Nisha Sen', avatar: 'NS', text: 'BBQ glaze looks perfect. Are they spicy?', time: '4h ago' },
    { id: 'c6', name: 'Grill House', avatar: 'GH', text: 'It has a mild smoky sweetness with a tiny kick! @nisha.sen', time: '4h ago' }
  ]
};

export const DetailedPostModal: React.FC = () => {
  const { activeDetailedPostId, setActiveDetailedPostId, posts, commentOnPost, likePost } = useApp();
  const { user } = useAuth();
  const { toast } = useToast();

  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  
  // Media carousel control
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  
  // Video playback states
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(35);

  const post = posts.find(p => p.id === activeDetailedPostId);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  // Load comments & media URL
  useEffect(() => {
    let active = true;
    let objectUrlToCleanup: string | null = null;

    if (activeDetailedPostId && post) {
      const existing = INITIAL_COMMENTS[activeDetailedPostId] || post.commentsList || [];
      setComments(existing);
      setActiveMediaIndex(0);
      setIsPlaying(true);
      setVideoProgress(20 + Math.random() * 50); // random progress simulation

      if (post.photoUrl && post.photoUrl.startsWith('indexeddb://')) {
        const key = post.photoUrl.replace('indexeddb://', '');
        import('@/lib/indexedDb').then(({ getBlob }) => {
          getBlob(key).then(blob => {
            if (blob && active) {
              const url = URL.createObjectURL(blob);
              objectUrlToCleanup = url;
              setMediaUrl(url);
            }
          });
        });
      } else {
        setMediaUrl(post.photoUrl || null);
      }
    }

    return () => {
      active = false;
      if (objectUrlToCleanup) {
        URL.revokeObjectURL(objectUrlToCleanup);
      }
    };
  }, [activeDetailedPostId, post]);

  if (!activeDetailedPostId || !post) return null;

  const handleClose = () => {
    setActiveDetailedPostId(null);
  };

  const handleLike = () => {
    likePost(post.id);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: `c_dyn_${Date.now()}`,
      name: user?.name || 'Riya Kapoor',
      avatar: user?.avatar || 'RK',
      text: newCommentText,
      time: 'Just now'
    };

    setComments(prev => [...prev, newComment]);
    commentOnPost(post.id, newCommentText);
    setNewCommentText('');
    toast({
      type: 'success',
      title: 'Comment Posted',
      description: 'Your feedback has been added to the post.'
    });
  };

  // Mock list of secondary carousel items
  const postMedia = (post as any).galleryNames || [post.caption.split('#')[0]];
  const isVideo = (post as any).mediaType === 'video' || (post.authorType === 'restaurant' && post.id === 'p1'); // mock or real video

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-bg-card border border-line rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[550px] max-h-[90vh]"
      >
        {/* Left Column: Visual Media Player */}
        <div className="flex-1 bg-black flex flex-col justify-center items-center relative group min-h-[250px] md:min-h-0">
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 z-20 md:hidden p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Render media */}
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            {mediaUrl ? (
              <div className="w-full h-full relative flex items-center justify-center bg-black">
                <Badge variant={post.isVeg ? 'success' : 'danger'} className="absolute top-4 right-4 z-10">
                  {post.isVeg ? 'Veg' : 'Non-Veg'}
                </Badge>
                {isVideo ? (
                  <video
                    src={mediaUrl}
                    className={`w-full h-full object-contain ${(post as any).filterClass}`}
                    autoPlay={isPlaying}
                    loop
                    muted={isMuted}
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl}
                    alt="Plating detail"
                    className={`w-full h-full object-contain ${(post as any).filterClass}`}
                  />
                )}
              </div>
            ) : (post as any).isMockGradient ? (
              // Gradient Mock
              <div className={`w-full h-full bg-gradient-to-tr ${(post as any).mockGradientStyle} ${(post as any).filterClass} flex flex-col justify-center items-center text-center p-8 text-white relative`}>
                <Badge variant={post.isVeg ? 'success' : 'danger'} className="absolute top-4 right-4">
                  {post.isVeg ? 'Veg' : 'Non-Veg'}
                </Badge>
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-serif font-semibold max-w-sm">
                  {postMedia[activeMediaIndex]}
                </h3>
              </div>
            ) : (
              // Standard Post Mock
              <div className={`w-full h-full bg-bg-alt/25 flex flex-col justify-center items-center text-center p-8 relative ${isVideo ? 'cursor-pointer' : ''}`}>
                <Badge variant={post.isVeg ? 'success' : 'danger'} className="absolute top-4 right-4">
                  {post.isVeg ? 'Veg' : 'Non-Veg'}
                </Badge>
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <span className="font-serif font-bold text-xl">{post.authorAvatar}</span>
                </div>
                <h3 className="text-sm font-serif font-bold text-ink max-w-sm px-4">
                  {postMedia[activeMediaIndex]}
                </h3>
                
                {/* Simulated video overlays */}
                {isVideo && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    {isPlaying ? (
                      <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-all">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center text-white scale-100">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Video Controls overlay */}
            {isVideo && (
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-lg text-white text-xs">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-primary transition-colors cursor-pointer">
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <div className="flex-1 mx-3 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${videoProgress}%` }} />
                </div>
                <button onClick={() => setIsMuted(!isMuted)} className="hover:text-primary transition-colors cursor-pointer">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Carousel navigation controls (if multiple media item mockups exist) */}
            {postMedia.length > 1 && (
              <>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
                  {postMedia.map((_: any, idx: number) => (
                    <span
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === activeMediaIndex ? 'bg-primary w-3' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
                {activeMediaIndex > 0 && (
                  <button
                    onClick={() => setActiveMediaIndex(prev => prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 cursor-pointer"
                  >
                    <span>‹</span>
                  </button>
                )}
                {activeMediaIndex < postMedia.length - 1 && (
                  <button
                    onClick={() => setActiveMediaIndex(prev => prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 cursor-pointer"
                  >
                    <span>›</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Column: Comments & Detailing */}
        <div className="w-full md:w-96 flex flex-col justify-between bg-bg-card border-l border-line h-full">
          {/* Header */}
          <div className="p-4 border-b border-line flex items-center justify-between bg-bg-alt/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
                {post.authorAvatar}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-ink leading-none">{post.authorName}</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-ink-soft mt-1 leading-none">
                  <MapPin className="w-2.5 h-2.5 text-primary" />
                  <span className="font-semibold">{post.restaurantName || 'Spice Route'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                <div className="flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span>{post.rating}</span>
                </div>
              </Badge>
              <button onClick={handleClose} className="p-1 rounded-full hover:bg-bg-alt text-ink-soft cursor-pointer hidden md:inline-block">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Ratings breakup and caption */}
          <div className="px-4 py-3 border-b border-line bg-bg/25 text-xs text-ink space-y-2">
            <p className="leading-relaxed">
              <span className="font-semibold mr-1">{post.authorName}</span>
              <span className="text-ink-soft">{post.caption}</span>
            </p>

            {/* Plating specific ratings breakups */}
            {(post as any).detailedRatings && (
              <div className="grid grid-cols-3 gap-2 text-[9px] bg-bg border border-line rounded-lg p-2 font-medium">
                <div className="text-center space-y-0.5 border-r border-line">
                  <span className="text-ink-soft block uppercase tracking-wider scale-90">Plating</span>
                  <span className="font-bold text-primary">{(post as any).detailedRatings.plating} ★</span>
                </div>
                <div className="text-center space-y-0.5 border-r border-line">
                  <span className="text-ink-soft block uppercase tracking-wider scale-90">Taste</span>
                  <span className="font-bold text-primary">{(post as any).detailedRatings.taste} ★</span>
                </div>
                <div className="text-center space-y-0.5">
                  <span className="text-ink-soft block uppercase tracking-wider scale-90">Ambiance</span>
                  <span className="font-bold text-primary">{(post as any).detailedRatings.ambiance} ★</span>
                </div>
              </div>
            )}
          </div>

          {/* Scrollable Comments list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.length > 0 ? (
              comments.map(c => (
                <div key={c.id} className="flex gap-3 text-xs text-ink items-start">
                  <div className="w-7 h-7 rounded-full bg-secondary-soft text-secondary font-bold text-[10px] flex items-center justify-center border border-secondary/15 flex-shrink-0">
                    {c.avatar}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="leading-relaxed">
                      <span className="font-semibold mr-1.5">{c.name}</span>
                      <span className="text-ink-soft">{c.text}</span>
                    </p>
                    <span className="text-[9px] text-ink-soft block">{c.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-ink-soft italic text-xs">
                No comments yet. Be the first to share feedback!
              </div>
            )}
          </div>

          {/* Action and input footer */}
          <div className="border-t border-line">
            <div className="p-3.5 bg-bg/25 flex items-center justify-between text-xs border-b border-line">
              <div className="flex items-center gap-4">
                <button onClick={handleLike} className="flex items-center gap-1 text-ink-soft hover:text-danger cursor-pointer transition-colors">
                  <Heart className="w-4.5 h-4.5" />
                  <span className="font-bold">{post.likesCount}</span>
                </button>
                <div className="flex items-center gap-1 text-ink-soft">
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span className="font-bold">{comments.length}</span>
                </div>
              </div>
              <span className="text-[10px] text-ink-soft font-mono">Verified dine-in</span>
            </div>

            <form onSubmit={handleAddComment} className="p-3 bg-bg-card flex gap-2 items-center">
              <input
                type="text"
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 text-xs border-none focus:ring-0 px-2 py-1.5 outline-none bg-transparent"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="p-2 rounded-full hover:bg-primary-soft text-primary disabled:opacity-30 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
