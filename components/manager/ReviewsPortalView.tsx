'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { useToast } from '@/components/ui/Toast';
import { MessageSquare, Reply, Send, Award, Sparkles } from 'lucide-react';
import { sanitize } from '@/lib/sanitize';

const REPLY_TEMPLATES = [
  "Thank you for the wonderful feedback! We are thrilled you enjoyed the plating presentation.",
  "We appreciate you taking the time to share your dining experience. Hope to serve you again soon!",
  "Thank you for dining with us! We appreciate the ratings and will continue to refine our plating designs."
];

export const ReviewsPortalView: React.FC = () => {
  const { user } = useAuth();
  const { reviews, respondToReview } = useApp();
  const { toast } = useToast();

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const tenantReviews = reviews.filter(r => r.restaurantId === user?.restaurantId);
  const totalReviews = tenantReviews.length;
  
  const getAverage = (key: 'foodRating' | 'presentationRating' | 'ambianceRating') => {
    if (totalReviews === 0) return 0;
    const sum = tenantReviews.reduce((acc, curr) => acc + curr[key], 0);
    return parseFloat((sum / totalReviews).toFixed(1));
  };

  const avgFood = getAverage('foodRating');
  const avgPresentation = getAverage('presentationRating');
  const avgAmbiance = getAverage('ambianceRating');
  const overallAvg = parseFloat(((avgFood + avgPresentation + avgAmbiance) / 3).toFixed(1));

  const handleOpenReply = (reviewId: string, currentResponse?: string) => {
    setActiveReplyId(reviewId);
    setReplyText(currentResponse || '');
  };

  const handleApplyTemplate = (template: string) => {
    setReplyText(template);
  };

  const handleSubmitReply = (e: React.FormEvent, reviewId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    respondToReview(reviewId, sanitize(replyText));
    setActiveReplyId(null);
    setReplyText('');
    toast({
      type: 'success',
      title: 'Response Published',
      description: 'Your reply has been sent and is now visible on the customer reviews feed.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-ink">Customer Reviews Portal</h1>
        <p className="text-xs text-ink-soft mt-0.5 font-medium">Monitor ratings breakdown, analyze ambiance scores, and compose official responses.</p>
      </div>

      {/* Ratings Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="flex flex-col justify-center items-center p-6 text-center bg-primary-soft/10 border-primary/10">
          <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Overall Rating</span>
          <h2 className="text-3xl font-serif font-bold text-primary mt-1">{overallAvg || 0} / 5</h2>
          <div className="mt-2.5">
            <StarRating rating={overallAvg} size="sm" />
          </div>
          <span className="text-[10px] text-ink-soft mt-1.5 font-semibold">Based on {totalReviews} reviews</span>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block">Food Taste</span>
            <h3 className="text-lg font-bold text-ink mt-0.5">{avgFood} ★</h3>
            <span className="text-[10px] text-success font-semibold">Gastronomy standard</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="bg-secondary/10 text-secondary p-3 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block">Plating Design</span>
            <h3 className="text-lg font-bold text-ink mt-0.5">{avgPresentation} ★</h3>
            <span className="text-[10px] text-success font-semibold">Visual excellence</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="bg-amber-accent/10 text-amber-accent p-3 rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block">Ambiance Score</span>
            <h3 className="text-lg font-bold text-ink mt-0.5">{avgAmbiance} ★</h3>
            <span className="text-[10px] text-success font-semibold">Atmosphere standard</span>
          </div>
        </Card>
      </div>

      {/* Reviews feed */}
      <div className="space-y-4">
        <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-ink-soft">Recent Guest Reviews</h3>
        
        <div className="space-y-4">
          {tenantReviews.map(review => (
            <Card key={review.id} className="p-5 space-y-4 border-line/60">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary-soft text-secondary font-bold text-xs flex items-center justify-center border border-secondary/10">
                    {review.userName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-ink text-sm leading-tight">{review.userName}</h4>
                    <p className="text-[10px] text-ink-soft mt-0.5">Dined recently</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-2.5 text-[10px] font-bold text-ink-soft">
                    <span>Food: {review.foodRating}★</span>
                    <span>Plating: {review.presentationRating}★</span>
                    <span>Decor: {review.ambianceRating}★</span>
                  </div>
                  <span className="text-[9px] text-ink-soft">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-ink leading-normal bg-bg/20 p-3 rounded-lg border border-line/30 italic">
                "{review.text}"
              </p>

              {review.ownerResponse && (
                <div className="bg-primary-soft/20 border-l-2 border-primary p-3 rounded-r-lg space-y-1 text-xs">
                  <span className="font-bold text-primary flex items-center gap-1.5">
                    <Reply className="w-3.5 h-3.5" />
                    Official Response
                  </span>
                  <p className="text-ink-soft leading-normal italic">
                    "{review.ownerResponse}"
                  </p>
                </div>
              )}

              {activeReplyId === review.id ? (
                <form onSubmit={(e) => handleSubmitReply(e, review.id)} className="space-y-3 pt-3 border-t border-line/60">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Draft Official Reply</label>
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Thank the guest or address their concerns..."
                      className="w-full text-xs min-h-[70px] resize-none border border-line rounded p-2.5 text-ink bg-bg-card"
                      maxLength={300}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-ink-soft uppercase tracking-wider block">Quick templates</span>
                    <div className="flex flex-wrap gap-2">
                      {REPLY_TEMPLATES.map((tmpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyTemplate(tmpl)}
                          className="text-[9px] font-semibold bg-bg hover:bg-primary-soft hover:text-primary border border-line hover:border-primary/20 rounded px-2 py-1 transition-all text-left cursor-pointer truncate max-w-xs"
                        >
                          {tmpl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1.5">
                    <Button variant="outline" size="sm" onClick={() => setActiveReplyId(null)} className="text-xs bg-bg border-line">
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm" className="text-xs flex gap-1.5 items-center">
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Response</span>
                    </Button>
                  </div>
                </form>
              ) : (
                !review.ownerResponse && (
                  <div className="flex justify-end pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReply(review.id)}
                      className="text-xs bg-bg border-line hover:bg-bg-alt flex gap-1.5 items-center"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply to Guest</span>
                    </Button>
                  </div>
                )
              )}
            </Card>
          ))}
          {tenantReviews.length === 0 && (
            <p className="text-xs text-ink-soft text-center py-10 italic">No customer reviews recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
