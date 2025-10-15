"use client";

import { Button } from "@/src/components/UI/Button";
import { RadioButton } from "@/src/components/UI/RadioButton";
import useAuthStore from "@/src/stores/authStore";
import { DeliverySpeed, Review } from "@/src/types/user";
import { addStoreReview } from "@/src/utils/users";
import { useTranslations } from "next-intl";
import { FC, useState } from "react";

interface GiveReviewProps {
  storeId: string;
  //   userId: string;
  //   userName: string;

  //   onSubmitReview?: (review: {
  //     rating: number;
  //     comment: string;
  //     deliverySpeed?: string | null;
  //   }) => void;
}

const GiveReview: FC<GiveReviewProps> = ({ storeId }) => {
  const { userData } = useAuthStore();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [deliverySpeed, setDeliverySpeed] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const t = useTranslations("StoreProfile");

  const dr = useTranslations("Bazaar");

  const deliveryRate = [
    { id: 1, name: dr("quickDelivery"), value: "1" },
    { id: 2, name: dr("fastDelivery"), value: "2" },
    { id: 3, name: dr("averageDelivery"), value: "3" },
    { id: 4, name: dr("slowDelivery"), value: "4" },
    { id: 5, name: dr("slowestDelivery"), value: "5" },
  ];

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData) return;

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (comment.trim() === "") {
      alert("Please write a review");
      return;
    }

    setIsSubmitting(true);

    try {
      await addStoreReview(storeId, {
        userId: userData.id,
        userName: userData.fullName,
        rating,
        comment: comment.trim(),
        deliverySpeed: deliverySpeed as unknown as DeliverySpeed,
      });

      // Reset form after successful submission
      setRating(0);
      setComment("");
      setDeliverySpeed(null);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) return <div>Submitting...</div>;

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="">
          <label
            htmlFor="review-comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <span data-translated>{t("leaveReview")}</span>
          </label>
          <textarea
            id="review-comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none mt-2 block w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={t("writeReviewPlaceholder")}
          />
        </div>

        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span data-translated>{t("rating")}</span>
          </label>
          {/* Star Rating Component */}
          <div className="flex items-center gap-2 text-primary rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                className={`text-3xl transition-colors hover:scale-110 ${
                  star <= rating
                    ? "text-primary"
                    : "text-gray-300 hover:text-primary/60"
                }`}
              >
                {star <= rating ? "★" : "☆"}
              </button>
            ))}
          </div>
        </div>
        <div className="">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            <span data-translated>{t("deliverySpeed")}</span>
          </label>
          <div className="space-y-3">
            {deliveryRate.map((rate) => (
              <RadioButton
                key={rate.id}
                id={`delivery-${rate.id}`}
                name="delivery-rate"
                value={rate.value}
                checked={deliverySpeed === rate.value}
                onChange={setDeliverySpeed}
                label={rate.name}
                className=""
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting || rating === 0 || comment.trim() === ""}
          className="my-4"
        >
          <span data-translated>
            {isSubmitting ? t("submittingReview") : t("submitReview")}
          </span>
        </Button>
      </form>
    </div>
  );
};

export default GiveReview;
