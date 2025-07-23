"use client";

import React, { useState } from "react";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MainLayout from "@/layout/MainLayout";
import MainButton from "@/components/Button/MainButton";

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
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", text: "", rating: 5 });
  const [showAll, setShowAll] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleRating = (
    _: React.SyntheticEvent<Element, Event>,
    value: number | null
  ) => setForm({ ...form, rating: value || 5 });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setReviews([
        {
          id: Date.now(),
          name: form.name,
          avatar: undefined,
          rating: form.rating,
          date: new Date().toISOString().slice(0, 10),
          text: form.text,
        },
        ...reviews,
      ]);
      setForm({ name: "", text: "", rating: 5 });
      setIsLoading(false);
      handleClose();
    }, 800);
  };

  const visibleReviews = showAll ? reviews : reviews.slice(0, REVIEWS_TO_SHOW);

  return (
    <MainLayout>
      <Container maxWidth="md" className="py-12">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-light mb-2">Отзывы покупателей</h1>
          <p className="text-gray-500 mb-4 text-center">
            Мы ценим ваше мнение! Оставьте отзыв о нашем магазине или прочитайте
            впечатления других покупателей.
          </p>
          <div className="w-[220px]">
            <MainButton
              text="Оставить отзыв"
              disabled={false}
              onClick={handleOpen}
              type="button"
              width="220px"
              height="56px"
            />
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

        {/* Модалка для добавления отзыва */}
        <Modal open={open} onClose={handleClose}>
          <form
            onSubmit={handleSubmit}
            className="absolute left-1/2 top-1/2 bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4"
            style={{
              transform: "translate(-50%, -50%)",
              minWidth: 320,
              maxWidth: 400,
            }}
          >
            <h2 className="text-2xl font-semibold mb-2">Оставить отзыв</h2>
            <TextField
              label="Ваше имя"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Ваш отзыв"
              name="text"
              value={form.text}
              onChange={handleChange}
              required
              multiline
              rows={3}
              fullWidth
            />
            <div className="flex items-center gap-2">
              <span>Оценка:</span>
              <Rating value={form.rating} onChange={handleRating} />
            </div>
            <MainButton
              text="Отправить"
              type="submit"
              disabled={isLoading || !form.name || !form.text}
              width="100%"
              height="56px"
            />
          </form>
        </Modal>
      </Container>
    </MainLayout>
  );
};

export default ReviewsPage;
