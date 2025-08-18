"use client";

import React, { useMemo, useState } from "react";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import MainLayout from "@/widgets/layout/MainLayout";
import MainButton from "@/shared/ui/Button/MainButton";

// Тип отзыва
interface Review {
  id: number;
  name: string;
  avatar?: string;
  rating: number;
  date: string;
  text: string;
}

// Моковые отзывы
const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Анна",
    avatar: undefined,
    rating: 5,
    date: "2024-06-01",
    text: "Очень понравился сервис и качество товаров!",
  },
  {
    id: 2,
    name: "Иван",
    avatar: undefined,
    rating: 4,
    date: "2024-05-28",
    text: "Быстрая доставка, всё понравилось.",
  },
  {
    id: 3,
    name: "Мария",
    avatar: undefined,
    rating: 5,
    date: "2024-05-20",
    text: "Отличный магазин, буду заказывать ещё!",
  },
];

const ReviewCardSkeleton = () => (
  <div className="flex gap-4 p-6 bg-white rounded-xl shadow mb-4 animate-pulse">
    <Skeleton variant="circular" width={56} height={56} />
    <div className="flex-1">
      <Skeleton variant="text" width={120} height={24} />
      <Skeleton variant="text" width={80} height={20} />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={48}
        className="mt-2"
      />
    </div>
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="flex gap-4 p-6 bg-white rounded-xl shadow mb-4">
    <Avatar
      src={review.avatar}
      alt={review.name}
      sx={{ width: 56, height: 56 }}
    />
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">{review.name}</span>
        <Rating value={review.rating} readOnly size="small" />
        <span className="text-gray-400 text-xs">{review.date}</span>
      </div>
      <p className="mt-2 text-gray-700">{review.text}</p>
    </div>
  </div>
);

const REVIEWS_TO_SHOW = 5;

const ReviewsPage = () => {
  const [reviews] = useState<Review[]>(MOCK_REVIEWS);
  const [isLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const totalReviews = reviews.length;
  const averageRating = useMemo(
    () => (totalReviews ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews : 0),
    [reviews, totalReviews]
  );
  const ratingCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const idx = Math.min(5, Math.max(1, r.rating)) - 1;
      counts[idx] += 1;
    });
    return counts; // index 0 -> 1★, 4 -> 5★
  }, [reviews]);

  const visibleReviews = showAll ? reviews : reviews.slice(0, REVIEWS_TO_SHOW);

  return (
    <MainLayout>
      <Container maxWidth="md" className="py-12">
        <div className="flex flex-col mb-8">
          <h1 className="text-4xl font-light mb-2">Отзывы покупателей</h1>
          <p className="text-gray-500 mb-6">
            Честные впечатления наших клиентов о сервисе и товарах.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
              <div className="text-5xl font-ysabeau font-semibold mb-2">
                {averageRating.toFixed(1)}
              </div>
              <Rating value={averageRating} precision={0.1} readOnly size="large" />
              <div className="text-gray-500 text-sm mt-2">
                {totalReviews} отзывов
              </div>
            </div>
            <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
              {([5, 4, 3, 2, 1] as const).map((stars) => {
                const count = ratingCounts[stars - 1];
                const percent = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 mb-3 last:mb-0">
                    <div className="w-10 text-sm text-gray-600">{stars}★</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded">
                      <div className="h-2 bg-black rounded" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="w-14 text-right text-sm text-gray-600">{percent}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))
          ) : reviews.length > 0 ? (
            <>
              {visibleReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
              {reviews.length > REVIEWS_TO_SHOW && !showAll && (
                <div className="flex justify-center mt-6">
                  <MainButton
                    text="Показать все отзывы"
                    disabled={false}
                    onClick={() => setShowAll(true)}
                    type="button"
                    width="220px"
                    height="56px"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400 py-12">
              Пока нет отзывов
            </div>
          )}
        </div>

        {/* Форма добавления отключена по требованиям. */}
      </Container>
    </MainLayout>
  );
};

export default ReviewsPage;
