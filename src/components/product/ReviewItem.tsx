"use client";

import React from "react";

interface Review {
  id: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  user: {
    name: string;
  };
}

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  // Format the date
  const formattedDate = new Date(review.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="border-b border-slate-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 flex items-center justify-center text-white font-semibold">
            {review.user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Review Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-slate-900">{review.user.name}</h4>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-500">{formattedDate}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-lg ${
                  star <= review.rating ? "text-yellow-400" : "text-slate-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          {/* Review Text */}
          <p className="text-slate-700">{review.reviewText}</p>
        </div>
      </div>
    </div>
  );
};