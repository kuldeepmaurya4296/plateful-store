'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  interactive = false,
  onRatingChange,
  size = 'md'
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  const getStarColor = (index: number) => {
    const activeVal = hoverRating !== null ? hoverRating : rating;
    if (index <= activeVal) {
      return 'fill-amber-accent text-amber-accent';
    }
    return 'text-line fill-bg-alt';
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, i) => {
        const starIdx = i + 1;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starIdx)}
            onMouseEnter={() => interactive && setHoverRating(starIdx)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform active:scale-95' : 'cursor-default'}`}
          >
            <Star className={`${starSizes[size]} ${getStarColor(starIdx)}`} />
          </button>
        );
      })}
    </div>
  );
};
