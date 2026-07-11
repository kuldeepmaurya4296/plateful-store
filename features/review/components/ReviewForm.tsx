'use client';

import React, { useState, useEffect } from 'react';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useApp } from '@/lib/AppContext';
import { Clock, ShieldAlert, Sparkles, Upload } from 'lucide-react';

interface ReviewFormProps {
  visit: {
    id: string;
    restaurantId: string;
    tableId: string;
    reviewWindowClosesAt: string;
    billId: string;
  };
  onSuccess: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ visit, onSuccess }) => {
  const { addReview, restaurants } = useApp();
  const { toast } = useToast();

  const [foodRating, setFoodRating] = useState(5);
  const [presentationRating, setPresentationRating] = useState(5);
  const [ambianceRating, setAmbianceRating] = useState(5);
  const [text, setText] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [isExpired, setIsExpired] = useState(false);

  const restaurant = restaurants.find(r => r.id === visit.restaurantId);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(visit.reviewWindowClosesAt) - +new Date();
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft(0);
      } else {
        setTimeLeft(Math.floor(difference / 1000));
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [visit.reviewWindowClosesAt]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) {
      toast({
        type: 'error',
        title: 'Review Window Expired',
        description: 'Reviews must be submitted within the 10-minute window.'
      });
      return;
    }

    const reviewId = `rv_dyn_${Date.now()}`;
    const newReview = {
      id: reviewId,
      visitId: visit.id,
      restaurantId: visit.restaurantId,
      userId: 'u1',
      userName: 'Riya Kapoor',
      foodRating,
      presentationRating,
      ambianceRating,
      text,
      createdAt: new Date().toISOString()
    };

    addReview(newReview);
    toast({
      type: 'success',
      title: 'Review Submitted',
      description: 'Your feedback has been published to the restaurant profile.'
    });
    onSuccess();
  };

  if (isExpired) {
    return (
      <div className="text-center py-6 space-y-3">
        <div className="w-12 h-12 bg-danger-bg text-danger rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-serif font-semibold text-ink">Review Window Closed</h3>
        <p className="text-xs text-ink-soft max-w-xs mx-auto leading-relaxed">
          The strict 10-minute review window for this visit has expired. Feedback is restricted to verify recent dining.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Time limit alert */}
      <div className="bg-primary-soft text-primary p-3 rounded-lg flex items-center gap-3">
        <Clock className="w-5 h-5 animate-pulse flex-shrink-0" />
        <div className="text-xs leading-normal">
          <span className="font-bold">{formatTime(timeLeft)} left</span> to review. Submission is disabled once the timer hits zero.
        </div>
      </div>

      <div className="space-y-4">
        {/* Restaurant Title */}
        <h4 className="text-sm font-semibold text-ink">
          Rate your visit at {restaurant?.name || 'Spice Route'}
        </h4>

        {/* Rating categories */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-ink-soft">Food Taste</span>
            <StarRating rating={foodRating} interactive onRatingChange={setFoodRating} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-ink-soft">Presentation</span>
            <StarRating rating={presentationRating} interactive onRatingChange={setPresentationRating} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-ink-soft">Ambiance</span>
            <StarRating rating={ambianceRating} interactive onRatingChange={setAmbianceRating} />
          </div>
        </div>

        {/* Review commentary */}
        <div className="flex flex-col gap-1.5 pt-2">
          <label className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
            Review Commentary
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Tell us about the plating, cutlery, food flavors..."
            className="w-full text-xs min-h-[90px] resize-none"
            maxLength={250}
          />
        </div>

        {/* Photo attachment simulation */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
            Attach Plating Photo (Optional)
          </label>
          <div className="border-1.5 border-dashed border-line rounded-lg p-4 text-center cursor-pointer hover:bg-bg-alt/25 transition-all">
            <Upload className="w-5 h-5 text-ink-soft mx-auto mb-1" />
            <span className="text-[10px] text-ink-soft block font-medium">Click to upload photo</span>
          </div>
        </div>
      </div>

      <Button type="submit" variant="primary" fullWidth className="py-2.5 flex items-center gap-1.5 justify-center">
        <Sparkles className="w-4 h-4" />
        <span>Publish Verified Review</span>
      </Button>
    </form>
  );
};
